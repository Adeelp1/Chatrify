package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"matchmaking/engine/internal/client"
	"matchmaking/engine/internal/config"
	"matchmaking/engine/internal/queue"
	"matchmaking/engine/internal/redis"
	"matchmaking/engine/internal/service"
)

func main() {
	config.LoadEnv()

	redisClient, err := redis.NewRedisClient(os.Getenv("ADDRESS"), os.Getenv("PASSWORD"))
	if err != nil {
		log.Fatal(err)
	}

	queue, _ := queue.NewRedisQueue(
		redisClient,
		os.Getenv("REDIS_QUEUE_NAME"),
		os.Getenv("REDIS_SET_NAME"),
	)
	recommender := client.NewRecommenderClients(os.Getenv("RECOMMENDER_BASE_URL"))
	mainServer := client.NewMainServerClient(os.Getenv("MAIN_SERVER_BASE_URL"))

	serviceClients := client.NewServiceClients(recommender, mainServer)

	matchService := service.NewMatchService(queue, serviceClients)
	fmt.Println("Started")
	matchService.Start(context.Background())
}
