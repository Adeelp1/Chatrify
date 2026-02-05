from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from services.recommender import (
    process_and_add_user, 
    get_similar_user, 
    active_user,
    delete_active_user,
    delete_user_permanently
)

app = FastAPI()

class Interest(BaseModel):
    user_id: int
    interest: str | List[str]


# main collection
@app.post('/api/interest')
def get_interest(data: Interest) -> None:
    process_and_add_user(user_id=data.user_id, interest=data.interest)

@app.delete('/api/delete')
def delete_user(user_id: int):
    delete_user_permanently(user_id=user_id)

# temporary collection
@app.get('/api/recommend')
def recommend(user_id: int) -> int:
    return get_similar_user(user_id=user_id)

@app.get('/api/newuser')
def new_user_connected(user_id: int):
    active_user(user_id=user_id)

@app.delete('/api/disconnect')
def user_disconnected(user_id: int):
    delete_active_user(user_id=user_id)

# if __name__ == "__main__":
#     from tests import test_qdrant, test_vectorizer
#     test_qdrant.test_qdrant_operations()
# #     # test_vectorizer.test()