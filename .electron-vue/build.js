"use strict"

process.env.NODE_ENV = "production"

const { say } = require("cfonts")
const chalk = require("chalk")
const del = require("del")
const { spawn } = require("child_process")
const webpack = require("webpack")

const mainConfig = require("./webpack.main.config")
const rendererConfig = require("./webpack.renderer.config")
const webConfig = require("./webpack.web.config")

const doneLog = chalk.bgGreen.white("\n DONE \n") + " "
const errorLog = chalk.bgRed.white(" ERROR ") + " "
const okayLog = chalk.bgBlue.white(" OKAY ") + " "
const isCI = process.env.CI || false
const target = process.env.BUILD_TARGET

//
// clean
//
if (target == "clean") {
    // remove most everything from the build folder
    del.sync(["build/*", "!build/icons", "!build/icons/icon.*"])
    console.log(doneLog)
    process.exit()

//
// web
//
} else if (process.env.BUILD_TARGET === "web") {
    del.sync(["dist/web/*", "!.gitkeep"])
    webConfig.mode = "production"
    webpack(webConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
            console.log(err)
        }
        console.log(stats.toString({ chunks: false, colors: true }))
        process.exit()
    })

//
// build
//
} else {
    // 
    // greeting
    // 
    const cols = process.stdout.columns
    let text = false

    if (cols > 85) text = "lets-build"
    else if (cols > 60) text = "lets-|build"

    if (text && !isCI) {
        say(text, {
            colors: ["yellow"],
            font: "simple3d",
            space: false,
        })
    } else {
        console.log(chalk.yellow.bold("\n  lets-build"))
    }
    console.log()

    // 
    // actual build
    // 
    
    // clean up
    del.sync(["dist/electron/*", "!.gitkeep"])
    
    let results = ""
    
    // compile main
    pack(mainConfig).then((result) => {
        results += result + "\n\n"
        logResults(results)
        console.log(`=============================`)
        console.log(`    success building main    `)
        console.log(`=============================`)
    }).catch((err) => {
        console.error(`\n${err}\n`)
        console.log(`\n  ${errorLog}failed to build main process`)
        process.exit(1)
    })
    
    // compile renderer
    pack(rendererConfig).then((result) => {
        results += result + "\n\n"
        logResults(results)
        console.log(`===============================`)
        console.log(`   success building renderer   `)
        console.log(`===============================`)
    }).catch((err) => {
        console.error(`\n${err}\n`)
        console.log(`\n  ${errorLog}failed to build renderer process`)
        process.exit(1)
    })
}

function pack(config) {
    return new Promise((resolve, reject) => {
        config.mode = "production"
        webpack(config, (err, stats) => {
            if (err) {
                reject(err.stack || err)
            } else if (stats.hasErrors()) {
                let err = ""

                stats
                    .toString({
                        chunks: false,
                        colors: true,
                    })
                    .split(/\r?\n/)
                    .forEach((line) => {
                        err += `    ${line}\n`
                    })

                reject(err)
            } else {
                resolve(
                    stats.toString({
                        chunks: false,
                        colors: true,
                    })
                )
            }
        })
    })
}

function logResults(results) {
    console.group("")
    console.group("")
    results.split("\n").forEach(each=>console.log(each))
    console.groupEnd()
    console.groupEnd()
}