// This file is automatically generated. Do not modify it manually.

const manifest = JSON.parse(`
{
    "id": "mattermost-product",
    "name": "Mattermost Product",
    "description": "A Mattermost Product plugin.",
    "homepage_url": "https://github.com/mattermost/mattermost-plugin-playbooks/",
    "support_url": "https://github.com/mattermost/mattermost-plugin-playbooks/issues",
    "release_notes_url": "https://github.com/mattermost/mattermost-plugin-playbooks/releases/tag/",
    "icon_path": "assets/plugin_icon.svg",
    "version": "+",
    "min_server_version": "7.6.0",
    "server": {
        "executables": {
            "darwin-amd64": "server/dist/plugin-darwin-amd64",
            "darwin-arm64": "server/dist/plugin-darwin-arm64",
            "linux-amd64": "server/dist/plugin-linux-amd64",
            "linux-arm64": "server/dist/plugin-linux-arm64",
            "windows-amd64": "server/dist/plugin-windows-amd64.exe"
        },
        "executable": ""
    },
    "webapp": {
        "bundle_path": "webapp/dist/main.js"
    },
    "settings_schema": {
        "header": "",
        "footer": "",
        "settings": []
    }
}
`);

export default manifest;
export const id = manifest.id;
export const version = manifest.version;
export const pluginId = manifest.id;
