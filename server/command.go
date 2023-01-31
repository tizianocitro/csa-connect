package main

import (
	"fmt"
	"strings"

	"github.com/pkg/errors"

	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/mattermost/mattermost-server/v6/plugin"
)

func (p *Plugin) registerCommands() error {
	if err := p.API.RegisterCommand(getProductURLCommand()); err != nil {
		return errors.Wrapf(err, "failed to register %s command", getProductURLCommandName)
	}
	return nil
}

// Executes a command that has been previously registered via the RegisterCommand API.
func (p *Plugin) ExecuteCommand(c *plugin.Context, args *model.CommandArgs) (*model.CommandResponse, *model.AppError) {
	trigger := strings.TrimPrefix(strings.Fields(args.Command)[0], "/")
	switch trigger {
	case getProductURLCommandName:
		return p.executeGetProductURLCommand(args), nil
	default:
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeEphemeral,
			Text:         fmt.Sprintf("Unknown command: " + args.Command),
		}, nil
	}
}

func (p *Plugin) executeGetProductURLCommand(args *model.CommandArgs) *model.CommandResponse {
	var dialogRequest model.OpenDialogRequest
	serverConfig := p.API.GetConfig()
	fields := strings.Fields(args.Command)
	arg := ""
	if len(fields) == 2 {
		arg = fields[1]
	}

	switch arg {
	case "help":
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeEphemeral,
			Text:         getProductURLHelp,
		}
	case "dialog":
		dialogRequest = model.OpenDialogRequest{
			TriggerId: args.TriggerId,
			URL:       fmt.Sprintf("%s/%s/get_product_url", *serverConfig.ServiceSettings.SiteURL, "mattermost-product"),
			Dialog:    getProductURLDialog(),
		}
	case "":
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeEphemeral,
			Text:         emptyProductName,
		}
	default:
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeInChannel,
			Text:         getProductURL(arg, *serverConfig.ServiceSettings.SiteURL),
		}
	}
	if err := p.API.OpenInteractiveDialog(dialogRequest); err != nil {
		errorMessage := fmt.Sprintf("Failed to open the interactive dialog for %s command", getProductURLCommandName)
		p.API.LogError(errorMessage, "err", err.Error())
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeEphemeral,
			Text:         errorMessage,
		}
	}
	return &model.CommandResponse{}
}
