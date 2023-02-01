package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/mattermost/mattermost-server/v6/model"

	"github.com/tizianocitro/mattermost-product/server/command"
	"github.com/tizianocitro/mattermost-product/server/user"
)

func (p *Plugin) handleGetProductURL(w http.ResponseWriter, r *http.Request) {
	p.API.LogInfo("Got request")
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

	p.API.LogInfo("Checking user")
	userID, getUserErr := user.GetUserIDByUserRequestID(p.API, request.UserId)
	if getUserErr != nil {
		w.WriteHeader(http.StatusOK)
		return
	}

	p.API.LogInfo("Check if request was canceled")
	if request.Cancelled {
		p.API.LogInfo("Request was canceled")
		return
	}

	productSelectorFieldName := command.ProductSelectorFieldName
	productID, ok := request.Submission[productSelectorFieldName].(string)
	if !ok {
		p.API.LogError("Request is missing field", "field", productSelectorFieldName)
		w.WriteHeader(http.StatusOK)
		return
	}

	// Using p.botID instead of user.Id will make the post come from the bot
	p.API.LogInfo("Creating post")
	if _, createPostErr := p.API.CreatePost(&model.Post{
		UserId:    userID,
		ChannelId: request.ChannelId,
		Message:   fmt.Sprintf("%s/%s/products/%s", *serverConfig.ServiceSettings.SiteURL, "mattermost-product", productID),
	}); createPostErr != nil {
		p.API.LogError("Failed to post message", "err", createPostErr.Error())
		return
	}
	p.API.LogInfo("Completed request")
	w.WriteHeader(http.StatusOK)
}
