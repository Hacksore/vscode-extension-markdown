#!/usr/bin/env node

import { execSync } from "child_process";
import clipboardy from "clipboardy";
import type { Extension } from "./types.js";
import { createMarkdownTable, getExtensionData } from "./utils.js";


function resultIsExtension(result: PromiseSettledResult<Extension>): result is PromiseFulfilledResult<Extension> {
  return result.status === 'fulfilled' && result.value.hasOwnProperty('extensionName');
}

async function run() {
  console.log("Getting list of extensions with `code --list-extensions ");
  const extensionList = execSync("code --list-extensions")
    .toString()
    .split("\n")
    .filter(Boolean)
    .slice(0, 3); // dev
  console.info(`Found ${extensionList.length} extensions!`)

  // Fetch all extensionn concurrently. This seems to work, but if it's ever blocked, we might need to switch back to doing one at a time.
  const allExtensionPromises = await Promise.allSettled<Extension>(extensionList.map(getExtensionData))

  const allExtensions = allExtensionPromises
    .filter(resultIsExtension)
    .map(result => result.value);

  const markdownTableString = createMarkdownTable(allExtensions);

  clipboardy.writeSync(markdownTableString);
  console.log("🥳 Extension list markdown table copied to clipboard!");

}

run();
