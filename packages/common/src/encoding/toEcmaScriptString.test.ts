import { assert } from "chai";
import { toEcmaScriptString } from "./toEcmaScriptString";

describe("toEcmaScriptString", () => {
  it("OT1", () => {
    assert.equal(toEcmaScriptString(0x00, "OT1"), "Γ");
    assert.deepEqual(toEcmaScriptString(0x0c, "OT1"), ["f", "i"]);
  });

  it("OML", () => {
    assert.equal(toEcmaScriptString(0x06, "OML"), "𝛴");
  });

  it("OMS", () => {
    assert.equal(toEcmaScriptString(0x04, "OMS"), "÷");
  });

  it("OMX", () => {
    assert.equal(toEcmaScriptString(0x03, "OMX"), "]");
  });
});
