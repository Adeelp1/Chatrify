from qdrant_client.models import PointStruct
from typing import List

from .qdrantClient import client, ACTIVE_USER_COLLECTION_NAME

def add_active_user(user_id: int, vector: List, payload: dict = None):
    client.upsert(
        collection_name=ACTIVE_USER_COLLECTION_NAME,
        points=[
            PointStruct(id=user_id, vector=vector, payload=payload)
        ],
        wait=True
    )

def find_similar_user(user_id: int) -> int:
    result = client.query_points(
        collection_name=ACTIVE_USER_COLLECTION_NAME,
        query=user_id
    )

    if not result.points:
        return None
    
    user = result.points[0]

    return user.id

def remove_active_user(user_id: int):
    client.delete(
        collection_name=ACTIVE_USER_COLLECTION_NAME,
        points_selector=[user_id],
        wait=True
    )