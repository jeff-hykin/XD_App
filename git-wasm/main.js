const lg = require("../node_modules/wasm-git/lg2.js")

lg.onRuntimeInitialized = () => {
    const FS = lg.FS
    const NODEFS = FS.filesystems.NODEFS

    FS.mkdir("/working")
    FS.mount(NODEFS, { root: "." }, "/working")
    FS.chdir("/working")

    FS.writeFile("/home/web_user/.gitconfig", "[user]\n" + "name = Test User\n" + "email = test@example.com")

    // clone a repository from github
    lg.callMain(["clone", "https://github.com/torch2424/made-with-webassembly.git", "clonedtest"])

    FS.chdir("clonedtest")
    // currently writes to "../emsdk/clonedtest"
    console.log(FS.readdir("."))
    lg.callMain(["log"])
}
