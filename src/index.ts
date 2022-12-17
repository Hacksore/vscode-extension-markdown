#!/usr/bin/env node

import { execSync } from "child_process";
import clipboardy from "clipboardy";
import type { Extension } from "./types.js";
import { createMarkdownTable, getExtensionData } from "./utils.js";

(async () => {
  console.log("Getting list of extensions...");
  const extensionList = execSync("code --list-extensions")
    .toString()
    .split("\n");
  extensionList.pop();

  const allExtensions: Extension[] = [];
  for (const ext of extensionList) {
    const extInfo: Extension = await getExtensionData(ext);
    allExtensions.push({
      ...extInfo,
      id: ext,
    });
  }

  const markdownTableString = createMarkdownTable(allExtensions);

  clipboardy.writeSync(markdownTableString);
  console.log("🥳 Extension list markdown table copied to clipboard!");

})();
