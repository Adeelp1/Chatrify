package queue

import (
	"errors"

	"github.com/redis/go-redis/v9"
)

type RedisQueue struct {
	client *redis.Client
	queue  string
	set    string
}

func NewRedisQueue(client *redis.Client, queue, set string) (*RedisQueue, error) {
	if queue == "" || set == "" {
		return nil, errors.New("redis queue or set name is empty")
	}
	return &RedisQueue{
		client: client,
		queue:  queue,
		set:    set,
	}, nil
}
