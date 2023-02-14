package app

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type OrganizationService struct{}

// OrganizationService returns a new organization service
func NewOrganizationService() *OrganizationService {
	return &OrganizationService{}
}

func (s *OrganizationService) Get(id string) (Organization, error) {
	resp, err := http.Get("http://csa:3000/organizations/" + id)
	if err != nil {
		return Organization{}, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return Organization{}, err
	}
	var organization Organization
	err = json.Unmarshal(body, &organization)
	if err != nil {
		return Organization{}, err
	}
	return organization, nil
}

func (s *OrganizationService) GetOrganizations(opts OrganizationFilterOptions) (GetOrganizationsResults, error) {
	resp, err := http.Get("http://csa:3000/organizations")
	if err != nil {
		return GetOrganizationsResults{}, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return GetOrganizationsResults{}, err
	}
	var result GetOrganizationsResults
	err = json.Unmarshal(body, &result)
	if err != nil {
		return GetOrganizationsResults{}, err
	}
	return result, nil
}

func (s *OrganizationService) GetOrganizationsNoPage() (GetOrganizationsNoPageResults, error) {
	resp, err := http.Get("http://csa:3000/organizations/no_page")
	if err != nil {
		return GetOrganizationsNoPageResults{}, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return GetOrganizationsNoPageResults{}, err
	}
	var result GetOrganizationsNoPageResults
	err = json.Unmarshal(body, &result)
	if err != nil {
		return GetOrganizationsNoPageResults{}, err
	}
	return result, nil
}
