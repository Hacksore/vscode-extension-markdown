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

  const flags = ["-f", "--file"];
  const flagIndex = process.argv.findIndex((val) => flags.includes(val));
  const file = flagIndex >= 0 ? process.argv[flagIndex + 1] : undefined;

  if (file) {
    // make the file path if it does not exist, no-op if it does
    await mkdir(path.dirname(file), { recursive: true });

    // write the list to the file
    await writeFile(file, markdownTableString);
    console.log(`\n🥳 Extension list now in ${file}`);
  } else {
    clipboardy.writeSync(markdownTableString);
    console.log("\n🥳 Extension list markdown table copied to clipboard!");
  }
}

run();
