package main

import (
	"fmt"
	"strings"

	"github.com/pkg/errors"

	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/mattermost/mattermost-server/v6/plugin"

	"github.com/tizianocitro/csa-connect/server/command"
)

// Executes a command that has been previously registered via the RegisterCommand API.
func (p *Plugin) ExecuteCommand(c *plugin.Context, args *model.CommandArgs) (*model.CommandResponse, *model.AppError) {
	trigger := strings.TrimPrefix(strings.Fields(args.Command)[0], "/")
	switch trigger {
	case command.GetProductURLCommandName:
		return p.executeGetProductURLCommand(args), nil
	default:
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeEphemeral,
			Text:         fmt.Sprintf("Unknown command: " + args.Command),
		}, nil
	}
}

func (p *Plugin) executeGetProductURLCommand(args *model.CommandArgs) *model.CommandResponse {
	serverConfig := p.API.GetConfig()
	name := command.GetNameFromArgs(args)

	switch name {
	case "help":
		return command.HelpGetProductURLResponse()
	case "dialog":
		return command.OpenDialogGetProductURLRequest(&command.ProductURLDialogConfig{
			Args: args,
			PluginConfig: command.PluginConfig{
				PathPrefix: "plugins",
				PluginID:   p.pluginID,
				SiteURL:    *serverConfig.ServiceSettings.SiteURL,
				PluginAPI: command.PluginAPI{
					API: p.API,
				},
			},
		})
	case "":
		return command.EmptyNameGetProductURLResponse()
	default:
		return command.GetProductURLResponse(&command.ProductURLConfig{
			Name: name,
			PluginConfig: command.PluginConfig{
				PathPrefix: p.pluginURLPathPrefix,
				PluginID:   p.pluginID,
				SiteURL:    *serverConfig.ServiceSettings.SiteURL,
				PluginAPI: command.PluginAPI{
					API: p.API,
				},
			},
		})
	}
}

func (p *Plugin) registerCommands() error {
	if err := p.API.RegisterCommand(command.GetProductURLCommand()); err != nil {
		return errors.Wrapf(err, "failed to register %s command", command.GetProductURLCommandName)
	}
	return nil
}
