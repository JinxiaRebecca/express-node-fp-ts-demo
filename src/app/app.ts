import express = require("express");
import { pipe, flow } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { string } from "fp-ts";
import { fromEither } from "fp-ts/lib/OptionT";
import { right } from "fp-ts/lib/EitherT";

const app: express.Application = express();


type TaskItem = {
  id: number,
  status: string
}
 var taskItems: TaskItem[] = [{id: 1, status: "active"}, {id: 2, status: "suspended"}, {id: 3, status: "pending"}];

//first endpoint --> /init
app.get('/init', (req, res) => {
  res.send(taskItems);
});

app.listen(3000, () => {
  console.log("Demo app listenning on port 3000");
});

function add1(num: number): number {
  return num + 1;
}

function multiply1(num: number): number {
  return num * 2;
}

const pipeResult = pipe(1, add1, multiply1);
const flowResult = flow(add1, multiply1)(1);
console.log("pipe:" + pipeResult);
console.log("flow:" + flowResult);

const doubleIfEvenElseNone = (n: number) =>
  n % 2 === 0 ? O.some(2 * n) : O.none;

const addIfEven = (n: number) => (n % 2 === 0 ? O.some(n + 1) : O.some(n));

const optionEven = O.some(2);
const optionOdd = O.some(1);

const even = pipe(optionEven, O.map(doubleIfEvenElseNone), O.flatten);

console.log("option even" + JSON.stringify(even));

const odd = pipe(optionOdd, O.chain(doubleIfEvenElseNone), O.chain(addIfEven));
console.log("option odd " + JSON.stringify(odd));

const validateInput = (userName: string | undefined | null): string =>
  pipe(
    O.fromNullable(userName),
    E.fromOption(() => "userName must be mandatory!"),
    E.fold(
      (left) => "userName is not valid",
      (right) => `userName is ${userName}`
    )
  );
console.log(validateInput("Andy"));
console.log(validateInput(null));

type UserInfo = {
  userName: string;
  password: string;
};

function validUserName(user: UserInfo): E.Either<string, string> {
  return user.userName.length > 6
    ? E.right(`user name is ${user.userName}`)
    : E.left("invalid user name");
}

const validateUserInfo = (user: UserInfo): any => {
  pipe(
    user,
    validUserName,
    E.map(() => console.log(user.userName))
  );
};
const testUserInvalidName: UserInfo = {
  userName: "Coo",
  password: "123456",
};
const testUser: UserInfo = {
  userName: "Anglela",
  password: "344555",
};
validateUserInfo(testUser);
validateUserInfo(testUserInvalidName);

//TaskEither
type Item = {
  id: string;
  name: string;
};

type itemIdsByList = (listId: string) => TE.TaskEither<string, string[]>;
type itemDetailById = (itemId: string) => TE.TaskEither<string, Item>;

const fetchItemIdsByListRight = (
  listId: string
): TE.TaskEither<string, string[]> => TE.right(["1", "2", "3"]);

const fetchItemDetailByIdRight = (listId: string) =>
  TE.left("There is no such list");

const fetchItem =
  (fetchItemIdsByList: itemIdsByList, fetchItemDetailById: itemDetailById) =>
  (listId: string): T.Task<string> =>
    pipe(
      listId,
      E.fromNullable("The list is not presnet!"),
      TE.fromEither,
      TE.fold(
        (left) => T.of(left),
        (right) => T.of(`The items are ${JSON.stringify(right)}`)
      )
    );

console.log(
  fetchItem(fetchItemIdsByListRight, fetchItemDetailByIdRight)("1")()
);
