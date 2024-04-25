'use strict'


const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const FgBlue = "\x1b[34m"

class ColorConsole {
    log() {

    }
}

class RedConsole extends ColorConsole {
    log(arg) {
        console.log(BgRed, arg)
    }
}

class BlueConsole extends ColorConsole {
    log(arg) {
        console.log(FgBlue, arg)
    }
}

class GreenConsole extends ColorConsole {
    log(arg) {
        console.log(BgGreen, arg)
    }
}

const factoryFn = (arg) => {
    switch(arg) {
        case 'red': return new RedConsole()
        case 'blue': return new BlueConsole()
        case 'green': return new GreenConsole()
        default: throw new Error('not existing color')
    }
}

(() => {
    factoryFn(process.argv[2]).log("this should be in color")
})()