package api

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/tizianocitro/csa-connect/server/app"
)

// ChannelsHandler is the API handler.
type ChannelHandler struct {
	*ErrorHandler
	channelService *app.ChannelService
}

// ChannelHandler returns a new channels api handler
func NewChannelHandler(router *mux.Router, channelService *app.ChannelService) *ChannelHandler {
	handler := &ChannelHandler{
		ErrorHandler:   &ErrorHandler{},
		channelService: channelService,
	}

	channelsRouter := router.PathPrefix("/channels/{sectionId:[A-Za-z0-9]+}").Subrouter()
	channelsRouter.HandleFunc("", withContext(handler.getChannels)).Methods(http.MethodGet)
	channelsRouter.HandleFunc("", withContext(handler.addChannel)).Methods(http.MethodPost)

	return handler
}

func (h *ChannelHandler) getChannels(c *Context, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	sectionID := vars["sectionId"]
	parentID := r.URL.Query().Get("parent_id")
	channels, err := h.channelService.GetChannels(sectionID, parentID)
	if err != nil {
		h.HandleError(w, c.logger, err)
		return
	}
	ReturnJSON(w, channels, http.StatusOK)
}

func (h *ChannelHandler) addChannel(c *Context, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	sectionID := vars["sectionId"]
	var params app.AddChannelParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		h.HandleErrorWithCode(w, c.logger, http.StatusBadRequest, "unable to decode channel to add", err)
		return
	}
	result, err := h.channelService.AddChannel(sectionID, params)
	if err != nil {
		h.HandleError(w, c.logger, err)
		return
	}
	ReturnJSON(w, result, http.StatusOK)
}
