#!/usr/bin/env node

import clipboardy from "clipboardy";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import type { Extension } from "./types.js";
import {
  createMarkdownTable,
  getAllExtensions,
  getExtensionData,
  resultIsExtension,
} from "./utils.js";

async function run() {
  console.log("Getting list of extensions with `code --list-extensions ");
  const extensionList = getAllExtensions();
  console.info(`Found ${extensionList.length} extensions!`);

  // Fetch all extension concurrently. This seems to work, but if it's ever blocked, we might need to switch back to doing one at a time.
  const allExtensionPromises = await Promise.allSettled<Extension>(
    extensionList.map(getExtensionData)
  );

  const allExtensions = allExtensionPromises
    .filter(resultIsExtension)
    .map((result) => result.value);
  const markdownTableString = createMarkdownTable(allExtensions);

  const flagIndex =
    process.argv.indexOf("--file") || process.argv.indexOf("-f");
  console.log(process.argv);
  const file = flagIndex >= 0 ? process.argv[flagIndex + 1] : undefined;

  if (file) {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, markdownTableString);
    console.log(`\n🥳 Extension list now in ${file}`);
  } else {
    clipboardy.writeSync(markdownTableString);
    console.log("\n🥳 Extension list markdown table copied to clipboard!");
  }
}

run();
