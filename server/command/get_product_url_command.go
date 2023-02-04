package command

import (
	"fmt"
	"strings"

	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/mattermost/mattermost-server/v6/plugin"
)

const (
	GetProductURLCommandName = "product"
	GetProductURLPath        = "/" + getProductURLEndpoint

	getProductURLDesc              = "Get a product URL given the product name."
	getProductURLDialogCommand     = "dialog"
	getProductURLDialogCommandDesc = "Open a dialog to select a product name."
	getProductURLEndpoint          = "get_product_url"
	getProductURLHelpCommand       = "help"
	getProductURLHelpCommandDesc   = "Get help on how to use the command."
	getProductURLNameCommand       = "name"
	getProductURLNameCommandDesc   = "The product name."
)

const (
	getProductURLAutoComplete   = true
	getProductURLCallback       = "handleGetProductURL"
	getProductURLDisplayName    = "GetProductUrl"
	getProductURLNotifyOnCancel = true
	getProductURLState          = ""
	getProductURLSubmitLabel    = "Confirm"
)

const (
	emptyProductNameResponse = "A name is required."
	helpResponse             = "###### " + getProductURLDesc + "\n" +
		"- `/dialog` - " + getProductURLDialogCommandDesc + "\n" +
		"- `/name` - Get the URL of the product with the name equals to the provided [name].\n" +
		"- `/help` - Show this help text."
)

const productSelectorFieldName = "productSelector"

type PluginAPI struct {
	API plugin.API
}

type PluginConfig struct {
	PluginAPI
	PathPrefix string
	PluginID   string
	SiteURL    string
}

type ProductURLConfig struct {
	PluginConfig
	Name string
}

type ProductURLDialogConfig struct {
	PluginConfig
	Args *model.CommandArgs
}

type ProductURLPostConfig struct {
	PluginConfig
	UserID string
}

type ProductURLMarkdownConfig struct {
	PluginConfig
	ID   string
	Name string
}

func GetProductURLCommand() *model.Command {
	return &model.Command{
		AutoComplete:     getProductURLAutoComplete,
		AutocompleteData: getGetProductURLAutocompleteData(),
		AutoCompleteDesc: getProductURLDesc,
		DisplayName:      getProductURLDisplayName,
		Trigger:          GetProductURLCommandName,
	}
}

func HelpGetProductURLResponse() *model.CommandResponse {
	return &model.CommandResponse{
		ResponseType: model.CommandResponseTypeEphemeral,
		Text:         helpResponse,
	}
}

func EmptyNameGetProductURLResponse() *model.CommandResponse {
	return &model.CommandResponse{
		ResponseType: model.CommandResponseTypeEphemeral,
		Text:         emptyProductNameResponse,
	}
}

func GetProductURLResponse(config *ProductURLConfig) *model.CommandResponse {
	return &model.CommandResponse{
		ResponseType: model.CommandResponseTypeInChannel,
		Text:         getProductURL(config),
	}
}

func OpenDialogGetProductURLRequest(config *ProductURLDialogConfig) *model.CommandResponse {
	API := config.API
	API.LogInfo("Creating request to open dialog", "config", config)
	openDialogRequest := model.OpenDialogRequest{
		Dialog:    getProductURLDialog(),
		TriggerId: config.Args.TriggerId,
		URL:       fmt.Sprintf("%s/%s/%s/%s", config.SiteURL, config.PathPrefix, config.PluginID, getProductURLEndpoint),
	}
	API.LogInfo("Opening dialog", "request", openDialogRequest, "config", config)
	if err := API.OpenInteractiveDialog(openDialogRequest); err != nil {
		errorMessage := fmt.Sprintf("Failed to open the interactive dialog for %s command", GetProductURLCommandName)
		API.LogError(errorMessage, "err", err.Error())
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeEphemeral,
			Text:         errorMessage,
		}
	}
	return &model.CommandResponse{}
}

func CreateGetProductURLPost(config *ProductURLPostConfig, request *model.SubmitDialogRequest) error {
	api := config.API
	productName, ok := request.Submission[productSelectorFieldName].(string)
	if !ok {
		api.LogError("Request is missing field", "field", productSelectorFieldName)
		return fmt.Errorf("request is missing field %s", productSelectorFieldName)
	}

	// Using p.botID instead of user.Id will make the post come from the bot
	api.LogInfo("Creating post for product", "productName", productName)
	if _, err := api.CreatePost(createPost(config, request, productName)); err != nil {
		api.LogError("Failed to post message", "err", err.Error())
		return err
	}
	return nil
}

func GetNameFromArgs(args *model.CommandArgs) string {
	fields := strings.Fields(args.Command)
	if nameWasNotProvided := len(fields) < 2; nameWasNotProvided {
		return ""
	}
	excludeTheCommandName := 1
	nameFields := fields[excludeTheCommandName:]
	if nameHasNoWhiteSpaces := len(nameFields) < 2; nameHasNoWhiteSpaces {
		firstNameWord := 0
		return nameFields[firstNameWord]
	}
	return strings.Join(nameFields, " ")
}

func getGetProductURLAutocompleteData() *model.AutocompleteData {
	command := model.NewAutocompleteData(GetProductURLCommandName, "", getProductURLDesc)

	name := model.NewAutocompleteData(getProductURLNameCommand, "", getProductURLNameCommandDesc)
	// name.AddNamedTextArgument("name", "The product name with pattern p([a-z]+)ch", "", "p([a-z]+)ch", true)
	command.AddCommand(name)

	dialog := model.NewAutocompleteData(getProductURLDialogCommand, "", getProductURLDialogCommandDesc)
	command.AddCommand(dialog)

	help := model.NewAutocompleteData(getProductURLHelpCommand, "", getProductURLHelpCommandDesc)
	command.AddCommand(help)

	return command
}

func getProductURL(config *ProductURLConfig) string {
	name := config.Name
	config.API.LogInfo(fmt.Sprintf("Getting URL for product %s", name))
	id := getIDByName(name)
	return getMarkdownProductURL(&ProductURLMarkdownConfig{
		ID:   id,
		Name: name,
		PluginConfig: PluginConfig{
			PathPrefix: config.PathPrefix,
			PluginID:   config.PluginID,
			SiteURL:    config.SiteURL,
			PluginAPI: PluginAPI{
				API: config.API,
			},
		},
	})
}

func getProductURLDialog() model.Dialog {
	return model.Dialog{
		CallbackId:     getProductURLCallback,
		Elements:       buildModelDialogElements(),
		IconURL:        "http://www.mattermost.org/wp-content/uploads/2016/04/icon.png",
		NotifyOnCancel: getProductURLNotifyOnCancel,
		State:          getProductURLState,
		SubmitLabel:    getProductURLSubmitLabel,
		Title:          getProductURLDesc,
	}
}

func buildModelDialogElements() []model.DialogElement {
	return []model.DialogElement{{
		DisplayName: "Product Name",
		HelpText:    "Choose a product from the list.",
		Name:        productSelectorFieldName,
		Options:     buildSelectElementOtions(),
		Placeholder: "Choose a product...",
		Type:        "select",
	}}
}

func buildSelectElementOtions() []*model.PostActionOptions {
	return []*model.PostActionOptions{{
		Text:  "My First Product",
		Value: "My First Product",
	}, {
		Text:  "My Second Product",
		Value: "My Second Product",
	}}
}

func createPost(config *ProductURLPostConfig, request *model.SubmitDialogRequest, name string) *model.Post {
	id := getIDByName(name)
	config.API.LogInfo(fmt.Sprintf("Creating a post with URL for product %s", name))
	return &model.Post{
		UserId:    config.UserID,
		ChannelId: request.ChannelId,
		Message: getMarkdownProductURL(&ProductURLMarkdownConfig{
			ID:   id,
			Name: name,
			PluginConfig: PluginConfig{
				PathPrefix: config.PathPrefix,
				PluginID:   config.PluginID,
				SiteURL:    config.SiteURL,
				PluginAPI: PluginAPI{
					API: config.API,
				},
			},
		}),
	}
}

// TODO: Make proper call to DB, this is just a mock
func getIDByName(name string) string {
	if name == "My Second Product" {
		return "2"
	}
	return "1"
}

func getMarkdownProductURL(config *ProductURLMarkdownConfig) string {
	// The format is [link text here](link here)
	return fmt.Sprintf(
		"[%s](%s/%s/%s/%s)",
		config.Name,
		config.SiteURL,
		config.PluginID,
		config.PathPrefix,
		config.ID,
	)
}
