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

export interface Version {
  version: string;
  flags: string;
  lastUpdated: string;
  assetUri: string;
  fallbackAssetUri: string;
}
