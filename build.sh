#!/bin/bash

VERSION=latest
# ARTIFACT=artifact
# ARTIFACT_NAME=cs-aware-connect-+.tar.gz
# FROM=mm-ubuntu-upgrated:/home/csa-connect/dist/"$ARTIFACT_NAME"
IMAGE_NAME=csanext/mattermost:$VERSION

# echo "Checking if the $ARTIFACT directory exists..."
# if [ -d "$ARTIFACT" ];
# then
#     echo "$ARTIFACT directory exists. Removing directory's content..."
#     rm -rf $ARTIFACT
#     echo "$ARTIFACT directory's content removed."
# else
#     echo "$ARTIFACT directory does not exist. No need to remove its content."
# fi

# echo "Creating $ARTIFACT directory..."
# mkdir $ARTIFACT

# echo "Copying plugin artifact $FROM..."
# docker cp $FROM ./$ARTIFACT/"$ARTIFACT_NAME"

echo "Removing old $IMAGE_NAME image..."
docker rmi "$IMAGE_NAME"

echo "Building $IMAGE_NAME image..."
docker build -t "$IMAGE_NAME" .

# echo "Pushing $IMAGE_NAME image..."
# docker push "$IMAGE_NAME"

echo "Completed."