# CSA Connect

CSA Connect collaboration platform based on Mattermost and Hyperlinking Object-Oriented Discussion.

## How to build

Build the Docker image for the environment for building the plugin.

```sh
$ sudo docker build -t cs-connect-base -f docker/dev.Dockerfile .
```

Build the custom Mattermost Docker image with the plugin installed.

```sh
$ sudo ./build.sh
```
