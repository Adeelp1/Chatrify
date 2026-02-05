package client

import "net/http"

type MainServerClient struct {
	httpClient        *http.Client
	mainServerBaseURL string
}

func NewMainServerClient(mainServerBaseURL string) *MainServerClient {
	return &MainServerClient{
		httpClient:        &http.Client{},
		mainServerBaseURL: mainServerBaseURL,
	}
}
