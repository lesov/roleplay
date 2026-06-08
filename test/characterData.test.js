import assert from "node:assert/strict";
import test from "node:test";
import { races, classes, backgrounds } from "../src/characterData.js";

const groups = [
  { name: "races", items: races },
  { name: "classes", items: classes },
  { name: "backgrounds", items: backgrounds },
];

const kebabOnly = /^[a-z][a-z0-9-]*$/;

for (const { name, items } of groups) {
  test(`${name} is non-empty`, () => {
    assert.ok(items.length > 0, `${name} must not be empty`);
  });

  test(`every ${name} entry has a non-empty id and label`, () => {
    for (const entry of items) {
      assert.ok(entry.id && typeof entry.id === "string", `${name} entry missing id`);
      assert.ok(entry.label && typeof entry.label === "string", `${name} entry missing label`);
    }
  });

  test(`${name} ids are unique`, () => {
    const ids = items.map((e) => e.id);
    const unique = new Set(ids);
    assert.equal(unique.size, ids.length, `${name} has duplicate ids`);
  });

  test(`${name} ids are lowercase-kebab`, () => {
    for (const entry of items) {
      assert.ok(kebabOnly.test(entry.id), `${name} id "${entry.id}" is not lowercase-kebab`);
    }
  });
}
