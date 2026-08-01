from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import sys
import io

# Thêm đường dẫn chứa file CUDA DLL vừa cài bằng pip vào biến môi trường PATH
cuda_bin = r"D:\App\Enviroment\Python\Python314\Lib\site-packages\nvidia\cuda_runtime\bin"
cublas_bin = r"D:\App\Enviroment\Python\Python314\Lib\site-packages\nvidia\cublas\bin"
os.environ["PATH"] = f"{cuda_bin};{cublas_bin};{os.environ['PATH']}"

from llama_cpp import Llama

# Sửa lỗi in ký tự Unicode trên Windows Terminal
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)

app = FastAPI(title="AI Core Service", description="Core Microservice for Qwen/Llama Model")

class GenerateRequest(BaseModel):
    system_prompt: str
    user_message: str
    max_tokens: int = 300

# Khởi tạo model khi start app
model_path = "qwen2.5-1.5b-instruct-q4_k_m.gguf"
llm = None

@app.on_event("startup")
def load_model():
    global llm
    if not os.path.exists(model_path):
        print(f"❌ Không tìm thấy file {model_path} trong thư mục AICore.")
        return
    print("Đang tải bộ não Qwen2-1.5B vào VRAM (AICore)...")
    llm = Llama(
        model_path=model_path,
        n_ctx=8192,
        n_gpu_layers=-1,
        verbose=False
    )
    print("✅ Đã kích hoạt lõi AI Qwen2-1.5B thành công trong AICore!")

@app.post("/generate")
def generate_response(req: GenerateRequest):
    if llm is None:
        raise HTTPException(status_code=503, detail="AI Model is not loaded")
    
    # Định dạng ChatML
    prompt = f"<|im_start|>system\n{req.system_prompt}<|im_end|>\n<|im_start|>user\n{req.user_message}<|im_end|>\n<|im_start|>assistant\n"
    
    try:
        response_stream = llm(
            prompt,
            max_tokens=req.max_tokens,
            stop=["<|im_end|>"],
            echo=False
        )
        bot_reply = response_stream['choices'][0]['text'].strip()
        return {"text": bot_reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("🚀 Khởi động AI Core Service tại http://localhost:8001")
    uvicorn.run("ai_service:app", host="0.0.0.0", port=8001, reload=False)
