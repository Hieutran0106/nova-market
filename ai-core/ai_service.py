from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import sys
import io
import psycopg2
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

cuda_bin = r"D:\App\Enviroment\Python\Python314\Lib\site-packages\nvidia\cuda_runtime\bin"
cublas_bin = r"D:\App\Enviroment\Python\Python314\Lib\site-packages\nvidia\cublas\bin"
os.environ["PATH"] = f"{cuda_bin};{cublas_bin};{os.environ['PATH']}"

from llama_cpp import Llama

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)

app = FastAPI(title="AI Core Service", description="Core Microservice for Qwen/Llama Model & Vector Search")

class GenerateRequest(BaseModel):
    system_prompt: str
    user_message: str
    max_tokens: int = 300

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

model_path = "qwen2.5-1.5b-instruct-q4_k_m.gguf"
llm = None

# --- RAG Components ---
embedding_model = None
product_data = [] # List of dicts
product_vectors = None

def load_products_from_db():
    global product_data, product_vectors
    print("⏳ Đang kết nối Database để lấy dữ liệu sản phẩm...")
    try:
        conn = psycopg2.connect(
            dbname="advisor_db",
            user="postgres",
            password="0329584430",
            host="localhost",
            port="5432"
        )
        cursor = conn.cursor()
        cursor.execute("SELECT id, category, brand, model_name, price_vnd, key_features FROM products WHERE in_stock = true")
        rows = cursor.fetchall()
        
        print(f"Bắt đầu Embedding (Mã hóa Vector)")
        
        texts_to_embed = []
        for row in rows:
            formatted_text = f"- {row[1]} {row[2]} {row[3]}: Giá {row[4]:,} VNĐ. Điểm nổi bật: {row[5]}"
            
            search_text = f"Category: {row[1]}, Brand: {row[2]}, Model: {row[3]}, Features: {row[5]}"
            
            product_data.append({
                'id': row[0],
                'formatted_text': formatted_text,
                'search_text': search_text
            })
            texts_to_embed.append(search_text)
            
        if texts_to_embed:
            embeddings = embedding_model.encode(texts_to_embed)
            product_vectors = np.array(embeddings)
        print("✅ Hoàn tất tải Dữ liệu Vector!")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ Lỗi khi tải dữ liệu DB: {e}")

@app.on_event("startup")
def startup_event():
    global llm, embedding_model
    
    # 1. Load Embedding Model for RAG
    print("⏳ Đang tải mô hình Embedding (all-MiniLM-L6-v2)...")
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # 2. Load Data from DB to Memory
    load_products_from_db()
    
    # 3. Load Qwen LLM
    if not os.path.exists(model_path):
        print(f"❌ Không tìm thấy file {model_path} trong thư mục AICore.")
        return
    print("⏳ Đang tải bộ não Qwen2-1.5B vào VRAM (AICore)...")
    llm = Llama(
        model_path=model_path,
        n_ctx=16384,  
        n_gpu_layers=-1, 
        verbose=False
    )
    print("✅ Đã kích hoạt lõi AI Qwen2-1.5B thành công trong AICore!")

@app.post("/search")
def search_products(req: SearchRequest):
    if product_vectors is None or len(product_data) == 0:
        return {"results": []}
    
    query_vector = embedding_model.encode([req.query])
    
    similarities = cosine_similarity(query_vector, product_vectors)[0]
    
    top_indices = np.argsort(similarities)[::-1][:req.top_k]
    
    results = []
    for idx in top_indices:
        results.append(product_data[idx]['formatted_text'])
        
    return {"results": results}

@app.post("/generate")
def generate_response(req: GenerateRequest):
    if llm is None:
        raise HTTPException(status_code=503, detail="AI Model is not loaded")
    
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
