import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const projectRoot = path.resolve(import.meta.dirname, "..");
const dataPath = path.join(projectRoot, "app/data/cases.js");
const sandbox = { window: {} };

vm.runInNewContext(fs.readFileSync(dataPath, "utf8"), sandbox, { filename: dataPath });
const cases = sandbox.window.DERMATOLOGY_CASES;
const errors = [];

if (!Array.isArray(cases)) errors.push("DERMATOLOGY_CASES must be an array");
if (cases?.length < 30) errors.push("At least 30 verified cases are required");

const ids = new Set();
for (const item of cases ?? []) {
  if (!/^PMC\d+$/.test(item.id)) errors.push(`${item.id}: invalid PMCID`);
  if (ids.has(item.id)) errors.push(`${item.id}: duplicate case`);
  ids.add(item.id);

  if (!Array.isArray(item.choices) || item.choices.length !== 4) errors.push(`${item.id}: exactly four choices required`);
  if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer > 3) errors.push(`${item.id}: invalid answer index`);
  if (typeof item.course !== "string" || item.course.length < 70 || item.course.length > 240) errors.push(`${item.id}: course must be 70-240 characters`);
  if (!item.diagnosis || !item.grounds || !item.differential || !item.learning) errors.push(`${item.id}: reveal fields are incomplete`);
  if (!item.source?.pmid || !item.source?.pmcid || !item.source?.doi || !item.source?.authors || !item.source?.title) errors.push(`${item.id}: source metadata is incomplete`);

  const imagePath = path.join(projectRoot, "app", item.image.replace(/^\.\//, ""));
  if (!fs.existsSync(imagePath)) errors.push(`${item.id}: image is missing`);
  if (!path.basename(imagePath).startsWith(item.id.toLowerCase())) errors.push(`${item.id}: image filename must not contain a diagnosis`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`${cases.length} cases validated`);
