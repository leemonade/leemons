// automatic hash: fdf7f5b5c26ed7e76ff58394922b2d36c4e2f3f3ce7a89446394079f642659a6
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    questionBank: {
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
        program: {
          type: 'string',
          minLength: 1,
        },
        published: {
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
        asset: {
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
            tagline: {
              type: 'string',
              minLength: 1,
            },
            color: {
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
              },
              required: ['viewer', 'editor'],
            },
            duplicable: {
              type: 'boolean',
            },
            assignable: {},
            downloadable: {
              type: 'boolean',
            },
            providerData: {
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
                program: {
                  type: 'string',
                  minLength: 1,
                },
                published: {
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
                asset: {
                  type: 'string',
                  minLength: 1,
                },
                tags: {
                  type: 'array',
                  items: {
                    required: [],
                    properties: {},
                  },
                },
                categories: {
                  type: 'array',
                  uniqueItems: true,
                  minItems: 1,
                  items: {
                    required: ['value', 'id'],
                    properties: {
                      value: {
                        type: 'string',
                        minLength: 1,
                      },
                      id: {
                        type: 'string',
                        minLength: 1,
                      },
                    },
                  },
                },
                subjects: {
                  type: 'array',
                  items: {
                    required: [],
                    properties: {},
                  },
                },
                questions: {
                  type: 'array',
                  uniqueItems: true,
                  minItems: 1,
                  items: {
                    required: [
                      'id',
                      'deploymentID',
                      'questionBank',
                      'type',
                      'withImages',
                      'level',
                      'question',
                      'category',
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
                      questionBank: {
                        type: 'string',
                        minLength: 1,
                      },
                      type: {
                        type: 'string',
                        minLength: 1,
                      },
                      withImages: {
                        type: 'boolean',
                      },
                      level: {
                        type: 'string',
                        minLength: 1,
                      },
                      question: {
                        type: 'string',
                        minLength: 1,
                      },
                      questionImage: {
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
                            },
                            required: ['viewer', 'editor'],
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
                      clues: {
                        type: 'array',
                        uniqueItems: true,
                        minItems: 1,
                        items: {
                          required: ['value'],
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                        },
                      },
                      category: {
                        type: 'string',
                        minLength: 1,
                      },
                      properties: {
                        type: 'object',
                        properties: {
                          explanationInResponses: {
                            type: 'boolean',
                          },
                          explanation: {
                            type: 'string',
                            minLength: 1,
                          },
                          responses: {
                            type: 'array',
                            uniqueItems: true,
                            minItems: 1,
                            items: {
                              required: [],
                              properties: {
                                value: {
                                  type: 'object',
                                  properties: {
                                    explanation: {
                                      type: 'string',
                                      minLength: 1,
                                    },
                                    isCorrectResponse: {
                                      type: 'boolean',
                                    },
                                    hideOnHelp: {
                                      type: 'boolean',
                                    },
                                    response: {
                                      type: 'string',
                                      minLength: 1,
                                    },
                                  },
                                  required: [
                                    'explanation',
                                    'isCorrectResponse',
                                    'hideOnHelp',
                                    'response',
                                  ],
                                },
                              },
                            },
                          },
                        },
                        required: [
                          'explanationInResponses',
                          'explanation',
                          'responses',
                        ],
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
                      tags: {
                        type: 'array',
                        items: {
                          required: [],
                          properties: {},
                        },
                      },
                      questionImageDescription: {},
                    },
                  },
                },
              },
              required: [
                '_id',
                'id',
                'deploymentID',
                'name',
                'program',
                'published',
                'isDeleted',
                'createdAt',
                'updatedAt',
                '__v',
                'asset',
                'tags',
                'categories',
                'subjects',
                'questions',
              ],
            },
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
            'tagline',
            'color',
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
            'providerData',
            'tags',
            'pinned',
          ],
        },
        tags: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        tagline: {
          type: 'string',
          minLength: 1,
        },
        description: {},
        color: {
          type: 'string',
          minLength: 1,
        },
        file: {},
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
        categories: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: ['value', 'id'],
            properties: {
              value: {
                type: 'string',
                minLength: 1,
              },
              id: {
                type: 'string',
                minLength: 1,
              },
            },
          },
        },
        subjects: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        questions: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: [
              'id',
              'deploymentID',
              'questionBank',
              'type',
              'withImages',
              'level',
              'question',
              'category',
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
              questionBank: {
                type: 'string',
                minLength: 1,
              },
              type: {
                type: 'string',
                minLength: 1,
              },
              withImages: {
                type: 'boolean',
              },
              level: {
                type: 'string',
                minLength: 1,
              },
              question: {
                type: 'string',
                minLength: 1,
              },
              questionImage: {
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
                    },
                    required: ['viewer', 'editor'],
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
              clues: {
                type: 'array',
                uniqueItems: true,
                minItems: 1,
                items: {
                  required: ['value'],
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                },
              },
              category: {
                type: 'string',
                minLength: 1,
              },
              properties: {
                type: 'object',
                properties: {
                  explanationInResponses: {
                    type: 'boolean',
                  },
                  explanation: {
                    type: 'string',
                    minLength: 1,
                  },
                  responses: {
                    type: 'array',
                    uniqueItems: true,
                    minItems: 1,
                    items: {
                      required: [],
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            explanation: {
                              type: 'string',
                              minLength: 1,
                            },
                            isCorrectResponse: {
                              type: 'boolean',
                            },
                            hideOnHelp: {
                              type: 'boolean',
                            },
                            response: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'explanation',
                            'isCorrectResponse',
                            'hideOnHelp',
                            'response',
                          ],
                        },
                      },
                    },
                  },
                },
                required: [
                  'explanationInResponses',
                  'explanation',
                  'responses',
                ],
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
              tags: {
                type: 'array',
                items: {
                  required: [],
                  properties: {},
                },
              },
              questionImageDescription: {},
            },
          },
        },
      },
      required: [
        '_id',
        'id',
        'deploymentID',
        'name',
        'program',
        'published',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
        'asset',
        'tags',
        'tagline',
        'color',
        'cover',
        'categories',
        'subjects',
        'questions',
      ],
    },
  },
  required: ['status', 'questionBank'],
};

module.exports = { schema };
