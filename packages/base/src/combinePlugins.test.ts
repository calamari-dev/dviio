import { combinePlugins } from "./combinePlugins";

it("combinePlugins", () => {
  const rgbPlugin = combinePlugins(
    ({ x }) => (x === "R" ? { name: "$COLOR", color: "#f00" } : null),
    ({ x }) => (x === "G" ? { name: "$COLOR", color: "#0f0" } : null),
    ({ x }) => (x === "B" ? { name: "$COLOR", color: "#00f" } : null),
    ({ x }) => (x === "G" ? { name: "$COLOR", color: "ignored" } : null)
  );

  expect(rgbPlugin({ name: "XXX", x: "R" })).toEqual({
    name: "$COLOR",
    color: "#f00",
  });

  expect(rgbPlugin({ name: "XXX", x: "G" })).toEqual({
    name: "$COLOR",
    color: "#0f0",
  });

  expect(rgbPlugin({ name: "XXX", x: "B" })).toEqual({
    name: "$COLOR",
    color: "#00f",
  });
});
