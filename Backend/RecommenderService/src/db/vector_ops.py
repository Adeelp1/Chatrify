from qdrant_client.models import PointStruct
from typing import List

from .qdrantClient import client, COLLECTION_NAME

def add_user(user_id: int, vector: List, payload: dict = None) -> None:
    client.upsert(
        collection_name=COLLECTION_NAME,
        wait=True,
        points=[
            PointStruct(id=user_id, vector=vector, payload=payload)
        ],
    )

def search_user(vector: List | int | str):
    search_result = client.query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        with_payload=False,
        with_vectors=True,
        limit=3
    ).points
    
    return search_result

def get_user(user_id: int):
    result = client.retrieve(
        collection_name=COLLECTION_NAME,
        ids=[user_id],
        with_vectors=True,
        with_payload=True
    )

    user = result[0]

    return user

def delete_user(user_id: int):
    client.delete(
        collection_name=COLLECTION_NAME,
        points_selector=[user_id],
        wait=True
    )