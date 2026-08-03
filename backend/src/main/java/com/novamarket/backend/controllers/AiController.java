package com.novamarket.backend.controllers;

import com.novamarket.backend.dto.AiCoreRequest;
import com.novamarket.backend.dto.AiCoreResponse;
import com.novamarket.backend.dto.AiGenerateRequest;
import com.novamarket.backend.models.Product;
import com.novamarket.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import com.novamarket.backend.models.Customer;
import com.novamarket.backend.models.CustomerProfile;
import com.novamarket.backend.repositories.CustomerRepository;
import com.novamarket.backend.repositories.CustomerProfileRepository;

@RestController
@RequestMapping("/api")
public class AiController {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private CustomerProfileRepository customerProfileRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String AI_CORE_URL = "http://localhost:8001/generate";

    @PostMapping("/generate")
    public ResponseEntity<?> generateResponse(@RequestBody AiGenerateRequest req) {
        try {
            String searchQuery = req.getSeed();
            if (req.getHistory() != null && !req.getHistory().isEmpty()) {
                for (int i = req.getHistory().size() - 1; i >= 0; i--) {
                    AiGenerateRequest.ChatMessage msg = req.getHistory().get(i);
                    if ("user".equals(msg.getRole())) {
                        searchQuery = msg.getText() + " " + searchQuery;
                        break;
                    }
                }
            }

            // Tìm kiếm 5 sản phẩm sát nghĩa nhất bằng AI Vector Search
            String AI_SEARCH_URL = "http://localhost:8001/search";
            Map<String, Object> searchReq = Map.of("query", searchQuery, "top_k", 5);
            ResponseEntity<Map> searchRes = restTemplate.postForEntity(AI_SEARCH_URL, searchReq, Map.class);
            
            StringBuilder inventory = new StringBuilder();
            if (searchRes.getStatusCode().is2xxSuccessful() && searchRes.getBody() != null) {
                List<String> results = (List<String>) searchRes.getBody().get("results");
                if (results != null && !results.isEmpty()) {
                    for (String res : results) {
                        inventory.append(res).append("\n");
                    }
                } else {
                    inventory.append("Hiện tại cửa hàng không có sản phẩm nào trực tiếp phù hợp với yêu cầu.\n");
                }
            }

            // Tạo đoạn Context Khách hàng (nếu có)
            String customerContextStr = "";
            AiGenerateRequest.UserContext userContext = req.getUserContext();
            String name = "bạn";
            String profileContext = "";

            if (userContext != null) {
                name = userContext.getName() != null ? userContext.getName() : "bạn";
                
                // Trích xuất profile cũ nếu có
                if (userContext.getProfile() != null && !userContext.getProfile().isEmpty()) {
                    profileContext = "\n- Hồ sơ khách hàng (AI tự nhận diện): " + userContext.getProfile();
                } else if (userContext.getPhone() != null && !userContext.getPhone().isEmpty()) {
                    // Nếu đã đăng nhập, thử tìm trong DB
                    Optional<Customer> optCust = customerRepository.findByPhone(userContext.getPhone());
                    if (optCust.isPresent()) {
                        Optional<CustomerProfile> optProf = customerProfileRepository.findByUserId(optCust.get().getUserId());
                        if (optProf.isPresent() && optProf.get().getPreferences() != null) {
                            profileContext = "\n- Hồ sơ khách hàng (AI tự nhận diện): " + optProf.get().getPreferences();
                        }
                    }
                }

                List<String> cart = userContext.getCart();
                String cartStr = (cart != null && !cart.isEmpty()) ? String.join(", ", cart) : "chưa có sản phẩm nào";
                customerContextStr = String.format("""
[THÔNG TIN KHÁCH HÀNG ĐANG CHAT]
- Tên khách hàng: %s
- Các sản phẩm đang nằm trong giỏ hàng của %s: %s%s
=> LƯU Ý QUAN TRỌNG: Hãy xưng hô bằng tên của khách hàng (%s) để tạo sự thân thiện. Dựa vào Hồ sơ khách hàng (nếu có) để thấu hiểu họ hơn.
""", name, name, cartStr, profileContext, name);
            }

            String systemPrompt = String.format("""
Bạn là một chuyên gia tư vấn công nghệ tinh tế, ấm áp và thấu hiểu tâm lý con người.
Nhiệm vụ của bạn không chỉ là bán hàng, mà là lắng nghe và giải quyết vấn đề của khách hàng.
Hãy tuân thủ các nguyên tắc sau:
1. Đồng cảm: Luôn thể hiện sự quan tâm đến nhu cầu hoặc khó khăn của họ (VD: "Mình hiểu %s đang tìm một chiếc máy mỏng nhẹ...").
2. Khai thác nhu cầu: Nếu khách yêu cầu chung chung, hãy khéo léo hỏi thêm về ngân sách, sở thích, hoặc mục đích sử dụng.
3. Tư vấn cá nhân hóa: Giải thích rõ "TẠI SAO" sản phẩm này lại hợp với họ, đánh trúng vào tâm lý và mong muốn.
4. Giọng điệu: Thân thiện, xưng "mình" và gọi khách bằng tên của họ, dùng emoji một cách chừng mực để tạo sự gần gũi.
%s
Dưới đây là danh sách 5 sản phẩm TỒN KHO THỰC TẾ (do hệ thống tự động lọc ra):
%s
LỆNH BẮT BUỘC (CRITICAL): 
- CHỈ ĐƯỢC PHÉP tư vấn và đề xuất các sản phẩm có mặt trong danh sách TỒN KHO THỰC TẾ ở trên.
- TUYỆT ĐỐI KHÔNG tự bịa ra sản phẩm, cấu hình, hay mức giá khác không có trong danh sách. (Ví dụ: Không được tự ý đưa ra một chiếc máy 2.5 triệu nếu trong danh sách không có).
- Nếu trong danh sách TỒN KHO KHÔNG CÓ sản phẩm nào đáp ứng đúng tầm giá (ví dụ: khách đòi 18-22 triệu mà kho toàn 24-25 triệu), HÃY THÀNH THẬT XIN LỖI LÀ KHÔNG CÓ, và gợi ý khách các mẫu ở mức giá gần nhất CÓ TRONG KHO.""", name, customerContextStr, inventory.toString());

            AiCoreRequest coreReq = new AiCoreRequest();
            coreReq.setSystemPrompt(systemPrompt);
            coreReq.setUserMessage(req.getSeed());
            coreReq.setHistory(req.getHistory());
            coreReq.setMaxTokens(1024);

            // Gửi request sang AI-core
            ResponseEntity<AiCoreResponse> aiResponse = restTemplate.postForEntity(AI_CORE_URL, coreReq, AiCoreResponse.class);
            
            // Lấy profile tuần tự thay vì song song (tránh lỗi đồng thời trên llama-cpp-python)
            String extractedProfileJson = null;
            try {
                String extractUrl = "http://localhost:8001/extract_profile";
                Map<String, String> extractReq = Map.of("user_message", req.getSeed());
                ResponseEntity<Map> extractRes = restTemplate.postForEntity(extractUrl, extractReq, Map.class);
                if (extractRes.getStatusCode().is2xxSuccessful() && extractRes.getBody() != null) {
                    extractedProfileJson = (String) extractRes.getBody().get("json");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            
            // Lưu vào DB nếu đã đăng nhập
            if (extractedProfileJson != null && userContext != null && userContext.getPhone() != null && !userContext.getPhone().isEmpty()) {
                Optional<Customer> optCust = customerRepository.findByPhone(userContext.getPhone());
                if (optCust.isPresent()) {
                    String uId = optCust.get().getUserId();
                    CustomerProfile cp = customerProfileRepository.findByUserId(uId).orElse(new CustomerProfile());
                    cp.setUserId(uId);
                    cp.setPreferences(extractedProfileJson);
                    customerProfileRepository.save(cp);
                }
            }

            if (aiResponse.getStatusCode().is2xxSuccessful() && aiResponse.getBody() != null) {
                return ResponseEntity.ok(Map.of(
                    "text", aiResponse.getBody().getText(),
                    "profile", extractedProfileJson != null ? extractedProfileJson : ""
                ));
            } else {
                return ResponseEntity.ok(Map.of("text", "Xin lỗi, hiện tại tôi không thể kết nối tới bộ não AI."));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
