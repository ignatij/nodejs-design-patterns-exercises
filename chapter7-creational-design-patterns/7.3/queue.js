'use strict'

class Queue {
    #items = []
    #resolvers = []
    constructor(executor) {

        const enqueue = async (element) => {
            if(this.#resolvers.length !== 0) {
                const resolver = this.#resolvers.shift()
                resolver(element)
            } else {
                this.#items.push(element)
            }
        }

        executor({enqueue})
    }

    async dequeue() {
        if(this.#items.length === 0) {
            console.warn('Queue is empty! Waiting for an element...')
            return new Promise((resolve) => {
                this.#resolvers.push(resolve)
            })
        }
        return new Promise((resolve, reject) => {
            try {
                const element = this.#items.shift()
                resolve(element)
            }
            catch(err) {
                reject(err)
            }
        })
    }
}

module.exports = Queue