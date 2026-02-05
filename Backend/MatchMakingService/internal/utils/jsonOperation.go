package utils

import "encoding/json"

func ToJSON(v any) ([]byte, error) {
	return json.Marshal(v)
}
