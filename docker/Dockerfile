FROM mattermost/mattermost-enterprise-edition:7.8.0

WORKDIR /mattermost

COPY artifact/cs-aware-connect-+.tar.gz ./prepackaged_plugins/cs-aware-connect-+.tar.gz

# The config.json file will always be overritten at the startup
# RUN sed -i 's/"PluginStates": {/"PluginStates": \n{\n"cs-aware-connect": {\n"Enable": true\n},/g' ./config/config.json
# COPY config.json ./config/config.json

# This has been deprecated
# RUN mattermost plugin add cs-aware-connect

# This can be used only after a user has been created first from console
# RUN mmctl plugin add cs-aware-connect-+.tar.gz
