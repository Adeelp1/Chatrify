package client

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
)

func (c *ServiceClients) RecommendUser(userId int) (int, error) {
	// define query parameters
	params := url.Values{}
	params.Add("user_id", strconv.Itoa(userId))

	baseURL := c.recommender.recommendBaseURL + "/api/recommend"
	fullURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	// Create response
	req, err := http.NewRequest(http.MethodGet, fullURL, nil)
	if err != nil {
		return 0, err
	}

	req.Header.Set("Accept", "application/json")

	// Send response
	res, err := c.recommender.httpClient.Do(req)
	if err != nil {
		return 0, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("recommender returned status %d", res.StatusCode)
	}

	// Read response
	data, err := io.ReadAll(res.Body)
	if err != nil {
		return 0, err
	}

	var result int
	if err := json.Unmarshal(data, &result); err != nil {
		return 0, err
	}

	return result, nil
}
