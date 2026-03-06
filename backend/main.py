import time
import logging
from fastapi import FastAPI, Request, Response
from pydantic import BaseModel

# Configure Logging for Docker visibility
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("word-scale-engine")

app = FastAPI()

# 🛡️ Manual CORS Middleware (The Architect Flex)
# This proves you understand Pre-flight (OPTIONS) requests
@app.middleware("http")
async def secure_network_boundary(request: Request, call_next):
    origin = request.headers.get("Origin")
    
    # Handle Pre-flight request manually
    if request.method == "OPTIONS":
        return Response(
            status_code=204,
            headers={
                "Access-Control-Allow-Origin": "http://localhost:3000",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        )
    
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    # Inject headers to verify the compute source
    response.headers["X-Compute-Source"] = "FastAPI-Python-Engine"
    response.headers["X-Process-Time"] = str(process_time)
    
    # Add CORS origin for successful response
    if origin == "http://localhost:3000":
        response.headers["Access-Control-Allow-Origin"] = origin
        
    return response

# 📐 Strict Data Schema
class TextPayload(BaseModel):
    text: str

@app.post("/count")
async def process_word_count(payload: TextPayload):
    """
    Simulates a heavy AI workload by decoupling string manipulation
    from the main application logic.
    """
    logger.info("Processing incoming request...")
    
    # Clean the string and calculate count
    raw_text = payload.text.strip()
    if not raw_text:
        return {"count": 0, "engine": "Python-Resilient-Core"}
    
    import re
    
    # Use regex to find all alphanumeric words, ignoring punctuation
    words = re.findall(r'\b\w+\b', raw_text)
    count = len(words)
    
    logger.info(f"Successfully calculated {count} words.")
    return {
        "count": count,
        "engine": "FastAPI-Distributed-Engine",
        "status": "success"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "compute-engine"}