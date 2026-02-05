package service

import (
	"context"
	"fmt"
	"log"
)

func (m *MatchService) Start(ctx context.Context) error {
	for {
		userId, err := m.queue.Pop(ctx)
		if err != nil {
			return err
		}

		recommendedUserId, err := m.serviceClients.RecommendUser(userId)
		if err != nil {
			// handle error
			log.Printf("Error: %v", err)
			continue
		}

		err = m.serviceClients.SendRecommendUser(userId, recommendedUserId)
		if err != nil {
			log.Printf("Error: Send Recommender User -> %v", err)
		}

		fmt.Println(userId, recommendedUserId)
	}
}
