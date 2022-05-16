import express = require('express');
import { pipe, flow } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/lib/Either';

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


const validateInput = (userName: string | undefined | null): string => 
  pipe(
    O.fromNullable(userName),
    E.fromOption(() => "userName must be mandatory!"),
    E.fold(
      (left) => "userName is not valid",
      (right) => `userName is ${userName}`
    )

  );
console.log(validateInput('Andy'));
console.log(validateInput(null));


type UserInfo = {
  userName: string,
  password: string
}

function validUserName(user: UserInfo): E.Either<string, string> {
  return user.userName.length > 6 ? E.right(`user name is ${user.userName}`) : E.left("invalid user name");
}

const validateUserInfo = (user: UserInfo): any => {
  pipe(
    user,
    validUserName,
    E.map(() => console.log(user.userName))
  );
}
const testUserInvalidName: UserInfo = {
  userName: "Coo",
  password: "123456"
}
const testUser: UserInfo = {
  userName: "Anglela",
  password: "344555"
}
validateUserInfo(testUser)
validateUserInfo(testUserInvalidName)