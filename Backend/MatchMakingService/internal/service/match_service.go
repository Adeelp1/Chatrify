package service

type MatchService struct {
	queue          Queue
	serviceClients ServiceClients
}

func NewMatchService(
	queue Queue,
	serviceClients ServiceClients,
) *MatchService {
	return &MatchService{
		queue:          queue,
		serviceClients: serviceClients,
	}
}
