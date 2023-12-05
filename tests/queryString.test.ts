import { DesignQueryParams } from "../src/types";
import { buildDesignQueryParams } from "../src/utility";

describe("Correctly build query string from the React state", () => {
  it("should build the correct query string with only design type", () => {
    const testParams: DesignQueryParams = {
      designType: "Screen Print",
    };

    expect(buildDesignQueryParams(testParams)).toBe("designtype=screen print");
  });

  it("should build the correct query string with design type, page number, and keywords", () => {
    const testParams: DesignQueryParams = {
      designType: "Embroidery",
      pageNumber: 4,
      keywords: ["dog", "cat", "alien"],
    };

    expect(buildDesignQueryParams(testParams)).toBe(
      "designtype=embroidery&pageNumber=4&keywords=dog,cat,alien"
    );
  });

  it("should build the correct query string with design type, tags, and count per page", () => {
    const testParams: DesignQueryParams = {
      designType: "Screen Print",
      tags: ["abc", "def"],
      countPerPage: 13,
    };

    expect(buildDesignQueryParams(testParams)).toBe(
      "designtype=screen print&perPage=13&tags=abc,def"
    );
  });

  it("should build the correct query string with design type, page number, subcategory, keywords, and tags", () => {
    const testParams: DesignQueryParams = {
      designType: "Embroidery",
      pageNumber: 3,
      subcategory: "St. Patrick's Day",
      keywords: ["apple", "pear"],
      tags: ["hat", "ball", "shirt"],
    };

    expect(buildDesignQueryParams(testParams)).toBe(
      "designtype=embroidery&subcategory=St. Patrick's Day&pageNumber=3&tags=hat,ball,shirt&keywords=apple,pear"
    );
  });
});
