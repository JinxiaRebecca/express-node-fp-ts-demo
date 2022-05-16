import express = require('express');
import { number } from 'fp-ts';
import { pipe, flow } from 'fp-ts/lib/function';

const app : express.Application = express();

app.get('/', (req, res) => {
    res.send('First Express and node.js app!!');
});

app.listen(3000, () => {
    console.log('Demo app listenning on port 3000');
});

function add1(num: number): number {
    return num + 1;
}

function multiply1(num: number): number {
    return num * 2;
}

const pipeResult = pipe(1, add1, multiply1);
const flowResult = flow(add1, multiply1)(1);
console.log('pipe:' + pipeResult);
console.log('flow:' + flowResult);