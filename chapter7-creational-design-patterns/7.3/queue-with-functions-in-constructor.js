'use strict'

class Queue {
    constructor(executor) {
        const items = []
        const resolvers = []

        const enqueue = async (element) => {
            if(resolvers.length !== 0) {
                const resolver = resolvers.shift()
                resolver(element)
            } else {
                items.push(element)
            }
        }

        executor({enqueue})

        this.dequeue = async () => {
            if(items.length === 0) {
                console.warn('Queue is empty! Waiting for an element...')
                return new Promise((resolve) => {
                    resolvers.push(resolve)
                })
            }
            return new Promise((resolve, reject) => {
                try {
                    const element = items.shift()
                    resolve(element)
                }
                catch(err) {
                    reject(err)
                }
            })
        }
    }

  
}

module.exports = Queue