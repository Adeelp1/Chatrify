package client

import (
	"net/http"
)

type RecommenderClient struct {
	httpClient       *http.Client
	recommendBaseURL string
}

func NewRecommenderClients(recommendBaseURL string) *RecommenderClient {
	return &RecommenderClient{
		httpClient:       &http.Client{},
		recommendBaseURL: recommendBaseURL,
	}
}
