package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/mattermost/mattermost-server/v6/model"
)

func (p *Plugin) handleGetProductURL(w http.ResponseWriter, r *http.Request) {
	serverConfig := p.API.GetConfig()
	request := &model.SubmitDialogRequest{}
	body, readErr := io.ReadAll(r.Body)
	if readErr != nil {
		p.API.LogError("Failed to read request")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if unmarshalErr := json.Unmarshal(body, request); unmarshalErr != nil {
		p.API.LogError("Failed to unmarshal request")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// You can use request.UserID instead of p.botID at line 47
	_, getUserErr := p.API.GetUser(request.UserId)
	if getUserErr != nil {
		p.API.LogError("Failed to get user for command", "err", getUserErr.Error())
		w.WriteHeader(http.StatusOK)
		return
	}

	if !request.Cancelled {
		return
	}

	productID, ok := request.Submission[productSelectorFieldName].(int)
	if !ok {
		p.API.LogError("Request is missing field", "field", productSelectorFieldName)
		w.WriteHeader(http.StatusOK)
		return
	}

	if _, createPostErr := p.API.CreatePost(&model.Post{
		UserId:    p.botID,
		ChannelId: request.ChannelId,
		Message:   fmt.Sprintf("%s/%s/products/%d", *serverConfig.ServiceSettings.SiteURL, "mattermost-product", productID),
	}); createPostErr != nil {
		p.API.LogError("Failed to post message", "err", createPostErr.Error())
		return
	}

	w.WriteHeader(http.StatusOK)
}
