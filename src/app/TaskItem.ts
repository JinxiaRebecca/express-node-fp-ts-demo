import { E } from "./lib";

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
    (input: TaskItem) => !taskItems.some((taskItem) => input.id === taskItem.id),
    () => "The item is already esixting"
  )(item);

