import { number } from "fp-ts-std";
import { idText } from "typescript";
import { NEA, TE, T, pipe } from "./lib";
import {
  removeItemById,
  TaskItem,
  taskItems,
  updateStatusOfItem,
} from "./TaskItem";

describe("TaskEither", () => {
  describe("removeItemById", () => {
    it("should return delete successfully", async () => {
      const result = await pipe(
        removeItemById(1),
        TE.getOrElse((error) => T.of(error))
      )();
      expect(result).toEqual("delete successfully");
    });
    it("should return item does not exist", async () => {
      let id: number = taskItems.length + 1;
      const result = await pipe(
        removeItemById(id),
        TE.getOrElse((error) => T.of(error))
      )();
      expect(result).toEqual("item does not exist");
    });
  });

  describe("updateStatusOfItem", () => {
    it("should return update successfully", async () => {
      let item: TaskItem = { id: 1, status: "suspened" };
      const result = await pipe(
        updateStatusOfItem(item),
        TE.getOrElse((error) => T.of(error))
      )();
      expect(result).toEqual("update successfully");
    });
    it("should return update status failed", async () => {
      let index = taskItems.length + 1;
      let item: TaskItem = { id: index, status: "active" };
      const result = await pipe(
        updateStatusOfItem(item),
        TE.getOrElse((error) => T.of(error))
      )();
      expect(result).toEqual("update successfully");
    });
  });
});
