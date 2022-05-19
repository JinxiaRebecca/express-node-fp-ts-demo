import { pipe } from "./lib";
import { removeItemById, TaskItem, taskItems, updateItem } from "./TaskItem";

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

  describe("updateItem", () => {
    it("should return update successfully", () => {
      let item: TaskItem = { id: 1, status: "pending" };
      const result = updateItem(item);
      expect(result).toEqual("updated successfully");
    });
    it("should return item does not exist", () => {
      let item: TaskItem = { id: -1, status: "pending" };
      const result = updateItem(item);
      expect(result).toEqual("item does not exist");
    });
  });
});
