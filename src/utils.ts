import { Extension, Version } from "./types";

export async function getExtensionData(id: string) {
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

  const payload = await fetch(
    "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json;api-version=7.1-preview.1;excludeUrls=true",
      },
      body: JSON.stringify(body),
    }
  )
  .then(res => res.json())
  .catch(err => {
    console.log("Error getting " + id);
    console.log(err);
  })

  return payload.results[0].extensions[0];
}

export function createLink(id: string) {
  return `https://marketplace.visualstudio.com/items?itemName=${id}`;
}

function getExtensionId(extension: Extension) {
  return `${extension.publisher.publisherName}.${extension.extensionName}`;
}

function getIcon(latestVersion: Version) {
  const icon =  latestVersion.files.find(file => file.assetType === 'Microsoft.VisualStudio.Services.Icons.Small');
  const defaultIcon = `https://cdn.vsassets.io/v/M213_20221206.3/_content/Header/default_icon_128.png`;
  return icon ? icon.source : defaultIcon;
}

export function createMarkdownTable(extensions: Extension[]) {
  const rows = extensions.map((extension) => {
    const [latestVersion] = extension.versions;

    return `| <a href="${createLink(getExtensionId(extension))}"><img width="100" src="${getIcon(latestVersion)}" alt="${
      extension.displayName
    }"> | <h3><a href="${createLink(getExtensionId(extension))}">${
      extension.displayName
    }</a></h3>${extension.shortDescription.replaceAll("\n", " ")} |`;
  });

  const markdownTable = `| Icon | Extension |
| --- | --- |
${rows.join(`\n`)}
`;
  return markdownTable;
}
