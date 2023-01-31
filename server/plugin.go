package main

import (
	"fmt"
	"net/http"

	"github.com/pkg/errors"

	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/mattermost/mattermost-server/v6/plugin"

	pluginapi "github.com/mattermost/mattermost-plugin-api"
)

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type Plugin struct {
	plugin.MattermostPlugin

	client *pluginapi.Client

	// BotId of the created bot account
	botID string
}

func (p *Plugin) OnActivate() error {
	botID, err := p.generateBotID()
	if err != nil {
		return err
	}
	p.botID = botID
	if err := p.registerCommands(); err != nil {
		return errors.Wrapf(err, "failed to register commands")
	}
	return nil
}

// See more on https://developers.mattermost.com/extend/plugins/server/reference/
func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/get_product_url":
		p.handleGetProductURL(w, r)
	default:
		fmt.Fprint(w, "Hello, world!")
	}
}

func (p *Plugin) generateBotID() (string, error) {
	p.client = pluginapi.NewClient(p.API, p.Driver)

	bot := &model.Bot{
		Username:    "mattermostproductbot",
		DisplayName: "Mattermost Product Bot",
		Description: "A bot account created by the Mattermost Product.",
	}
	botID, ensureBotErr := p.client.Bot.EnsureBot(bot)
	if ensureBotErr != nil {
		return "", errors.Wrap(ensureBotErr, "failed to ensure bot")
	}
	return botID, nil
}
