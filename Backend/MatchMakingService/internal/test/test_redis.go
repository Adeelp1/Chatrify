package test_redis

// import (
// 	"fmt"
// 	"matchmaking/engine/internal/queue"
// 	"strconv"
// )

// func AddUser() {

// 	queue..Del(queue.Ctx, "userqueue") // clear old data

// 	queue.RedisDB.RPush(queue.Ctx, "userqueue", 1)
// 	queue.RedisDB.RPush(queue.Ctx, "userqueue", 5)
// 	queue.RedisDB.RPush(queue.Ctx, "userqueue", 6)
// 	queue.RedisDB.RPush(queue.Ctx, "userqueue", 2)
// 	fmt.Println("user added")
// }

// // func GetUser() {
// // 	res, err := queue.RedisDB.BLPop(queue.Ctx, 0, "userqueue").Result()

// // 	if err != nil {
// // 		println(err)
// // 	} else {
// // 		println(strconv.Atoi(res[1]))
// // 	}

// // 	fmt.Println("1 user printed")

// // 	res, err = queue.RedisDB.BLPop(queue.Ctx, 0, "userqueue").Result()

// // 	if err != nil {
// // 		println(err)
// // 	} else {
// // 		println(strconv.Atoi(res[1]))
// // 	}

// // 	fmt.Println("2 user added")

// // 	res, err = queue.RedisDB.BLPop(queue.Ctx, 0, "userqueue").Result()

// // 	if err != nil {
// // 		println(err)
// // 	} else {
// // 		println(strconv.Atoi(res[1]))
// // 	}

// // 	fmt.Println("3 user added")
// // }
