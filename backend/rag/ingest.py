import os
import pickle
import faiss
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

# Configuration
DATASET_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', os.getenv("DATASET_PDF_PATH", "data/resume_and_interview_pairs_dataset.pdf")))
INDEX_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'faiss_index'))
INDEX_PATH = os.path.join(INDEX_DIR, 'index.faiss')
META_PATH = os.path.join(INDEX_DIR, 'meta.pkl')
EMBED_MODEL = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

def ingest_pdf():
    if not os.path.exists(DATASET_PATH):
        print(f"Error: Dataset PDF not found at {DATASET_PATH}")
        return

    print(f"Reading {DATASET_PATH}...")
    reader = PdfReader(DATASET_PATH)
    pages_text = []
    for page in reader.pages:
        content = page.extract_text()
        if content:
            pages_text.append(str(content))
    
    text = "\n".join(pages_text)

    # Chunk text
    chunk_size = 900
    overlap = 150
    chunks = []
    if text:
        for i in range(0, len(text), chunk_size - overlap):
            chunk = text[i : i + chunk_size]
            chunks.append(chunk)

    print(f"Created {len(chunks)} chunks.")

    # Embed chunks
    print(f"Embedding with {EMBED_MODEL}...")
    model = SentenceTransformer(EMBED_MODEL)
    embeddings = model.encode(chunks)

    # Create FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    # Save
    if not os.path.exists(INDEX_DIR):
        os.makedirs(INDEX_DIR)
    
    faiss.write_index(index, INDEX_PATH)
    with open(META_PATH, 'wb') as f:
        pickle.dump(chunks, f)

    print(f"Index saved to {INDEX_DIR}")

if __name__ == "__main__":
    ingest_pdf()
