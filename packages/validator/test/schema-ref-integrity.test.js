import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const schemaRoot = path.resolve("schemas/v0.1");

async function readSchema(file) {
  return JSON.parse(await readFile(path.join(schemaRoot, file), "utf8"));
}

async function listSchemaFiles() {
  const entries = await readdir(schemaRoot);
  return entries.filter((entry) => entry.endsWith(".schema.json")).sort();
}

function collectRefs(value, refs = []) {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectRefs(item, refs);
    }
    return refs;
  }

  if (value && typeof value === "object") {
    if (typeof value.$ref === "string") {
      refs.push(value.$ref);
    }
    for (const nestedValue of Object.values(value)) {
      collectRefs(nestedValue, refs);
    }
  }

  return refs;
}

function resolveFragment(document, fragment) {
  if (fragment === "") {
    return document;
  }

  const parts = fragment.replace(/^#\//, "").split("/");
  return parts.reduce((current, part) => {
    if (current && typeof current === "object") {
      return current[part];
    }
    return undefined;
  }, document);
}

test("v0.1 schemas parse and local refs resolve", async () => {
  const schemas = new Map();

  for (const schemaFile of await listSchemaFiles()) {
    schemas.set(schemaFile, await readSchema(schemaFile));
  }

  for (const [schemaFile, schema] of schemas) {
    for (const ref of collectRefs(schema)) {
      if (/^https?:\/\//.test(ref)) {
        continue;
      }

      const [targetFile, fragment = ""] = ref.startsWith("#")
        ? [schemaFile, ref]
        : splitRelativeRef(ref);

      assert.ok(schemas.has(targetFile), `${schemaFile} references missing schema ${targetFile}`);
      assert.notEqual(
        resolveFragment(schemas.get(targetFile), fragment),
        undefined,
        `${schemaFile} references missing fragment ${ref}`
      );
    }
  }
});

function splitRelativeRef(ref) {
  const hashIndex = ref.indexOf("#");
  if (hashIndex === -1) {
    return [ref, ""];
  }
  return [ref.slice(0, hashIndex), ref.slice(hashIndex)];
}
