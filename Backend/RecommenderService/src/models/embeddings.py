from sentence_transformers import SentenceTransformer
import numpy as np

from typing import List

MODEL = "all-MiniLM-L6-v2" # 384 dims,

model = SentenceTransformer(MODEL) 
print("model loaded")

def textVectorization(interests: List[str] | str) -> List[float]:
    """
        interests: list of tokens or short string, e.g. ["Sport", "movie", "music"]
        returns : normalized dense vector (list of float)
    """

    if not interests:
        # return zero vector (same dimension as model)
        return [0.0] * model.get_sentence_embedding_dimension()
    
    # join interests into one text — keeps context and order less important
    text = " . ".join([s.strip() for s in interests if s.strip()])
    emb = model.encode(text, convert_to_numpy=True)

    # normalize for cosine similarity
    norm = np.linalg.norm(emb)

    if norm > 0:
        emb = emb / norm
    
    return emb.tolist()