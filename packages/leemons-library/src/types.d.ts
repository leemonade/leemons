import { LRN } from '@leemons/lrn';

export type UserAgentID = LRN<'users', 'UserAgent'>;
export type UserID = LRN<'users', 'User'>;

export type FileID = LRN<'leebrary', 'File'>;
export type File = {
  id: FileID;
  deploymentID: string;
  provider: string;
  type: string;
  extension: string;
  name: string;
  size: number;
  uri: string;
  metadata: string;
};

export type CategoryID = LRN<'leebrary', 'Category'>;
export type Category = {
  id: CategoryID;
  deploymentID: string;
  key: string;
  pluginOwner: string;
  creatable: boolean;
  createUrl: string;
  duplicable: boolean;
  provider: string;
  componentOwner: string;
  listCardComponent: string;
  listItemComponent: string;
  detailComponent: string;
  canUse: string;
  order: number;
};

export type AssetID = LRN<'common', 'CurrentVersions'>;

export type Asset = {
  id: AssetID;
  deploymentID: string;
  name: string;
  tagline?: string;
  description?: string;
  color?: string;
  cover?: FileID | File;
  fromUser: UserID;
  fromUserAgent: UserAgentID;
  public?: boolean;
  category: CategoryID | Category;
  indexable: boolean;
  isCover: boolean;
  center?: string;
  program?: string;
  url?: string;
  file?: FileID | File;
  fileType?: string;
  fileExtension?: string;
  original?: Asset;
  providerData?: {
    role?: string;
  };
  mediaType?: string;
};

export type PinID = LRN<'leebrary', 'Pin'>;
export type Pin = {
  id: PinID;
  deploymentID: string;
  asset: AssetID | Asset;
  userAgent: UserAgentID;
};

export type ProviderID = LRN<'leebrary', 'Provider'>;
export type Provider = {
  pluginName: string;
  name: string;
  image: string;
  supportedMethods: {
    uploadMultipartChunk: boolean;
    finishMultipart: boolean;
    abortMultipart: boolean;
    getS3AndConfig: boolean;
    getReadStream: boolean;
    removeConfig: boolean;
    newMultipart: boolean;
    getConfig: boolean;
    setConfig: boolean;
    upload: boolean;
    remove: boolean;
    clone: boolean;
  };
};

export function addCategoryDeploy<C = Context>(params: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyValueModel: any;
  category: {
    key: string;
    [key: string]: unknown;
  };
  ctx: C;
}): Promise<void>;
