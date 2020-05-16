const lg = require("../node_modules/wasm-git/lg2.js")

lg.onRuntimeInitialized = () => {
    const FS = lg.FS
    const MEMFS = FS.filesystems.MEMFS

    FS.mkdir("/working")
    FS.mount(MEMFS, {}, "/working")
    FS.chdir("/working")

    FS.writeFile("/home/web_user/.gitconfig", "[user]\n" + "name = Test User\n" + "email = test@example.com")

    // clone a repository from github
    lg.callMain(["clone", "https://github.com/torch2424/made-with-webassembly.git", "made-with-webassembly"])
    console.log(FS.readdir("made-with-webassembly"))
}
