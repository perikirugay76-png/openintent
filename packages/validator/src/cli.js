#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { validateOpenIntentObject } from "./index.js";

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("Usage: openintent-validate <file...>");
  process.exitCode = 2;
} else {
  let hasFailure = false;

  for (const file of files) {
    try {
      const json = JSON.parse(await readFile(file, "utf8"));
      const result = validateOpenIntentObject(json);
      if (result.valid) {
        console.log(`valid ${file}`);
      } else {
        hasFailure = true;
        console.error(`invalid ${file}`);
        for (const error of result.errors) {
          console.error(`  - ${error}`);
        }
      }
    } catch (error) {
      hasFailure = true;
      console.error(`invalid ${file}`);
      console.error(`  - ${error.message}`);
    }
  }

  if (hasFailure) {
    process.exitCode = 1;
  }
}
