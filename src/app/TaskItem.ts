import { E, pipe, A, O, T } from "./lib";

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

const findItemIndexByItemId = (id: number): E.Either<string, number> =>
  pipe(
    taskItems,
    A.findIndex((item) => item.id === id),
    E.fromOption(() => "item does not exist")
  );

const removeItemByIndex = (index: number): E.Either<string, string> =>
  pipe(
    taskItems,
    A.deleteAt(index),
    E.fromOption(() => "delete failed"),
    E.map(() => "delete successfully")
  );

type ItemById = (id: number) => E.Either<string, number>;
type DeleteItem = (index: number) => E.Either<string, string>;

const removeItem =
  (findItemIndexByItemId: ItemById, removeItemByIndex: DeleteItem) =>
  (id: number): E.Either<string, string> =>
    pipe(id, findItemIndexByItemId, E.chain(removeItemByIndex));

export const removeItemById = removeItem(
  findItemIndexByItemId,
  removeItemByIndex
);

export const updateItem = (taskItem: TaskItem): string =>
  pipe(
    taskItems,
    A.updateAt(
      pipe(
        findItemIndexByItemId(taskItem.id),
        E.fold(
          () => -1,
          (right) => right
        )
      ),
      taskItem
    ),
    O.matchW(
      () => "item does not exist",
      (right) =>
        right.some(
          (item) => item.id === taskItem.id && item.status === taskItem.status
        )
          ? "updated successfully"
          : "updated failed"
    )
  );
