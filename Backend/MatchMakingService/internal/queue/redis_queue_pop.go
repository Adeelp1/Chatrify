package queue

import (
	"context"
	"log"
	"strconv"
)

func (q *RedisQueue) Pop(ctx context.Context) (int, error) {
	// Pop function is used to dequeue element from userqueue and return
	for {
		if len, _ := q.client.LLen(ctx, q.queue).Result(); len < 2 {
			continue
		}

		res, err := q.client.BLPop(ctx, 0, q.queue).Result()
		if err != nil {
			return 0, err
		}

		isMember, err := q.client.SIsMember(ctx, q.set, res[1]).Result()
		if err != nil {
			log.Printf("Error: %v", err)
		}

		if !isMember {
			userId, err := strconv.Atoi(res[1]) // convert to int
			if err != nil {
				log.Printf("Error: %v", err)
			}
			return userId, nil
		}

		// remove stale user from set
		if _, err := q.client.SRem(ctx, q.set, res[1]).Result(); err != nil {
			log.Printf("Error: %v", err)
		}
	}
}
