#!/usr/bin/env node

import { execSync } from "child_process";
import clipboardy from "clipboardy";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import type { Extension } from "./types.js";
import { createMarkdownTable, getExtensionData } from "./utils.js";



function resultIsExtension(result: PromiseSettledResult<Extension>): result is PromiseFulfilledResult<Extension> {
  return result.status === 'fulfilled' && result.value?.hasOwnProperty('extensionName');
}

async function run() {
  console.log("Getting list of extensions with `code --list-extensions ");
  const extensionList = execSync("code --list-extensions")
    .toString()
    .split("\n")
    .filter(Boolean)
  console.info(`Found ${extensionList.length} extensions!`)

  // Fetch all extensionn concurrently. This seems to work, but if it's ever blocked, we might need to switch back to doing one at a time.
  const allExtensionPromises = await Promise.allSettled<Extension>(extensionList.map(getExtensionData))

  const allExtensions = allExtensionPromises
    .filter(resultIsExtension)
    .map(result => result.value);
  const markdownTableString = createMarkdownTable(allExtensions);

  const flagIndex = process.argv.indexOf('--file') || process.argv.indexOf('-f');
  const file = flagIndex >= 0 ? process.argv[flagIndex + 1] : undefined;

  if(file) {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, markdownTableString);
    console.log(`\n\n\t🥳 Extension list now in ${file}`);
  }
  else {
    clipboardy.writeSync(markdownTableString);
    console.log("\n\n\t🥳 Extension list markdown table copied to clipboard!");
  }
}

run();
