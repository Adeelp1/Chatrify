package redis

import (
	"context"

	"github.com/redis/go-redis/v9"
)

func NewRedisClient(address string, password string) (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     address,
		Password: password,
		DB:       0,
	})

	if err := client.Ping(context.Background()).Err(); err != nil {
		return nil, err
	}

	return client, nil
}
