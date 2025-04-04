import type { ProgramID, SubjectID } from "@leemons/academic-portfolio";
import type { LRN } from "@leemons/lrn";
import type { LeemonsSchema } from "@leemons/mongodb";
import type { UserAgentID, UserID } from "@leemons/users";

export type FileID = LRN<"leebrary", "File">;
export type PinID = LRN<"leebrary", "Pin">;
export type AssetID = LRN<"common", "CurrentVersions">;
export type ProviderID = LRN<"leebrary", "Provider">;

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

export type CategoryID = LRN<"leebrary", "Category">;
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

export type AssetFile = {
  id: string;
  type: string;
};

export type SubjectInAsset = {
  subject: SubjectID;
  name: string;
};

export type Asset = Omit<LeemonsSchema, "id"> & {
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
  subjects?: SubjectInAsset[];
  coverFile?: string;
  tags?: string[];
};

export type Pin = {
  id: PinID;
  deploymentID: string;
  asset: AssetID | Asset;
  userAgent: UserAgentID;
};

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

export interface GenericAsset {
  id: AssetID;
  name: string;
  description?: string;
  cover?: string | AssetFile;
  tags?: string[];
  color?: string;
  file?: AssetFile | string;
  subjects?: SubjectInAsset[];
  program?: ProgramID;
  providerData?: Record<string, unknown>;
  fromUserAgent?: UserAgentID;
}
