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

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private ProductRepository productRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String AI_CORE_URL = "http://localhost:8001/generate";

    @PostMapping("/generate")
    public ResponseEntity<?> generateResponse(@RequestBody AiGenerateRequest req) {
        try {
            // Lấy 30 sản phẩm từ DB
            Page<Product> productPage = productRepository.findAll(PageRequest.of(0, 30));
            List<Product> products = productPage.getContent();

            StringBuilder inventory = new StringBuilder();
            for (Product p : products) {
                inventory.append(String.format("- %s %s %s: Giá %,d VNĐ. Điểm nổi bật: %s\n",
                        p.getCategory(), p.getBrand(), p.getModelName(), p.getPriceVnd(), p.getKeyFeatures()));
            }

            // Tạo đoạn Context Khách hàng (nếu có)
            String customerContextStr = "";
            AiGenerateRequest.UserContext userContext = req.getUserContext();
            String name = "bạn";

            if (userContext != null) {
                name = userContext.getName() != null ? userContext.getName() : "bạn";
                List<String> cart = userContext.getCart();
                String cartStr = (cart != null && !cart.isEmpty()) ? String.join(", ", cart) : "chưa có sản phẩm nào";
                customerContextStr = String.format("""
[THÔNG TIN KHÁCH HÀNG ĐANG CHAT]
- Tên khách hàng: %s
- Các sản phẩm đang nằm trong giỏ hàng của %s: %s
=> LƯU Ý QUAN TRỌNG: Hãy xưng hô bằng tên của khách hàng (%s) để tạo sự thân thiện. Chủ động nhắc đến các sản phẩm trong giỏ hàng nếu thấy phù hợp với câu hỏi của họ, hỏi xem họ có cần tư vấn thêm về các món đồ trong giỏ không.
""", name, name, cartStr, name);
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
Dưới đây là danh sách sản phẩm TỒN KHO THỰC TẾ:
%s
(Tuyệt đối KHÔNG bịa ra sản phẩm hay mức giá không có trong danh sách trên).""", name, customerContextStr, inventory.toString());

            AiCoreRequest coreReq = new AiCoreRequest();
            coreReq.setSystemPrompt(systemPrompt);
            coreReq.setUserMessage(req.getSeed());
            coreReq.setMaxTokens(500);

            // Gửi request sang AI-core
            ResponseEntity<AiCoreResponse> aiResponse = restTemplate.postForEntity(AI_CORE_URL, coreReq, AiCoreResponse.class);

            if (aiResponse.getStatusCode().is2xxSuccessful() && aiResponse.getBody() != null) {
                return ResponseEntity.ok(Map.of("text", aiResponse.getBody().getText()));
            } else {
                return ResponseEntity.ok(Map.of("text", "Xin lỗi, hiện tại tôi không thể kết nối tới bộ não AI."));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
