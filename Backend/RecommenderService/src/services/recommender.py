from typing import List

from models.embeddings import textVectorization
from db.vector_ops import add_user, search_user, get_user, delete_user
from db.online_users_ops import add_active_user, find_similar_user, remove_active_user

def process_and_add_user(user_id: int | str, interest: str | List[str]) -> None:
    vector = textVectorization(interest)
    # split_interest = interest.split()
    add_user(user_id, vector, payload={"interest": interest})

def get_similar_user(user_id: int | str) -> int:
    # vector = get_vector(user_id=user_id)
    result = find_similar_user(user_id)

    if not result:
        return None
    
    user = result

    return user

def active_user(user_id: int) -> None:
    user = get_user(user_id)
    id = user.id
    vector = user.vector
    payload = user.payload

    add_active_user(user_id=id, vector=vector, payload=payload)

def delete_active_user(user_id: int) -> None:
    remove_active_user(user_id=user_id)
    print(f"{user_id} user deleted from active collection")

def delete_user_permanently(user_id: int) -> None:
    delete_user(user_id)