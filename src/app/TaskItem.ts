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

export const findItemIndexByItemId = (
  id: number
): TE.TaskEither<string, number> =>
  pipe(
    taskItems,
    A.findIndex((item) => item.id === id),
    E.fromOption(() => "Item does not exist!"),
    TE.fromEither
  );

export const removeItemByIndex = (
  index: number
): TE.TaskEither<string, string> =>
  pipe(
    taskItems,
    A.deleteAt(index),
    E.fromOption(() => "delete failed"),
    E.map(() => "delete successfully"),
    TE.fromEither
  );

