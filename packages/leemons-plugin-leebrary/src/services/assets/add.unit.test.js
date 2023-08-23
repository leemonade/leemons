const { beforeAll, afterAll } = require('@jest/globals');
const {
    handleBookmarkData,
    handleUserSessionData,
    handleCategoryData,
    handleCanUseData,
    checkCategoryPermission,
    handleFileUpload,
    handleVersionCreation,
    createAssetInDB,
    handleSubjects,
    handlePermissions,
    handleFiles,
    handleBookmarkCreation,
    handleTags,
    add
} = require('./add');

const MOCK_DATA = {
    CATEGORY: {
        id: "13ce91bb-9135-49d9-9030-9d2559c74198",
        key: "media-files",
        pluginOwner: "plugins.leebrary",
        creatable: 1,
        createUrl: null,
        duplicable: 1,
        provider: "leebrary",
        componentOwner: "plugins.leebrary",
        listCardComponent: null,
        listItemComponent: null,
        detailComponent: null,
        canUse: "*",
        order: 1,
        deleted: 0,
    }
};

const leemons = {};

global.leemons = leemons;

beforeAll(() => {

})

afterAll(() => {
    jest.restoreAllMocks();
});

describe('Add Asset', () => {
    describe('handleBookmarkData', () => {
        it('should handle bookmark data correctly', async () => {
            // Arrange
            const data = {
                categoryKey: '',
                url: '',
                icon: '',
                name: '',
                description: '',
                cover: '',
            };
            const cover = '';
            const expectedValue = {}; // Define your expected value here

            // Act
            const result = await handleBookmarkData(data, cover);

            // Assert
            expect(result).toEqual(expectedValue);
        });
    });

    describe('handleUserSessionData', () => {
        it('should handle user session data correctly', () => {
            // Arrange
            const assetData = {};
            const userSession = {};
            const expectedValue = {}; // Define your expected value here

            // Act
            const result = handleUserSessionData(assetData, userSession);

            // Assert
            expect(result).toEqual(expectedValue);
        });
    });

    describe('handleCategoryData', () => {
        it('should handle category data correctly', async () => {
            // Arrange
            const category = MOCK_DATA.CATEGORY;
            const categoryId = '';
            const categoryKey = '';
            const expectedValue = {}; // Define your expected value here

            // Act
            const result = await handleCategoryData(category, categoryId, categoryKey);

            // Assert
            expect(result).toEqual(expectedValue);
        });
    });

    describe('handleCanUseData', () => {
        it('should handle can use data correctly', async () => {
            // Arrange
            const canUseData = {};
            const category = {};
            const expectedValue = {}; // Define your expected value here

            // Act
            const result = handleCanUseData(canUseData, category);

            // Assert
            expect(result).toEqual(expectedValue);
        });
    });

    describe('checkCategoryPermission', () => {
        it('should check category permission correctly', async () => {
            // Arrange
            const category = {};
            const canUse = [];
            const calledFrom = '';

            // Act
            const result = checkCategoryPermission(category, canUse, calledFrom);

            // Assert
            expect(result).toThrow();

        });
    });

    describe('handleFileUpload', () => {
        it('should handle file upload correctly', async () => {
            // Arrange
            const file = '';
            const cover = '';
            const assetName = '';
            const expectedValue = {
                newFile: {}, // or null
                coverFile: {} // or null
            };

            // Act
            const result = await handleFileUpload(file, cover, assetName);

            // Assert
            expect(result).toEqual(expectedValue);
        });
    });

    describe('handleVersionCreation', () => {
        it('should handle version creation correctly', async () => {
            // Arrange
            const newId = '';
            const categoryId = '';
            const published = true;
            const expectedValue = ''; // The new ID of the asset

            // Act
            const result = await handleVersionCreation(newId, categoryId, published);

            // Assert
            expect(result).toEqual(expectedValue);
        });
    });

    describe('createAssetInDB', () => {
        it('should create asset in DB correctly', async () => {
            // Arrange
            const newId = '';
            const categoryId = '';
            const coverId = '';
            const asset = {};
            const expectedValue = {}; // Asset to be created in DB

            // Act
            const result = await createAssetInDB(newId, categoryId, coverId, asset);

            // Assert
            // Add your assertions
        });
    });

    describe('handleSubjects', () => {
        it('should handle subjects correctly', async () => {
            // Arrange
            const subjects = [];
            const assetId = '';
            const expectedValue = {}; // Subjects to be created in DB

            // Act
            const result = await handleSubjects(subjects, assetId);

            // Assert
            // Add your assertions
        });
    });

    describe('handlePermissions', () => {
        it('should handle permissions correctly', async () => {
            // Arrange
            const permissions = [];
            const assetId = '';
            const categoryId = '';
            const canAccess = [];
            const userSession = {};
            const expectedValue = {}; // Permissions to be created in DB

            // Act
            const result = await handlePermissions(permissions, assetId, categoryId, canAccess, userSession);

            // Assert
            // Add your assertions
        });
    });

    describe('handleFiles', () => {
        it('should handle files correctly', async () => {
            // Arrange
            const newFile = '';
            const assetId = '';
            const userSession = {};
            const expectedValue = {}; // Define your expected value here

            // Act
            const result = await handleFiles(newFile, assetId, userSession);

            // Assert
            // Add your assertions
        });
    });

    describe('handleBookmarkCreation', () => {
        it('should handle bookmark creation correctly', async () => {
            // Arrange
            const duplicating = false;
            const categoryKey = '';
            const asset = {};
            const newAsset = {};
            const expectedValue = {}; // Define your expected value here

            // Act
            const result = await handleBookmarkCreation(duplicating, categoryKey, asset, newAsset);

            // Assert
            // Add your assertions
        });
    });

    describe('handleTags', () => {
        it('should handle tags correctly', async () => {
            // Arrange
            const tags = [];
            const assetId = '';
            const expectedValue = {}; // Define your expected value here

            // Act
            const result = await handleTags(tags, assetId);

            // Assert
            // Add your assertions
        });
    });


    describe('add', () => {
        it('should add an asset correctly', async () => {
            // Arrange
            const assetData = {
                file: "87cc62db-ad40-484c-86da-c3392841c3f1",
                name: "Logo de F1 in Schools",
                tagline: "Soy un subtítulo",
                description: "Soy una descripción",
                color: "#668fcc",
                url: null,
                program: null,
                subjects: null,
                category: MOCK_DATA.CATEGORY,
                categoryId: MOCK_DATA.CATEGORY.id,
                cover: undefined,
                tags: [
                    "logo",
                ],
            }; // Add your test data
            const options = {
                published: true,
                permissions: [],
                duplicating: false,
            }; // Add your test options
            const expectedValue = {
                name: "Logo de F1 in Schools",
                tagline: "Soy un subtítulo",
                description: "Soy una descripción",
                color: "#668fcc",
                program: null,
                fromUser: "0a8d2aab-ce31-43f8-8db2-1e0780666a38",
                fromUserAgent: "78c223d9-0c58-413d-86dd-f6d44a367588",
                indexable: 1,
                category: MOCK_DATA.CATEGORY.id,
                cover: "df7e9435-9216-424a-a580-4acb82204d07",
                id: "7e85a377-7af6-4f54-957e-3292d94ef1f7@1.0.0",
                updated_at: "2023-08-23T15:25:49.000Z",
                created_at: "2023-08-23T15:25:49.000Z",
                public: null,
                center: null,
                deleted: 0,
                deleted_at: null,
                file: {
                    id: "df7e9435-9216-424a-a580-4acb82204d07",
                    provider: "leebrary-aws-s3",
                    type: "image/png",
                    extension: "png",
                    name: "Logo de F1 in Schools",
                    size: 118955,
                    uri: "leemons/leebrary/df7e9435-9216-424a-a580-4acb82204d07.png",
                    isFolder: null,
                    metadata: {
                        size: "116.2 KB",
                        format: "PNG",
                        width: "2134",
                        height: "202",
                    },
                    deleted: 0,
                    created_at: "2023-08-23T15:25:47.000Z",
                    updated_at: "2023-08-23T15:25:49.000Z",
                    deleted_at: null,
                },
                cover: {
                    id: "df7e9435-9216-424a-a580-4acb82204d07",
                    provider: "leebrary-aws-s3",
                    type: "image/png",
                    extension: "png",
                    name: "Logo de F1 in Schools",
                    size: 118955,
                    uri: "leemons/leebrary/df7e9435-9216-424a-a580-4acb82204d07.png",
                    isFolder: null,
                    metadata: {
                        size: "116.2 KB",
                        format: "PNG",
                        width: "2134",
                        height: "202",
                    },
                    deleted: 0,
                    created_at: "2023-08-23T15:25:47.000Z",
                    updated_at: "2023-08-23T15:25:49.000Z",
                    deleted_at: null,
                },
                tags: [
                    "logo",
                ]
            }; // Define your expected value here

            // Act
            const result = await add(assetData, options);

            // Assert
            expect(result).toEqual(expectedValue);
        });
    });
});