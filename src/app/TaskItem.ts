import { number } from "fp-ts";
import { E, pipe, TE, A, O, T } from "./lib";

export type TaskItem = {
  id: number;
  status?: string;
};

export var taskItems: TaskItem[] = [
  { id: 1, status: "active" },
  { id: 2, status: "suspended" },
  { id: 3, status: "pending" },
];

export type TaskItemSpecification = {
  minValue?: number;
  checkIsExisted: boolean;
};

export const doubleIdValidation = (item: TaskItem) =>
  E.fromPredicate(
    (input: TaskItem) =>
      !taskItems.some((taskItem) => input.id === taskItem.id),
    () => "The item is already esixting"
  )(item);

const findItemIndexByItemId = (id: number): TE.TaskEither<string, number> =>
  pipe(
    taskItems,
    A.findIndex((item) => item.id === id),
    E.fromOption(() => "item does not exist"),
    TE.fromEither
  );

const removeItemByIndex = (index: number): TE.TaskEither<string, string> =>
  pipe(
    taskItems,
    A.deleteAt(index),
    E.fromOption(() => "delete failed"),
    E.map(() => "delete successfully"),
    TE.fromEither
  );

type ItemById = (id: number) => TE.TaskEither<string, number>;
type DeleteItem = (index: number) => TE.TaskEither<string, string>;

const removeItem =
  (findItemIndexByItemId: ItemById, removeItemByIndex: DeleteItem) =>
  (id: number): TE.TaskEither<string, string> =>
    pipe(id, findItemIndexByItemId, TE.chain(removeItemByIndex));

export const removeItemById = removeItem(
  findItemIndexByItemId,
  removeItemByIndex
);

export const updateStatusOfItem = (
  taskItem: TaskItem
): TE.TaskEither<string, string> =>
  pipe(
    taskItems,
    A.findIndex((item) => item.id === taskItem.id),
    O.matchW(
      () => O.some(taskItems),
      (right) => A.updateAt(right, taskItem)(taskItems)
    ),
    E.fromPredicate(
      () =>
        !taskItems.some(
          (item) => item.id === taskItem.id && item.status === taskItem.status
        ),
      () => "update status failed"
    ),
    E.map(() => "update successfully"),
    TE.fromEither
  );
