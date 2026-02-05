package models

type RecommendRequest struct {
	UserId int `json:"user_id"`
}

type RecommendResponse struct {
	RecommendedUserId int `json:"recommended_user_id"`
}
