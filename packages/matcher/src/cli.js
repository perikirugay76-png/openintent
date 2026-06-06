#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { createMatchReport } from "./index.js";

const [intentPath, capabilityPath] = process.argv.slice(2);

if (!intentPath || !capabilityPath) {
  console.error("Usage: openintent-match <intent-card.json> <capability-card.json>");
  process.exitCode = 2;
} else {
  try {
    const intentCard = JSON.parse(await readFile(intentPath, "utf8"));
    const capabilityCard = JSON.parse(await readFile(capabilityPath, "utf8"));
    const report = createMatchReport(intentCard, capabilityCard);
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
