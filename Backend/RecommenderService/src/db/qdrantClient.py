from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance

url = "http://localhost:6333"
COLLECTION_NAME = "users_vector"
ACTIVE_USER_COLLECTION_NAME = "active_users"

# try:
#     client = QdrantClient(location=":memory:")
#     if not client.collection_exists(collection_name=COLLECTION_NAME):
#         client.create_collection(
#             collection_name = COLLECTION_NAME,
#             vectors_config=VectorParams(size=3, distance=Distance.COSINE),
#         )
# except :
#     # raise ConnectionRefusedError
#     exit(ConnectionRefusedError(QdrantClient))

client = QdrantClient(location=":memory:")
client.recreate_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=VectorParams(size=384, distance=Distance.COSINE)
)


client.recreate_collection(
    collection_name=ACTIVE_USER_COLLECTION_NAME,
    vectors_config=VectorParams(size=384, distance=Distance.COSINE)
)