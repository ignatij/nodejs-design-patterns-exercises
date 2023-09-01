'use strict'

const {createReadStream, createWriteStream} = require('fs')
const {parse} = require('csv-parse');   
const {Transform, PassThrough } = require('stream');


const rs = createReadStream('./london_crime_by_lsoa.csv', {highWaterMark: 64})
const ws = createWriteStream('./output.txt')

const csvParser = parse({ skip_records_with_error: true, columns: true });

const crimesPerYear = {}
const crimesPerLocation = {}



// Did the number of crimes go up or down over the years?
const firstAnswer = (crimes) => {
    ws.write(`1. Did the number of crimes go up or down over the years?\n`)
    const orderedByYear = Object.keys(crimes).sort().reduce((obj, key) => {
        obj[key] = crimes[key]
        return obj
    }, {})
    if(Object.values(orderedByYear) === Object.values(orderedByYear).sort()) {
        ws.write('Yes\n')
    } else {
        ws.write('No\n')
    }
}

// What are the most dangerous areas of London?
const secondAnswer = (crimes) => {
    ws.write(`2. What are the most dangerous areas of London?\n`)
    const sorted = Object.keys(crimes).sort(function(a,b){return crimes[a]-crimes[b]})
    const mostDangerouesArea = sorted.slice(-1)[0]
    ws.write(mostDangerouesArea + '\n')
}
const input = rs.pipe(csvParser)


input.pipe(new Transform({
    objectMode: true,
    transform(chunk, enc, cb) {
        const val = chunk['year']
        this.push(val)
        cb()
    },
})).pipe(new PassThrough({
    objectMode: true,
    transform(chunk, enc, cb) {
        if(crimesPerYear[chunk] == undefined) {
                            crimesPerYear[chunk] = 0
                        } else {
                            crimesPerYear[chunk] = crimesPerYear[chunk] + 1
                        }
                        // this.push(chunk)
                        cb()
    },
    flush(cb) {
        firstAnswer(crimesPerYear)
        cb()
    }
}))
input.pipe(new Transform({
    objectMode: true,
    transform(chunk, enc, cb) {
        const val = chunk['borough']
        this.push(val)
        cb()
    },
})).pipe(new PassThrough({
    objectMode: true,
    transform(chunk, enc, cb) {
            if(crimesPerLocation[chunk] == undefined) {
                crimesPerLocation[chunk] = 0
            } else {
                crimesPerLocation[chunk] = crimesPerLocation[chunk] + 1
            }
            cb()
    },
    flush(cb) {
        secondAnswer(crimesPerLocation)
        cb()
    }
}))

// TODO
// What is the least common crime?
// What is the most common crime per area?