import { Extension, MarketplaceLookupResponse, Version } from "./types";
import { execSync } from "child_process";

export function resultIsExtension(
  result: PromiseSettledResult<Extension>
): result is PromiseFulfilledResult<Extension> {
  return (
    result.status === "fulfilled" &&
    result.value?.hasOwnProperty("extensionName")
  );
}

export function getAllExtensions() {
  return execSync("code --list-extensions")
    .toString()
    .split("\n")
    .filter(Boolean);
}

/**
 * Lookup the extension data from the marketplace API
 * @param id the id of the VSCode extension
 * @returns
 */
export async function getExtensionData(id: string): Promise<Extension> {
  const body = {
    assetTypes: null,
    filters: [
      {
        criteria: [{ filterType: 7, value: id }],
        direction: 2,
        pageSize: 100,
        pageNumber: 1,
        sortBy: 0,
        sortOrder: 0,
        pagingToken: null,
      },
    ],
    flags: 2151,
  };

  try {
    const response = await fetch(
      "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;api-version=7.1-preview.1;excludeUrls=true",
        },
        body: JSON.stringify(body),
      }
    );
    const payload: MarketplaceLookupResponse = (await response.json());
    return payload.results[0].extensions[0];
  } catch (err: any) {
    console.error(`💀 Failed to fetch the extension "${id}" on the VSCode marketplace`);
    return Promise.reject();
  }
}

export function createLink(id: string) {
  return `https://marketplace.visualstudio.com/items?itemName=${id}`;
}

function getExtensionId(extension: Extension) {
  return `${extension.publisher.publisherName}.${extension.extensionName}`;
}

function getIcon(latestVersion: Version) {
  const icon = latestVersion.files.find(
    (file) => file.assetType === "Microsoft.VisualStudio.Services.Icons.Small"
  );
  const defaultIcon = `https://cdn.vsassets.io/v/M213_20221206.3/_content/Header/default_icon_128.png`;
  return icon ? icon.source : defaultIcon;
}

/**
 * Create a table that should work well on a github readme file
 * @link see more about the GH spec here https://github.github.com/gfm/
 */
export function createMarkdownTable(extensions: Extension[]) {
  const rows = extensions.map((extension) => {
    const [latestVersion] = extension.versions;

    return `| <a href="${createLink(
      getExtensionId(extension)
    )}"><img width="100" src="${getIcon(latestVersion)}" alt="${
      extension.displayName
    }"> | <h3><a href="${createLink(getExtensionId(extension))}">${
      extension.displayName
    }</a></h3>${extension.shortDescription.replaceAll("\n", " ")} |`;
  });

  let markdownTable = "| Icon | Extension |\n";
  markdownTable += "| --- | --- |\n";
  markdownTable += rows.join("\n");

  return markdownTable;
}
