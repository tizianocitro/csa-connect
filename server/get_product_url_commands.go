package main

import (
	"fmt"

	"github.com/mattermost/mattermost-server/v6/model"
)

const (
	getProductURLCommandName = "product"
	getProductURLHelp        = "###### Get the URL of a product given the URL."

	emptyProductName         = "A name is required."
	productSelectorFieldName = "productSelector"

	productURLDesc        = "Get a product URL"
	getProductURLCallback = "getProductUrlCallback"
)

func getProductURLCommand() *model.Command {
	return &model.Command{
		Trigger:          getProductURLCommandName,
		AutoComplete:     true,
		AutoCompleteDesc: productURLDesc,
		DisplayName:      "GetProductUrl",
		AutocompleteData: getGetProductURLAutocompleteData(),
	}
}

func getProductURL(name string, url string) string {
	return fmt.Sprintf("%s/%s/products/%d", url, "mattermost-product", 1)
}

func getProductURLDialog() model.Dialog {
	return model.Dialog{
		CallbackId: getProductURLCallback,
		Title:      productURLDesc,
		IconURL:    "http://www.mattermost.org/wp-content/uploads/2016/04/icon.png",
		Elements: []model.DialogElement{{
			DisplayName: "Product Selector",
			Name:        productSelectorFieldName,
			Type:        "select",
			Placeholder: "Select a product...",
			HelpText:    "Choose a product from the list.",
			Options: []*model.PostActionOptions{{
				Text:  "My First Product",
				Value: "1",
			}, {
				Text:  "My Second Product",
				Value: "2",
			}},
		}},
		SubmitLabel:    "Get URL",
		NotifyOnCancel: true,
		State:          "",
	}
}

func getGetProductURLAutocompleteData() *model.AutocompleteData {
	command := model.NewAutocompleteData(getProductURLCommandName, "", "Get a product URL.")

	name := model.NewAutocompleteData("name", "", "The product name")
	// name.AddNamedTextArgument("name", "The product name with pattern p([a-z]+)ch", "", "p([a-z]+)ch", true)
	command.AddCommand(name)

	dialog := model.NewAutocompleteData("dialog", "", "")
	command.AddCommand(dialog)

	help := model.NewAutocompleteData("help", "", "")
	command.AddCommand(help)

	return command
}
