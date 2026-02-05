package client

type ServiceClients struct {
	recommender *RecommenderClient
	mainServer  *MainServerClient
}

func NewServiceClients(
	recommenderClient *RecommenderClient,
	mainServerClient *MainServerClient,
) *ServiceClients {
	return &ServiceClients{
		recommender: recommenderClient,
		mainServer:  mainServerClient,
	}
}
