import { toEcmaScriptString } from "./toEcmaScriptString";

describe("toEcmaScriptString", () => {
  it("OT1", () => {
    expect(toEcmaScriptString(0x00, "OT1")).toBe("Γ");
    expect(toEcmaScriptString(0x0c, "OT1")).toBe("fi");
  });

  it("OML", () => {
    expect(toEcmaScriptString(0x06, "OML")).toBe("𝛴");
  });

  it("OMS", () => {
    expect(toEcmaScriptString(0x04, "OMS")).toBe("÷");
  });

  it("OMX", () => {
    expect(toEcmaScriptString(0x03, "OMX")).toBe("]");
  });
});
