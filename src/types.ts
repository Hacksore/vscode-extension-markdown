export interface MarketplaceLookupResponse {
  results: { 
    extensions: Extension[]
  }[],
  pagingToken: null | string,
  resultMetadata: any[]
}

/**
 * Shape of an extensions
 */
export interface Extension {
  publisher: Publisher;
  /**
   * The real id of the ext
   */
  id: string;
  /**
   * The guid that M$ adds
   */
  extensionId: string;
  extensionName: string;
  displayName: string;
  flags: string;
  lastUpdated: string;
  publishedDate: string;
  releaseDate: string;
  shortDescription: string;
  versions: Version[];
  categories: string[];
  tags: string[];
  installationTargets: any[];
  deploymentType: number;
}

export interface Publisher {
  publisherId: string;
  publisherName: string;
  displayName: string;
  flags: string;
  domain: any;
  isDomainVerified: boolean;
}

type AssetType = `Microsoft.VisualStudio.${'Code.Manifest' | 'Services.Content.Changelog' | 'Services.Content.Details' | 'Services.Content.License' | 'Services.Icons.Default' | 'Services.Icons.Small' | 'Services.VsixManifest' | 'Services.VSIXPackage'}`;

export interface File {
  assetType: AssetType;
  source: string;
}

export interface Version {
  version: string;
  flags: string;
  files: File[];
  lastUpdated: string;
  assetUri: string;
  fallbackAssetUri: string;
}
