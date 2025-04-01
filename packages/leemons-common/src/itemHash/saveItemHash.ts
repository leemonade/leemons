import { Model } from '@leemons/mongodb';
import { getItemHashKey } from './getItemHashKey';
import { HashPerItem } from './getItemsHashByKey';

interface SaveItemHashParams {
  KeyValuesModel: Model<any>;
  hashPerItem: HashPerItem;
  documentKey: string;
  forceReload?: boolean;
}

interface HashDocument {
  key: string;
  value: {
    [key: string]: {
      [hash: string]: boolean;
    };
  };
}

/**
 * Saves the hash for each email template in the database.
 * If the hash document does not exist, it creates a new document with the hash for each template.
 * If the hash document exists, it updates the document with the new hash for each template.
 */
export async function saveItemHash({
  KeyValuesModel,
  hashPerItem,
  documentKey,
  forceReload,
}: SaveItemHashParams): Promise<void> {
  const itemsKeys = Object.keys(hashPerItem);
  const hashDocumentExists = await KeyValuesModel.countDocuments({
    key: documentKey,
  });

  if (!hashDocumentExists) {
    const value: HashDocument['value'] = {};

    itemsKeys.forEach((itemKey) => {
      value[itemKey] = { [hashPerItem[itemKey]]: true };
    });

    await KeyValuesModel.create({
      key: documentKey,
      value,
    });
  } else {
    const $set: Record<string, any> = {};

    if (forceReload) {
      itemsKeys.forEach((itemKey) => {
        $set[`value.${itemKey}`] = { [hashPerItem[itemKey]]: true };
      });
    } else {
      const hashesKeys = itemsKeys.map((itemKey) =>
        getItemHashKey({ key: itemKey, hash: hashPerItem[itemKey] })
      );
      hashesKeys.forEach((key) => {
        $set[key] = true;
      });
    }

    await KeyValuesModel.updateOne(
      { key: documentKey },
      {
        $set,
      }
    );
  }
}
