import type { Loader } from "./types";
import { combineLoaders } from "./combineLoaders";

it("combineLoaders", async () => {
  class FirstLoader implements Loader<string> {
    reduce: Loader<string>["reduce"] = async (inst, state) => {
      switch (inst.name) {
        case "PUSH":
          state.extension += "A";
          return state;

        case "EOP":
          state.extension += "B";
          return state;
      }

      return state;
    };
  }

  class SecondLoader implements Loader<string> {
    reduce: Loader<string>["reduce"] = async (inst, state) => {
      switch (inst.name) {
        case "PUSH":
          state.extension += "C";
          return state;

        case "NOP":
          state.extension += "D";
          return state;
      }

      return state;
    };
  }

  const Loader = combineLoaders(FirstLoader, SecondLoader);
  const loader = new Loader();

  expect(
    await loader.reduce({ name: "PUSH" }, { extension: "X", fonts: [] })
  ).toEqual({ extension: "XAC", fonts: [] });

  expect(
    await loader.reduce({ name: "EOP" }, { extension: "X", fonts: [] })
  ).toEqual({ extension: "XB", fonts: [] });

  expect(
    await loader.reduce({ name: "NOP" }, { extension: "X", fonts: [] })
  ).toMatchObject({ extension: "XD", fonts: [] });

  expect(
    await loader.reduce({ name: "POP" }, { extension: "X", fonts: [] })
  ).toMatchObject({ extension: "X", fonts: [] });
});
