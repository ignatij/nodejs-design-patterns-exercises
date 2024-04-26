'use strict'
import chalk from 'chalk'

const createDecoratedConsole = (console) => {
    return {
        red: (msg) => {
            console.log(chalk.red(msg))
        },
        green: (msg) => {
            console.log(chalk.green(msg))
        },
        blue: (msg) => {
            console.log(chalk.blue(msg))
        },
        yellow: (msg) => {
            console.log(chalk.yellow(msg))
        }
    }
}

const decoratedConsole = createDecoratedConsole(console)
decoratedConsole.blue('iam blue')
decoratedConsole.green('iam green')
decoratedConsole.yellow('iam yellow')
decoratedConsole.red('iam red')