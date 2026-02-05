from db.vector_ops import add_user, search_user
from models.embeddings import textVectorization

def test_qdrant_operations():
    vector = textVectorization(["sports, movie, music"])
    add_user(1, vector=vector)
    print("user1 added")
    # print(vector)

    vector1 = textVectorization(["violence, prank, funny"])
    add_user(2, vector=vector1)
    print("user2 added")
    # print(vector1)

    vector2 = textVectorization([""])
    add_user(3, vector=vector2)
    search_result = search_user(vector2)
    print("search .......")
    for s in search_result:
        print(s.score, s.id)

    result_vector = search_user(3)
    print("Vector ........")
    print(result_vector[0].id)

    # print("\n\nStepTwo")
    # search_result = search_user(result_vector)
    # print("search....")
    # print(search_result)