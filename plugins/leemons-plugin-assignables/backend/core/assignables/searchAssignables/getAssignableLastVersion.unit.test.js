const { it, expect, beforeEach } = require('@jest/globals');
const { getAssignableLastVersion } = require('./getAssignableLastVersion');

describe('getAssignableLastVersion', () => {
  let groupedAssignables;

  beforeEach(() => {
    groupedAssignables = {
      uuid1: [
        { uuid: 'uuid1', version: '1.0.0', fullId: 'id1@1.0.0' },
        { uuid: 'uuid1', version: '2.0.0', fullId: 'id1@2.0.0' },
      ],
      uuid2: [
        { uuid: 'uuid2', version: '1.0.0', fullId: 'id2@1.0.0' },
        { uuid: 'uuid2', version: '3.0.0', fullId: 'id2@3.0.0' },
      ],
    };
  });

  it('Should return the latest version for each group', () => {
    // Arrange
    const expected = ['id1@2.0.0', 'id2@3.0.0'];

    // Act
    const result = getAssignableLastVersion(groupedAssignables);

    // Assert
    expect(result).toEqual(expected);
  });
});
