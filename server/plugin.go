package main

import (
	"fmt"
	"net/http"

	"github.com/pkg/errors"

	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/mattermost/mattermost-server/v6/plugin"

	pluginapi "github.com/mattermost/mattermost-plugin-api"

	"github.com/tizianocitro/mattermost-product/server/command"
)

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type Plugin struct {
	plugin.MattermostPlugin

	client *pluginapi.Client

	// Plugin's id read from the manifest file
	pluginID string

	// How the plugin URLs starts
	pluginURLPathPrefix string

	// BotId of the created bot account
	botID string
}

func (p *Plugin) OnActivate() error {
	p.client = pluginapi.NewClient(p.API, p.Driver)

	p.pluginID = p.getPluginIDFromManifest()
	p.pluginURLPathPrefix = p.getPluginURLPathPrefix()
	botID, err := p.getBotID()
	if err != nil {
		return err
	}
	p.botID = botID

	if err := p.registerCommands(); err != nil {
		return errors.Wrapf(err, "failed to register commands")
	}

	p.API.LogInfo("Plugin activated successfully", "pluginID", p.pluginID, "botID", p.botID)
	return nil
}

// See more on https://developers.mattermost.com/extend/plugins/server/reference/
func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case command.GetProductURLPath:
		p.handleGetProductURL(w, r)
	default:
		fmt.Fprint(w, "404 page not found")
		// http.NotFound(w, r)
	}
}

func (p *Plugin) getPluginIDFromManifest() string {
	return manifest.Id
}

func (p *Plugin) getPluginURLPathPrefix() string {
	return "products"
}

func (p *Plugin) getBotID() (string, error) {
	botID, err := p.client.Bot.EnsureBot(&model.Bot{
		Username:    "mattermostproductbot",
		DisplayName: "Mattermost Product Bot",
		Description: "A bot account created by the Mattermost Product.",
	})
	if err != nil {
		return "", errors.Wrap(err, "failed to ensure bot, so cannot get botID")
	}
	return botID, nil
}
