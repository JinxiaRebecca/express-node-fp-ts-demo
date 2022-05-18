import { number } from "fp-ts-std";
import { idText } from "typescript";
import { NEA, TE, T, pipe } from "./lib";
import {
  findItemIndexByItemId,
  removeItemByIndex,
  taskItems,
} from "./TaskItem";

describe("TaskEither", () => {
  describe("findItemIndexByItemId", () => {
    it("should return the index", async () => {
      const result = await pipe(
        findItemIndexByItemId(1),
        TE.getOrElseW((error) => T.of(error))
      )();

      expect(result).toEqual(0);
    });

    it("should return Item does not exist!", async () => {
      const result = await pipe(
        findItemIndexByItemId(100),
        TE.getOrElseW((error) => T.of(error))
      )();

      expect(result).toEqual("Item does not exist!");
    });
  });

  describe("removeItemByIndex", () => {
    it("should return delete successfully", async () => {
      const result = await pipe(
        removeItemByIndex(1),
        TE.getOrElse((error) => T.of(error))
      )();

      expect(result).toEqual("delete successfully");
    });
  });
  it("should return delete failed", async () => {
    let index: number = taskItems.length
    const result = await pipe(
      removeItemByIndex(index + 1),
      TE.getOrElse((error) => T.of(error))
    )();

    expect(result).toEqual("delete failed");
  });
});
