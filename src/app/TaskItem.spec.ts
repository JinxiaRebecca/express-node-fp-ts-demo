import { number } from "fp-ts-std";
import { idText } from "typescript";
import { NEA, TE, T, pipe } from "./lib";
import {
  removeItemById,
  TaskItem,
  taskItems,
  updateStatusOfItem,
} from "./TaskItem";

describe("TaskItem", () => {
  describe("removeItemById", () => {
    it("should return delete successfully", () => {
      const result = pipe(removeItemById(1));
      expect(result).toEqual({ _tag: "Right", right: "delete successfully" });
    });
    it("should return item does not exist", () => {
      let id: number = taskItems.length + 1;
      const result = pipe(removeItemById(id));
      expect(result).toEqual({ _tag: "Left", left: "item does not exist" });
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
