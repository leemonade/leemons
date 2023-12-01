// automatic hash: a5440cbe7d5b6cd486798d3e2bcc1272f69a464dedd62284ff83fd6036e1b9e7
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    classes: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'id',
          'deploymentID',
          'program',
          'seats',
          'color',
          'isDeleted',
          '__v',
        ],
        properties: {
          id: {
            type: 'string',
            minLength: 1,
          },
          _id: {
            type: 'object',
            properties: {
              valueOf: {},
            },
            required: ['valueOf'],
          },
          deploymentID: {
            type: 'string',
            minLength: 1,
          },
          program: {
            type: 'string',
            minLength: 1,
          },
          seats: {
            type: 'number',
          },
          color: {
            type: 'string',
            minLength: 1,
          },
          isDeleted: {
            type: 'boolean',
          },
          deletedAt: {},
          createdAt: {
            type: 'object',
            properties: {},
            required: [],
          },
          updatedAt: {
            type: 'object',
            properties: {},
            required: [],
          },
          __v: {
            type: 'number',
          },
          image: {
            type: 'object',
            properties: {
              _id: {
                type: 'object',
                properties: {
                  valueOf: {},
                },
                required: ['valueOf'],
              },
              id: {
                type: 'string',
                minLength: 1,
              },
              deploymentID: {
                type: 'string',
                minLength: 1,
              },
              name: {
                type: 'string',
                minLength: 1,
              },
              fromUser: {
                type: 'string',
                minLength: 1,
              },
              fromUserAgent: {
                type: 'string',
                minLength: 1,
              },
              public: {
                type: 'boolean',
              },
              category: {
                type: 'string',
                minLength: 1,
              },
              indexable: {
                type: 'boolean',
              },
              isDeleted: {
                type: 'boolean',
              },
              deletedAt: {},
              createdAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              updatedAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              __v: {
                type: 'number',
              },
              subjects: {},
              permissions: {
                type: 'object',
                properties: {
                  viewer: {
                    type: 'array',
                    items: {
                      required: [],
                      properties: {},
                    },
                  },
                  editor: {
                    type: 'array',
                    items: {
                      required: [],
                      properties: {},
                    },
                  },
                  assigner: {
                    type: 'array',
                    items: {
                      required: [],
                      properties: {},
                    },
                  },
                },
                required: ['viewer', 'editor', 'assigner'],
              },
              duplicable: {
                type: 'boolean',
              },
              assignable: {},
              downloadable: {
                type: 'boolean',
              },
              providerData: {},
              tags: {
                type: 'array',
                items: {
                  required: [],
                  properties: {},
                },
              },
              pinned: {
                type: 'boolean',
              },
            },
            required: [
              '_id',
              'id',
              'deploymentID',
              'name',
              'fromUser',
              'fromUserAgent',
              'public',
              'category',
              'indexable',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
              'permissions',
              'duplicable',
              'downloadable',
              'tags',
              'pinned',
            ],
          },
          subject: {
            type: 'object',
            properties: {
              _id: {
                type: 'object',
                properties: {
                  valueOf: {},
                },
                required: ['valueOf'],
              },
              subject: {
                type: 'string',
                minLength: 1,
              },
              program: {
                type: 'string',
                minLength: 1,
              },
              deploymentID: {
                type: 'string',
                minLength: 1,
              },
              isDeleted: {
                type: 'boolean',
              },
              __v: {
                type: 'number',
              },
              createdAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              credits: {
                type: 'number',
              },
              deletedAt: {},
              id: {
                type: 'string',
                minLength: 1,
              },
              updatedAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              compiledInternalId: {
                type: 'string',
                minLength: 1,
              },
              internalId: {
                type: 'string',
                minLength: 1,
              },
              name: {
                type: 'string',
                minLength: 1,
              },
              icon: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'object',
                    properties: {
                      valueOf: {},
                    },
                    required: ['valueOf'],
                  },
                  id: {
                    type: 'string',
                    minLength: 1,
                  },
                  deploymentID: {
                    type: 'string',
                    minLength: 1,
                  },
                  name: {
                    type: 'string',
                    minLength: 1,
                  },
                  cover: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'object',
                        properties: {
                          valueOf: {},
                        },
                        required: ['valueOf'],
                      },
                      id: {
                        type: 'string',
                        minLength: 1,
                      },
                      deploymentID: {
                        type: 'string',
                        minLength: 1,
                      },
                      provider: {
                        type: 'string',
                        minLength: 1,
                      },
                      type: {
                        type: 'string',
                        minLength: 1,
                      },
                      extension: {
                        type: 'string',
                        minLength: 1,
                      },
                      name: {
                        type: 'string',
                        minLength: 1,
                      },
                      size: {
                        type: 'number',
                      },
                      uri: {
                        type: 'string',
                        minLength: 1,
                      },
                      metadata: {
                        type: 'string',
                        minLength: 1,
                      },
                      isDeleted: {
                        type: 'boolean',
                      },
                      deletedAt: {},
                      createdAt: {
                        type: 'object',
                        properties: {},
                        required: [],
                      },
                      updatedAt: {
                        type: 'object',
                        properties: {},
                        required: [],
                      },
                      __v: {
                        type: 'number',
                      },
                    },
                    required: [
                      '_id',
                      'id',
                      'deploymentID',
                      'provider',
                      'type',
                      'extension',
                      'name',
                      'size',
                      'uri',
                      'metadata',
                      'isDeleted',
                      'createdAt',
                      'updatedAt',
                      '__v',
                    ],
                  },
                  fromUser: {
                    type: 'string',
                    minLength: 1,
                  },
                  fromUserAgent: {
                    type: 'string',
                    minLength: 1,
                  },
                  public: {
                    type: 'boolean',
                  },
                  category: {
                    type: 'string',
                    minLength: 1,
                  },
                  indexable: {
                    type: 'boolean',
                  },
                  isDeleted: {
                    type: 'boolean',
                  },
                  deletedAt: {},
                  createdAt: {
                    type: 'object',
                    properties: {},
                    required: [],
                  },
                  updatedAt: {
                    type: 'object',
                    properties: {},
                    required: [],
                  },
                  __v: {
                    type: 'number',
                  },
                  subjects: {},
                  permissions: {
                    type: 'object',
                    properties: {
                      viewer: {
                        type: 'array',
                        items: {
                          required: [],
                          properties: {},
                        },
                      },
                      editor: {
                        type: 'array',
                        items: {
                          required: [],
                          properties: {},
                        },
                      },
                      assigner: {
                        type: 'array',
                        items: {
                          required: [],
                          properties: {},
                        },
                      },
                    },
                    required: ['viewer', 'editor', 'assigner'],
                  },
                  duplicable: {
                    type: 'boolean',
                  },
                  assignable: {},
                  downloadable: {
                    type: 'boolean',
                  },
                  providerData: {},
                  tags: {
                    type: 'array',
                    items: {
                      required: [],
                      properties: {},
                    },
                  },
                  pinned: {
                    type: 'boolean',
                  },
                },
                required: [
                  '_id',
                  'id',
                  'deploymentID',
                  'name',
                  'cover',
                  'fromUser',
                  'fromUserAgent',
                  'public',
                  'category',
                  'indexable',
                  'isDeleted',
                  'createdAt',
                  'updatedAt',
                  '__v',
                  'permissions',
                  'duplicable',
                  'downloadable',
                  'tags',
                  'pinned',
                ],
              },
              image: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'object',
                    properties: {
                      valueOf: {},
                    },
                    required: ['valueOf'],
                  },
                  id: {
                    type: 'string',
                    minLength: 1,
                  },
                  deploymentID: {
                    type: 'string',
                    minLength: 1,
                  },
                  name: {
                    type: 'string',
                    minLength: 1,
                  },
                  cover: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'object',
                        properties: {
                          valueOf: {},
                        },
                        required: ['valueOf'],
                      },
                      id: {
                        type: 'string',
                        minLength: 1,
                      },
                      deploymentID: {
                        type: 'string',
                        minLength: 1,
                      },
                      provider: {
                        type: 'string',
                        minLength: 1,
                      },
                      type: {
                        type: 'string',
                        minLength: 1,
                      },
                      extension: {
                        type: 'string',
                        minLength: 1,
                      },
                      name: {
                        type: 'string',
                        minLength: 1,
                      },
                      size: {
                        type: 'number',
                      },
                      uri: {
                        type: 'string',
                        minLength: 1,
                      },
                      metadata: {
                        type: 'string',
                        minLength: 1,
                      },
                      isDeleted: {
                        type: 'boolean',
                      },
                      deletedAt: {},
                      createdAt: {
                        type: 'object',
                        properties: {},
                        required: [],
                      },
                      updatedAt: {
                        type: 'object',
                        properties: {},
                        required: [],
                      },
                      __v: {
                        type: 'number',
                      },
                    },
                    required: [
                      '_id',
                      'id',
                      'deploymentID',
                      'provider',
                      'type',
                      'extension',
                      'name',
                      'size',
                      'uri',
                      'metadata',
                      'isDeleted',
                      'createdAt',
                      'updatedAt',
                      '__v',
                    ],
                  },
                  fromUser: {
                    type: 'string',
                    minLength: 1,
                  },
                  fromUserAgent: {
                    type: 'string',
                    minLength: 1,
                  },
                  public: {
                    type: 'boolean',
                  },
                  category: {
                    type: 'string',
                    minLength: 1,
                  },
                  indexable: {
                    type: 'boolean',
                  },
                  isDeleted: {
                    type: 'boolean',
                  },
                  deletedAt: {},
                  createdAt: {
                    type: 'object',
                    properties: {},
                    required: [],
                  },
                  updatedAt: {
                    type: 'object',
                    properties: {},
                    required: [],
                  },
                  __v: {
                    type: 'number',
                  },
                  subjects: {},
                  permissions: {
                    type: 'object',
                    properties: {
                      viewer: {
                        type: 'array',
                        items: {
                          required: [],
                          properties: {},
                        },
                      },
                      editor: {
                        type: 'array',
                        items: {
                          required: [],
                          properties: {},
                        },
                      },
                      assigner: {
                        type: 'array',
                        items: {
                          required: [],
                          properties: {},
                        },
                      },
                    },
                    required: ['viewer', 'editor', 'assigner'],
                  },
                  duplicable: {
                    type: 'boolean',
                  },
                  assignable: {},
                  downloadable: {
                    type: 'boolean',
                  },
                  providerData: {},
                  tags: {
                    type: 'array',
                    items: {
                      required: [],
                      properties: {},
                    },
                  },
                  pinned: {
                    type: 'boolean',
                  },
                },
                required: [
                  '_id',
                  'id',
                  'deploymentID',
                  'name',
                  'cover',
                  'fromUser',
                  'fromUserAgent',
                  'public',
                  'category',
                  'indexable',
                  'isDeleted',
                  'createdAt',
                  'updatedAt',
                  '__v',
                  'permissions',
                  'duplicable',
                  'downloadable',
                  'tags',
                  'pinned',
                ],
              },
              color: {
                type: 'string',
                minLength: 1,
              },
            },
            required: [
              '_id',
              'subject',
              'program',
              'deploymentID',
              'isDeleted',
              '__v',
              'createdAt',
              'credits',
              'id',
              'updatedAt',
              'compiledInternalId',
              'internalId',
              'name',
              'icon',
              'image',
              'color',
            ],
          },
          subjectType: {
            type: 'object',
            properties: {
              _id: {
                type: 'object',
                properties: {
                  valueOf: {},
                },
                required: ['valueOf'],
              },
              id: {
                type: 'string',
                minLength: 1,
              },
              deploymentID: {
                type: 'string',
                minLength: 1,
              },
              name: {
                type: 'string',
                minLength: 1,
              },
              groupVisibility: {
                type: 'boolean',
              },
              program: {
                type: 'string',
                minLength: 1,
              },
              credits_program: {
                type: 'number',
              },
              isDeleted: {
                type: 'boolean',
              },
              deletedAt: {},
              createdAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              updatedAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              __v: {
                type: 'number',
              },
            },
            required: [
              '_id',
              'id',
              'deploymentID',
              'name',
              'groupVisibility',
              'program',
              'credits_program',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
            ],
          },
          classes: {},
          parentClass: {},
          knowledges: {
            type: 'object',
            properties: {
              _id: {
                type: 'object',
                properties: {
                  valueOf: {},
                },
                required: ['valueOf'],
              },
              id: {
                type: 'string',
                minLength: 1,
              },
              deploymentID: {
                type: 'string',
                minLength: 1,
              },
              name: {
                type: 'string',
                minLength: 1,
              },
              abbreviation: {
                type: 'string',
                minLength: 1,
              },
              color: {
                type: 'string',
                minLength: 1,
              },
              icon: {
                type: 'string',
                minLength: 1,
              },
              program: {
                type: 'string',
                minLength: 1,
              },
              credits_program: {},
              isDeleted: {
                type: 'boolean',
              },
              deletedAt: {},
              createdAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              updatedAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              __v: {
                type: 'number',
              },
            },
            required: [
              '_id',
              'id',
              'deploymentID',
              'name',
              'abbreviation',
              'color',
              'icon',
              'program',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
            ],
          },
          substages: {
            type: 'array',
            items: {
              required: [],
              properties: {},
            },
          },
          courses: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              required: [
                'id',
                'deploymentID',
                'name',
                'index',
                'program',
                'type',
                'number',
                'isDeleted',
                '__v',
              ],
              properties: {
                _id: {
                  type: 'object',
                  properties: {
                    valueOf: {},
                  },
                  required: ['valueOf'],
                },
                id: {
                  type: 'string',
                  minLength: 1,
                },
                deploymentID: {
                  type: 'string',
                  minLength: 1,
                },
                name: {
                  type: 'string',
                  minLength: 1,
                },
                index: {
                  type: 'number',
                },
                program: {
                  type: 'string',
                  minLength: 1,
                },
                type: {
                  type: 'string',
                  minLength: 1,
                },
                number: {
                  type: 'number',
                },
                isDeleted: {
                  type: 'boolean',
                },
                deletedAt: {},
                createdAt: {
                  type: 'object',
                  properties: {},
                  required: [],
                },
                updatedAt: {
                  type: 'object',
                  properties: {},
                  required: [],
                },
                __v: {
                  type: 'number',
                },
              },
            },
          },
          groups: {
            type: 'object',
            properties: {
              _id: {
                type: 'object',
                properties: {
                  valueOf: {},
                },
                required: ['valueOf'],
              },
              id: {
                type: 'string',
                minLength: 1,
              },
              deploymentID: {
                type: 'string',
                minLength: 1,
              },
              name: {
                type: 'string',
                minLength: 1,
              },
              abbreviation: {
                type: 'string',
                minLength: 1,
              },
              index: {
                type: 'number',
              },
              program: {
                type: 'string',
                minLength: 1,
              },
              type: {
                type: 'string',
                minLength: 1,
              },
              isDeleted: {
                type: 'boolean',
              },
              deletedAt: {},
              createdAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              updatedAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              __v: {
                type: 'number',
              },
            },
            required: [
              '_id',
              'id',
              'deploymentID',
              'name',
              'abbreviation',
              'index',
              'program',
              'type',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
            ],
          },
          students: {
            type: 'array',
            items: {
              required: [],
              properties: {},
            },
          },
          parentStudents: {
            type: 'array',
            items: {
              required: [],
              properties: {},
            },
          },
          schedule: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              required: [
                'id',
                'deploymentID',
                'class',
                'day',
                'dayWeek',
                'start',
                'end',
                'duration',
                'isDeleted',
                '__v',
              ],
              properties: {
                _id: {
                  type: 'object',
                  properties: {
                    valueOf: {},
                  },
                  required: ['valueOf'],
                },
                id: {
                  type: 'string',
                  minLength: 1,
                },
                deploymentID: {
                  type: 'string',
                  minLength: 1,
                },
                class: {
                  type: 'string',
                  minLength: 1,
                },
                day: {
                  type: 'string',
                  minLength: 1,
                },
                dayWeek: {
                  type: 'number',
                },
                start: {
                  type: 'string',
                  minLength: 1,
                },
                end: {
                  type: 'string',
                  minLength: 1,
                },
                duration: {
                  type: 'number',
                },
                isDeleted: {
                  type: 'boolean',
                },
                deletedAt: {},
                createdAt: {
                  type: 'object',
                  properties: {},
                  required: [],
                },
                updatedAt: {
                  type: 'object',
                  properties: {},
                  required: [],
                },
                __v: {
                  type: 'number',
                },
              },
            },
          },
          teachers: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              required: ['teacher', 'type'],
              properties: {
                teacher: {
                  type: 'string',
                  minLength: 1,
                },
                type: {
                  type: 'string',
                  minLength: 1,
                },
              },
            },
          },
        },
      },
    },
  },
  required: ['status', 'classes'],
};

module.exports = { schema };
