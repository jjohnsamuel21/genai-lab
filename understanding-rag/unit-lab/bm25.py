from rank_bm25 import BM25Okapi

documents = [
    "Redis is used for caching and session management.",
    "SQS retries failed messages before moving them to DLQ.",
    "HTTP 429 indicates that the API rate limit has been exceeded.",
    "Redis supports pub sub and distributed caching."
]

tokenized_docs = [
    doc.lower().split()
    for doc in documents
]

bm25 = BM25Okapi(tokenized_docs)

query = "Redis caching"

tokenized_query = query.lower().split()

scores = bm25.get_scores(tokenized_query)

for doc, score in zip(documents, scores):
    print(score, doc)

  
ranked_docs = sorted(
    zip(documents, scores),
    key=lambda x: x[1],
    reverse=True
)

print("\nRanked Documents:", ranked_docs)