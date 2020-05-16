# Download and install the latest SDK tools.
system "./emsdk/emsdk install latest"

# Make the "latest" SDK "active" for the current user. (writes ~/.emscripten file)
system "./emsdk/emsdk activate latest"

# Activate PATH and other environment variables in the current terminal
system "source ./emsdk/emsdk_env.sh"