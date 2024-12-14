import { parse } from "../src/parse"
import fs from "fs"
import { expect, test } from "@jest/globals"

test("elixir", async () => {
  const { covered, coveredForPatch, relevant, relevantForPatch, percentage, patchPercentage, files } = await parse(
    "elixir",
    "./example_coverage_files/excoveralls.json",
    {},
    ""
  )

  expect(covered).toBe(391)
  expect(coveredForPatch).toBe(0)
  expect(relevant).toBe(687)
  expect(relevantForPatch).toBe(0)
  expect(percentage).toBe("56.91")
  expect(patchPercentage).toBe("0.00")
  expect(files["lib/spendable/application.ex"]).toEqual({
    "10": true,
    "12": true,
    "20": true,
    "29": true,
    "31": false,
    "32": true,
    "36": true,
    "37": true,
    "44": false,
  })
})

test("go", async () => {
  const { covered, coveredForPatch, relevant, relevantForPatch, percentage, patchPercentage, files } = await parse(
    "go",
    "./example_coverage_files/go.out",
    {
      "terraform-provider-devhub/internal/provider/provider.go": [],
    },
    ""
  )

  expect(covered).toBe(123)
  expect(coveredForPatch).toBe(29)
  expect(relevant).toBe(182)
  expect(relevantForPatch).toBe(37)
  expect(percentage).toBe("67.58")
  expect(patchPercentage).toBe("78.38")
  expect(files["terraform-provider-devhub/internal/provider/provider.go"]).toEqual({
    "108.2,108.33": true,
    "108.33,110.3": false,
    "112.2,113.16": true,
    "113.16,121.3": false,
    "123.2,127.25": true,
    "127.25,129.3": true,
    "131.2,132.30": true,
    "135.87,140.2": true,
    "142.93,144.2": true,
    "146.80,147.34": true,
    "147.34,152.3": true,
    "37.122,40.2": true,
    "42.116,54.2": true,
    "56.125,61.33": true,
    "61.33,63.3": false,
    "65.2,65.27": true,
    "65.27,72.3": false,
    "74.2,74.29": true,
    "74.29,81.3": false,
    "83.2,83.33": true,
    "83.33,85.3": false,
    "87.2,90.25": true,
    "90.25,92.3": true,
    "94.2,94.27": true,
    "94.27,96.3": true,
    "98.19,106.3": false,
    "98.2,98.19": true,
  })
})

test("lcov", async () => {
  const { covered, coveredForPatch, relevant, relevantForPatch, percentage, patchPercentage, files } = await parse(
    "lcov",
    "./example_coverage_files/lcov.info",
    {
      "src/events/windows_events_structs.rs": [],
    },
    ""
  )

  expect(covered).toBe(1787)
  expect(coveredForPatch).toBe(44)
  expect(relevant).toBe(2706)
  expect(relevantForPatch).toBe(44)
  expect(percentage).toBe("66.04")
  expect(patchPercentage).toBe("100.00")
  expect(files["src/utils/time_utils.rs"]).toEqual({
    "10": true,
    "11": true,
    "12": true,
    "13": true,
    "16": false,
    "17": false,
    "18": false,
    "19": false,
    "20": false,
    "21": false,
  })
})

test("ruby - simplecov", async () => {
  const { covered, coveredForPatch, relevant, relevantForPatch, percentage, patchPercentage, files } = await parse(
    "ruby",
    "./example_coverage_files/simplecov.json",
    {
      "app/builders/account_builder.rb": [],
    },
    ""
  )

  expect(covered).toBe(23700)
  expect(coveredForPatch).toBe(10)
  expect(relevant).toBe(30823)
  expect(relevantForPatch).toBe(10)
  expect(percentage).toBe("76.89")
  expect(patchPercentage).toBe("100.00")
  expect(files["lib/core_ext/array.rb"]).toEqual({
    "1": true,
    "2": true,
    "3": false,
    "4": false,
    "5": false,
  })
})
