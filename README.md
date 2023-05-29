# nodejs-debian-ffmpeg-example

Demonstrates using the [`ffmpeg` Debian package](https://packages.debian.org/buster/ffmpeg)  via the [`ffmpeg` NPM package](https://www.npmjs.com/package/ffmpeg). Uses Docker and a volume mount so that the test can be completed regardless of host OS. It will be the Debian package being used.

This can be used to help learn Docker concepts and help learn how to package a Node.js application that uses ffmpeg into a container image to be deployed to production using any platform that supports container images.

The sample input file is `drop.avi`, which comes from https://www.engr.colostate.edu/me/facil/dynamics/avis.htm.

## Running the example

### Without installing Debian dependency

This demonstrates what happens if you package the Node.js script into a Docker image without installing the Debian dependency.

1. Note that the `videos` directory has one file.
   
   ```
   $ ls -l videos
   total 660
   -rw-rw-r-- 1 matt matt 675840 May 29 14:43 drop.avi
   ```

1. Run `./build.sh && ./run.sh`. This builds an image and runs it, while mounting the `videos` directory as a volume and specifying environment variables so that the script uses that directory for its input and output.

   Note the error message displayed.
   
   ```
   Error:  Error: Command failed: ffmpeg -i /videos/drop.avi -s 0x0 /videos/drop_after.avi
   /bin/sh: 1: ffmpeg: not found
   
       at ChildProcess.exithandler (node:child_process:419:12)
       at ChildProcess.emit (node:events:513:28)
       at maybeClose (node:internal/child_process:1091:16)
       at Socket.<anonymous> (node:internal/child_process:449:11)
       at Socket.emit (node:events:513:28)
       at Pipe.<anonymous> (node:net:322:12) {
     code: 127,
     killed: false,
     signal: null,
     cmd: 'ffmpeg -i /videos/drop.avi -s 0x0 /videos/drop_after.avi'
   }
   ```

   This means that the system dependency for the `ffmpeg` NPM package was not satisfied.

1. Note that the `videos` directory still has one file.
   
   ```
   $ ls -l videos
   total 660
   -rw-rw-r-- 1 matt matt 675840 May 29 14:43 drop.avi
   ```

### With installing Debian dependency

This demonstrates what happens if you package the Node.js script into a Docker image while installing the Debian dependency. The Dockerfile (`Dockerfile.withlibs`) has more lines added to it which include `RUN apt-get -y` commands to install the dependency.

1. Note that the `videos` directory has one file.
   
   ```
   $ ls -l videos
   total 660
   -rw-rw-r-- 1 matt matt 675840 May 29 14:43 drop.avi
   ```

1. Run `./build_withlibs.sh && ./run_withlibs.sh`. This builds an image and runs it, while mounting the `videos` directory as a volume and specifying environment variables so that the script uses that directory for its input and output. Unlike the above steps, these scripts build the image using the Dockerfile that includes the step to install the Debian dependency.

   Note the lack of error message displayed. This means the Node.js script (`index.js`) was able to complete without encountering any errors. This means the `ffmpeg` NPM package was able to use the binaries provided by the `ffmpeg` Debian package to do what it needs to do.

1. Note that the `videos` directory now has two files. The Docker container outputted the processed video file to this directory. Note that the `drop_after.avi` file is smaller, showing that the resize was successful.

   ```
   $ ls -l videos
   total 872
   -rw-r--r-- 1 root root 214742 May 29 15:47 drop_after.avi
   -rw-rw-r-- 1 matt matt 675840 May 29 14:43 drop.avi
   ```

### Interactive

 The `run_interactive.sh` and `run_withlibs_interactive.sh` scripts allow you to get a shell into the running container instead of having the container perform its work using the Node.js script.

```
$ ./run_withlibs_interactive.sh 
root@922eeeb64018:/usr/src/app#
```

1. You can see which files were included in the built Docker image.
   
   ```
   $ ./run_withlibs_interactive.sh 
   root@922eeeb64018:/usr/src/app# ls
   Dockerfile           build.sh           node_modules       run.sh              run_withlibs_interactive.sh
   Dockerfile_withlibs  build_withlibs.sh  package-lock.json  run_interactive.sh
   README.md            index.js           package.json       run_withlibs.sh
   ```

1. You can see whether the `videos` directory was successfully mounted and which files are accessible from within the container (aka which files are accessible by the Node.js script).

   ```
   root@922eeeb64018:/usr/src/app# ls /videos
   drop.avi
   ```

## Reference

* https://wiki.debian.org/ffmpeg
* https://nodejs.org/en/docs/guides/nodejs-docker-webapp
* https://pythonspeed.com/articles/system-packages-docker/
