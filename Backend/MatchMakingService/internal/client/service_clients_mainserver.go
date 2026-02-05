package client

import (
	"bytes"
	"fmt"
	"net/http"

	"matchmaking/engine/internal/models"
	"matchmaking/engine/internal/utils"
)

func (c *ServiceClients) SendRecommendUser(userId, recommendedUserId int) error {
	body := models.MatchmakingResponse{
		UserA: userId,
		UserB: recommendedUserId,
	}

	jsonData, err := utils.ToJSON(body)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(
		"POST",
		c.mainServer.mainServerBaseURL+"/api/match",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		return err
	}
	fmt.Println(c.mainServer.mainServerBaseURL + "/api/match")

	req.Header.Set("Content-Type", "application/json")

	res, err := c.mainServer.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return fmt.Errorf("match service returned %d", res.StatusCode)
	}

	return nil
}
