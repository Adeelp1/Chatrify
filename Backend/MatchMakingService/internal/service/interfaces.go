package service

import (
	"context"
)

type Queue interface {
	Pop(context.Context) (int, error)
}

type RecommenderClient interface {
	RecommendUser(userId int) (int, error)
}

type MainServerClient interface {
	SendRecommendUser(UserId int, recommendedUserId int) error
}

type ServiceClients interface {
	RecommenderClient
	MainServerClient
}
