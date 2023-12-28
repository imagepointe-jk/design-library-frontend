import { getPageControlNumbers } from "../src/utility";

type TestCase = {
  totalPages: number;
  currentPage: number;
  expected: number[];
};

const testCases: TestCase[] = [
  //3 pages
  {
    totalPages: 3,
    currentPage: 1,
    expected: [1, 2, 3],
  },
  {
    totalPages: 3,
    currentPage: 2,
    expected: [1, 2, 3],
  },
  {
    totalPages: 3,
    currentPage: 3,
    expected: [1, 2, 3],
  },
  //4 pages
  {
    totalPages: 4,
    currentPage: 1,
    expected: [1, 2, 3, 4],
  },
  {
    totalPages: 4,
    currentPage: 2,
    expected: [1, 2, 3, 4],
  },
  {
    totalPages: 4,
    currentPage: 3,
    expected: [1, 2, 3, 4],
  },
  {
    totalPages: 4,
    currentPage: 4,
    expected: [1, 2, 3, 4],
  },
  //5 pages
  {
    totalPages: 5,
    currentPage: 1,
    expected: [1, 2, 3, 4, 5],
  },
  {
    totalPages: 5,
    currentPage: 2,
    expected: [1, 2, 3, 4, 5],
  },
  {
    totalPages: 5,
    currentPage: 3,
    expected: [1, 2, 3, 4, 5],
  },
  {
    totalPages: 5,
    currentPage: 4,
    expected: [1, 2, 3, 4, 5],
  },
  {
    totalPages: 5,
    currentPage: 5,
    expected: [1, 2, 3, 4, 5],
  },
  //6 pages
  {
    totalPages: 6,
    currentPage: 1,
    expected: [1, 2, 3, 6],
  },
  {
    totalPages: 6,
    currentPage: 2,
    expected: [1, 2, 3, 6],
  },
  {
    totalPages: 6,
    currentPage: 3,
    expected: [1, 2, 3, 4, 5, 6],
  },
  {
    totalPages: 6,
    currentPage: 4,
    expected: [1, 2, 3, 4, 5, 6],
  },
  {
    totalPages: 6,
    currentPage: 5,
    expected: [1, 4, 5, 6],
  },
  {
    totalPages: 6,
    currentPage: 6,
    expected: [1, 4, 5, 6],
  },
  //7 pages
  {
    totalPages: 7,
    currentPage: 1,
    expected: [1, 2, 3, 7],
  },
  {
    totalPages: 7,
    currentPage: 2,
    expected: [1, 2, 3, 7],
  },
  {
    totalPages: 7,
    currentPage: 3,
    expected: [1, 2, 3, 4, 7],
  },
  {
    totalPages: 7,
    currentPage: 4,
    expected: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    totalPages: 7,
    currentPage: 5,
    expected: [1, 4, 5, 6, 7],
  },
  {
    totalPages: 7,
    currentPage: 6,
    expected: [1, 5, 6, 7],
  },
  {
    totalPages: 7,
    currentPage: 7,
    expected: [1, 5, 6, 7],
  },
  //8 pages
  {
    totalPages: 8,
    currentPage: 1,
    expected: [1, 2, 3, 8],
  },
  {
    totalPages: 8,
    currentPage: 2,
    expected: [1, 2, 3, 8],
  },
  {
    totalPages: 8,
    currentPage: 3,
    expected: [1, 2, 3, 4, 8],
  },
  {
    totalPages: 8,
    currentPage: 4,
    expected: [1, 2, 3, 4, 5, 8],
  },
  {
    totalPages: 8,
    currentPage: 5,
    expected: [1, 4, 5, 6, 7, 8],
  },
  {
    totalPages: 8,
    currentPage: 6,
    expected: [1, 5, 6, 7, 8],
  },
  {
    totalPages: 8,
    currentPage: 7,
    expected: [1, 6, 7, 8],
  },
  {
    totalPages: 8,
    currentPage: 8,
    expected: [1, 6, 7, 8],
  },
  //9 pages
  {
    totalPages: 9,
    currentPage: 1,
    expected: [1, 2, 3, 9],
  },
  {
    totalPages: 9,
    currentPage: 2,
    expected: [1, 2, 3, 9],
  },
  {
    totalPages: 9,
    currentPage: 3,
    expected: [1, 2, 3, 4, 9],
  },
  {
    totalPages: 9,
    currentPage: 4,
    expected: [1, 2, 3, 4, 5, 9],
  },
  {
    totalPages: 9,
    currentPage: 5,
    expected: [1, 4, 5, 6, 9],
  },
  {
    totalPages: 9,
    currentPage: 6,
    expected: [1, 5, 6, 7, 8, 9],
  },
  {
    totalPages: 9,
    currentPage: 7,
    expected: [1, 6, 7, 8, 9],
  },
  {
    totalPages: 9,
    currentPage: 8,
    expected: [1, 7, 8, 9],
  },
  {
    totalPages: 9,
    currentPage: 9,
    expected: [1, 7, 8, 9],
  },
  //10 pages
  {
    totalPages: 10,
    currentPage: 1,
    expected: [1, 2, 3, 10],
  },
  {
    totalPages: 10,
    currentPage: 2,
    expected: [1, 2, 3, 10],
  },
  {
    totalPages: 10,
    currentPage: 3,
    expected: [1, 2, 3, 4, 10],
  },
  {
    totalPages: 10,
    currentPage: 4,
    expected: [1, 2, 3, 4, 5, 10],
  },
  {
    totalPages: 10,
    currentPage: 5,
    expected: [1, 4, 5, 6, 10],
  },
  {
    totalPages: 10,
    currentPage: 6,
    expected: [1, 5, 6, 7, 10],
  },
  {
    totalPages: 10,
    currentPage: 7,
    expected: [1, 6, 7, 8, 9, 10],
  },
  {
    totalPages: 10,
    currentPage: 8,
    expected: [1, 7, 8, 9, 10],
  },
  {
    totalPages: 10,
    currentPage: 9,
    expected: [1, 8, 9, 10],
  },
  {
    totalPages: 10,
    currentPage: 10,
    expected: [1, 8, 9, 10],
  },
  //11 pages
  {
    totalPages: 11,
    currentPage: 1,
    expected: [1, 2, 3, 11],
  },
  {
    totalPages: 11,
    currentPage: 2,
    expected: [1, 2, 3, 11],
  },
  {
    totalPages: 11,
    currentPage: 3,
    expected: [1, 2, 3, 4, 11],
  },
  {
    totalPages: 11,
    currentPage: 4,
    expected: [1, 2, 3, 4, 5, 11],
  },
  {
    totalPages: 11,
    currentPage: 5,
    expected: [1, 4, 5, 6, 11],
  },
  {
    totalPages: 11,
    currentPage: 6,
    expected: [1, 5, 6, 7, 11],
  },
  {
    totalPages: 11,
    currentPage: 7,
    expected: [1, 6, 7, 8, 11],
  },
  {
    totalPages: 11,
    currentPage: 8,
    expected: [1, 7, 8, 9, 10, 11],
  },
  {
    totalPages: 11,
    currentPage: 9,
    expected: [1, 8, 9, 10, 11],
  },
  {
    totalPages: 11,
    currentPage: 10,
    expected: [1, 9, 10, 11],
  },
  {
    totalPages: 11,
    currentPage: 11,
    expected: [1, 9, 10, 11],
  },
];

describe("Correctly produce page control numbers for any current page of 3 pages", () => {
  for (const testCase of testCases) {
    it(`Should produce the correct pages for totalPages = ${testCase.totalPages} and currentPage = ${testCase.currentPage}`, () => {
      const result = getPageControlNumbers(
        testCase.totalPages,
        testCase.currentPage
      );
      expect(result).toEqual(testCase.expected);
    });
  }
});

//rules
//show a page ONLY IF:
//it's the first page, or
//it's the last page, or
//it's the current page, or
//it's next to the current page AND the current page is NOT the first or last page, or
//it's 2 away from the current page AND the current page is the first or last page, or
//the page before it AND after it both meet one of the previous conditions (there's no point in hiding 2 in the sequence 1 ... 3)

// 1 2 3

// 1 2 3 4

// 1 2 3 4 5

// 1 2 3 ... 6
// ^
// 1 2 3 ... 6
//   ^
// 1 2 3 4 5 6
//     ^
// 1 2 3 4 5 6
//       ^
// 1 ... 4 5 6
//         ^

// 1 2 3 ... 7
// ^
// 1 2 3 ... 7
//   ^
// 1 2 3 4 ... 7
//     ^
// 1 2 3 4 5 6 7
//       ^
// 1 ... 4 5 6 7
//         ^
// 1 ... 5 6 7
//         ^

// 1 2 3 ... 8
// ^
// 1 2 3 ... 8
//   ^
// 1 2 3 4 ... 8
//     ^
// 1 2 3 4 5 ... 8
//       ^
// 1 ... 4 5 6 7 8
//         ^
// 1 ... 5 6 7 8
//         ^
// 1 ... 6 7 8
//         ^

// 1 2 3 ... 9
// ^
// 1 2 3 ... 9
//   ^
// 1 2 3 4 ... 9
//     ^
// 1 2 3 4 5 ... 9
//       ^
// 1 ... 4 5 6 ... 9
//         ^
// 1 ... 5 6 7 8 9
//         ^
// 1 ... 6 7 8 9
//         ^
// 1 ... 7 8 9
//         ^
// 1 ... 7 8 9
//           ^

// 1 2 3 ... 10
// ^
// 1 2 3 ... 10
//   ^
// 1 2 3 4 ... 10
//     ^
// 1 2 3 4 5 ... 10
//       ^
// 1 ... 4 5 6 ... 10
//         ^
// 1 ... 5 6 7 ... 10
//         ^
// 1 ... 6 7 8 9 10
//         ^
// 1 ... 7 8 9 10
//         ^
// 1 ... 8 9 10
//         ^
// 1 ... 8 9 10
//           ^

// 1 2 3 ... 11
// ^
// 1 2 3 ... 11
//   ^
// 1 2 3 4 ... 11
//     ^
// 1 2 3 4 5 ... 11
//       ^
// 1 ... 4 5 6 ... 11
//         ^
// 1 ... 5 6 7 ... 11
//         ^
// 1 ... 6 7 8 ... 11
//         ^
// 1 ... 7 8 9 10 11
//         ^
// 1 ... 8 9 10 11
//         ^
// 1 ... 9 10 11
//         ^
// 1 ... 9 10 11
//            ^
