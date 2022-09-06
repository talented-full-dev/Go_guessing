package context

import (
	"context"
	"guess_the_score/backend/models"
)

func User(ctx context.Context) *models.User {
	if temp := ctx.Value("user"); temp != nil {
		if user, ok := temp.(*models.User); ok {
			return user
		}
	}
	return nil
}
