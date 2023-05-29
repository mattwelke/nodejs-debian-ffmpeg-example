#!/bin/bash

docker run \
  --name my-nodejs-ffmpeg-example \
  --rm \
  -v "$(pwd)/videos:/videos" \
  -e FILE_IN="/videos/drop.avi" \
  -e RESIZE_PERC="50%" \
  -e FILE_OUT="/videos/drop_after.avi" \
  nodejs-ffmpeg-example

