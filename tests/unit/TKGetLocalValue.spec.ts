// import { shallowMount } from "@vue/test-utils";

import { TKGetLocalValue, TKLabel } from "@/domain/utils/TKLabel";

describe("TKGetLocalValue", () => {
  it("renders props.msg when passed", () => {
    const labelWithEnglish: TKLabel = {
      en: "english",
      fr: "french"
    };

    expect(TKGetLocalValue(labelWithEnglish, "en")).toMatch("english");
    expect(TKGetLocalValue(labelWithEnglish, "fr")).toMatch("french");
    expect(TKGetLocalValue(labelWithEnglish, "FR")).toMatch("english");
    expect(TKGetLocalValue(labelWithEnglish, "blablabla")).toMatch("english");

    const labelWithoutEnglish: TKLabel = {
      fr: "french",
      it: "italian"
    };

    expect(TKGetLocalValue(labelWithoutEnglish, "it")).toMatch("italian");
    expect(TKGetLocalValue(labelWithoutEnglish, "fr")).toMatch("french");
    expect(TKGetLocalValue(labelWithoutEnglish, "blablabla")).toMatch("");
  });
});
