const _ = require('lodash');
const { validateSavePackage, savePackageSchema } = require('../../validations/forms');

/**
 * Saves a package.
 * @param {Object} scormData - The data of the SCORM package.
 * @param {Object} options - Additional options for saving the package.
 * @param {Object} options.userSession - The user session. Required.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} - The saved package.
 * @throws {Error} - If the user session is not provided.
 */
async function savePackage(scormData, { userSession, transacting } = {}) {
  const data = _.cloneDeep(scormData);
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;

  // Check is userSession is provided
  if (!userSession) throw new Error('User session is required (savePackage)');

  // Clean data to allowed properties
  if (!savePackageSchema.additionalProperties) {
    const allowedProps = Object.keys(savePackageSchema.properties);
    Object.keys(data).forEach((key) => {
      if (!allowedProps.includes(key)) delete data[key];
    });
  }

  // Validate the cleaned data
  validateSavePackage(data);

  const isEditing = !!data.id;

  // Prepare the data to be saved
  const toSave = {
    asset: {
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      color: data.color,
      cover: data.cover?.id ? data.cover.id : data.cover,
      tags: data.tags,
      indexable: true,
      public: true, // TODO Cambiar a false despues de la demo
    },
    role: 'scorm',
    statement: '',
    subjects: _.map(data.subjects, ({ level, subject }) => ({
      level,
      subject,
      program: data.program,
    })),
    gradable: data.gradable || false,
    metadata: {
      ...data?.metadata,
      version: data.version,
      launchUrl: data.launchUrl,
      packageAsset: data.packageAsset,
    },
  };

  // ------------------------------------------------------------------------
  // SCORM PACKAGE ASSET

  // Prepare the package asset properties
  const packageAssetProps = {
    name: `${data.name} [Scorm file]`,
    file: data.file,
    description: '',
    indexable: false,
    public: true,
  };

  let packageAsset = null;

  // Check if it is an editing scenario and both file and packageAsset are present
  if (isEditing && data.file && data.packageAsset) {
    // Update the existing package asset
    packageAsset = await leemons.getPlugin('leebrary').services.assets.update(
      {
        ...packageAssetProps,
        id: data.packageAsset,
      },
      {
        published: data.published,
        userSession,
        transacting,
      }
    );
  } else if (data.file) {
    // Create a new package asset
    packageAsset = await leemons.getPlugin('leebrary').services.assets.add(packageAssetProps, {
      published: data.published,
      userSession,
      transacting,
    });
  }

  // Assign the package asset ID to the metadata
  toSave.metadata.packageAsset = packageAsset?.id;

  // ------------------------------------------------------------------------
  // ASSIGNABLE

  let assignable = null;

  if (isEditing) {
    // In editing scenario, update the existing assignable
    delete toSave.role;
    assignable = await assignableService.updateAssignable(
      { id: data.id, ...toSave },
      {
        userSession,
        transacting,
        published: data.published,
      }
    );
  } else {
    assignable = await assignableService.createAssignable(toSave, {
      userSession,
      transacting,
      published: data.published,
    });
  }

  return assignable;
}

module.exports = savePackage;
