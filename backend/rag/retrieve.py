import os
import pickle
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

# Load .env from backend directory (override=True to override existing env vars)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"), override=True)

INDEX_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'faiss_index'))
INDEX_PATH = os.path.join(INDEX_DIR, 'index.faiss')
META_PATH = os.path.join(INDEX_DIR, 'meta.pkl')
EMBED_MODEL = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

_model = None
_index = None
_chunks = None

def load_resources():
    global _model, _index, _chunks
    if _model is None:
        try:
            _model = SentenceTransformer(EMBED_MODEL)
        except Exception as e:
            print(f"Error loading SentenceTransformer: {e}")
    if _index is None:
        if os.path.exists(INDEX_PATH):
            try:
                _index = faiss.read_index(INDEX_PATH)
            except Exception as e:
                print(f"Error reading FAISS index: {e}")
        else:
            print("FAISS index not found. Run ingest.py first.")
    if _chunks is None:
        if os.path.exists(META_PATH):
            try:
                with open(META_PATH, 'rb') as f:
                    _chunks = pickle.load(f)
            except Exception as e:
                print(f"Error loading chunks: {e}")

def retrieve(query: str, k: int = 6):
    load_resources()
    model = _model
    index = _index
    chunks = _chunks
    
    if model is None or index is None or chunks is None:
        return []
    
    try:
        # Help the IDE with type narrowing
        query_embedding = model.encode([query])
        # Faiss search returns distances and indices
        distances, indices = index.search(np.array(query_embedding).astype('float32'), k)
        
        results = []
        indices_arr = np.array(indices)
        distances_arr = np.array(distances)
        
        if indices_arr.ndim > 0 and indices_arr.shape[0] > 0:
            for i in range(len(indices_arr[0])):
                idx = int(indices_arr[0][i])
                # Double-check chunks is not None even if checked above
                if chunks is not None and 0 <= idx < len(chunks):
                    results.append({
                        "text": str(chunks[idx]),
                        "score": float(distances_arr[0][i])
                    })
        return results
    except Exception as e:
        print(f"Error in retrieve: {e}")
        return []
    except Exception as e:
        print(f"Error in retrieve: {e}")
        return []
