from models.embeddings import textVectorization

def test():
    result = textVectorization(["sports movie music"])
    print(result)