'use strict'

const {createReadStream, createWriteStream} = require('fs')
const {parse} = require('csv-parse');   
const { pipeline, Transform, PassThrough } = require('stream');


const rs = createReadStream('./london_crime_by_lsoa.csv')
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

pipeline(
    rs,
    csvParser,
    new PassThrough({
        objectMode: true,
        transform(chunk, enc, cb) {
            const val = chunk['year']
            if(crimesPerYear[val] == undefined) {
                crimesPerYear[val] = 0
            } else {
                crimesPerYear[val] = crimesPerYear[val] + 1
            }
            this.push(chunk)
            cb()
        }
    }),
    new PassThrough({
        objectMode: true,
        transform(chunk, enc, cb) {
            const val = chunk['borough']
            if(crimesPerLocation[val] == undefined) {
                crimesPerLocation[val] = 0
            } else {
                crimesPerLocation[val] = crimesPerLocation[val] + 1
            }
            cb()
        }
    }),
    (err) => {
        firstAnswer(crimesPerYear)
        secondAnswer(crimesPerLocation)
        if(err) {
            console.error(err)
            process.exit(1)
        }
    }
)

// TODO
// What is the least common crime?
// What is the most common crime per area?
