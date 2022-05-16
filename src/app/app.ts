import express = require('express');
import { number } from 'fp-ts';
import { pipe, flow } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import { Json } from 'io-ts-types';

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

const doubleIfEvenElseNone = (n: number) => n % 2 === 0
  ? O.some(2 * n)
  : O.none

const addIfEven = (n: number) => n % 2 === 0
  ? O.some(n + 1)
  : O.some(n)

  const optionEven = O.some(2);
  const optionOdd = O.some(1);

const even = pipe(
  optionEven,
  O.map(doubleIfEvenElseNone),
  O.flatten
);

console.log("option even" + JSON.stringify(even));

const odd = pipe(
  optionOdd,
  O.chain(doubleIfEvenElseNone),
  O.chain(addIfEven)
);
console.log("option odd "+ JSON.stringify(odd))
