import express = require("express");
import { left, right } from "fp-ts/lib/These";
import { pipe, flow, O, E, TE, T, A } from "./lib";
import * as TI from "./TaskItem";

const app: express.Application = express();
const bodyParse = require("body-parser");

//first endpoint --> /init
app.get("/init", (req, res) => {
  res.send(TI.taskItems);
});

app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());

//second endpoint --> add
app.post("/add", (req, res) => {
  const validateInput = (item: TI.TaskItem | undefined | null) =>
    pipe(
      O.fromNullable(item),
      E.fromOption(() => "The input is not present!"),
      E.chain(TI.doubleIdValidation)
    );
  res.send(
    pipe(
      req.body as TI.TaskItem,
      validateInput,
      E.map((item) => TI.taskItems.push(item)),
      E.map(() => "add successfully"),
      E.fold(
        (left) => left,
        (right) => right
      )
    )
  );
});

//third endpoint --> remove
app.delete("/delete/:id", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, OPTIONS"
  );
  let itemId = Number(req.params.id);
  res.send(
    pipe(
      itemId,
      TI.removeItemById,
      E.fold(
        (left) => left,
        (right) => right
      )
    )
  );
});

//forth endpoint -> update status
app.patch("/update", (req, res) => {
  res.send(pipe(req.body as TI.TaskItem, TI.updateItem));
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
