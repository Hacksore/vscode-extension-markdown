import got from "got";
import { Extension } from "./types";

export async function getExtensionData(id: string) {
  const data = JSON.stringify({
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
  });

  const req = await got(
    "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json;api-version=7.1-preview.1;excludeUrls=true",
      },
      body: data,
    }
  );

  if (req.statusCode !== 200) {
    console.log("Error getting " + id);
    console.log(req.body);
    return null;
  }

  const payload = JSON.parse(req.body);

  return payload.results[0].extensions[0];
}

export function createLink(id: string) {
  return `https://marketplace.visualstudio.com/items?itemName=${id}`;
}

export function createMarkdownTable(extensions: Extension[]) {
  const rows = extensions.map((extension) => {
    const latestVersion = extension.versions[0];

    return `| <a href="${createLink(extension.id)}"><img width="100" src="${
      latestVersion.assetUri
    }/Microsoft.VisualStudio.Services.Icons.Default" alt="${
      extension.displayName
    }"> | <h3><a href="${createLink(extension.id)}">${
      extension.displayName
    }</a></h3>${extension.shortDescription.replaceAll("\n", " ")} |`;
  });

  const markdownTable = `| Icon | Extension |
| --- | --- |
${rows.join(`\n`)}
`;
  return markdownTable;
}
