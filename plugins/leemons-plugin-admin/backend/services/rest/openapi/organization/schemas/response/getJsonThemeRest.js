// automatic hash: 7d6537d2e61d203d4203a6e23b2e4401debec123ca2399f067ca3c383a595715
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    jsonTheme: {
      type: 'object',
      properties: {
        button: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default--reverse',
                      ],
                    },
                    secondary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default--reverse',
                      ],
                    },
                    ghost: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default'],
                    },
                    terciary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default--reverse',
                      ],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                  },
                  required: [
                    'primary',
                    'secondary',
                    'ghost',
                    'terciary',
                    'phatic',
                  ],
                },
                default: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                hover: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'default', 'hover', 'typo'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        selected: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        pressed: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'selected',
                        'pressed',
                        'down',
                      ],
                    },
                    secondary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        pressed: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'pressed', 'down'],
                    },
                    ghost: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        pressed: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'pressed'],
                    },
                    terciary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                  },
                  required: [
                    'primary',
                    'secondary',
                    'ghost',
                    'terciary',
                    'phatic',
                  ],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    secondary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        pressed: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'pressed', 'down'],
                    },
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                    terciary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default--reverse',
                      ],
                    },
                  },
                  required: ['secondary', 'primary', 'terciary', 'phatic'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    rounded: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md', 'rounded'],
                },
              },
              required: ['color', 'width', 'radius'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    vertical: {
                      type: 'object',
                      properties: {
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['md', 'sm'],
                    },
                    horizontal: {
                      type: 'object',
                      properties: {
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        xs: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['sm', 'xs', 'md'],
                    },
                  },
                  required: ['vertical', 'horizontal'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
            shadow: {
              type: 'object',
              properties: {
                hover: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        x: {
                          type: 'number',
                        },
                        y: {
                          type: 'number',
                        },
                        blur: {
                          type: 'number',
                        },
                        spread: {
                          type: 'number',
                        },
                        color: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['x', 'y', 'blur', 'spread', 'color', 'type'],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                pressed: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        x: {
                          type: 'number',
                        },
                        y: {
                          type: 'number',
                        },
                        blur: {
                          type: 'number',
                        },
                        spread: {
                          type: 'number',
                        },
                        color: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['x', 'y', 'blur', 'spread', 'color', 'type'],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['hover', 'pressed'],
            },
            textDecoration: {
              type: 'object',
              properties: {
                underLine: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['underLine'],
            },
          },
          required: [
            'content',
            'background',
            'border',
            'spacing',
            'shadow',
            'textDecoration',
          ],
        },
        dropzone: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                text: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'text--medium': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--subtle': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    icon: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--icon': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    'default',
                    'default--subtle',
                    'icon',
                    'hover',
                    'default--icon',
                  ],
                },
              },
              required: ['text', 'text--medium', 'color'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'radius', 'width'],
            },
          },
          required: ['content', 'spacing', 'background', 'border'],
        },
        toggle: {
          type: 'object',
          properties: {
            shadow: {
              type: 'object',
              properties: {
                hover: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        x: {
                          type: 'number',
                        },
                        y: {
                          type: 'number',
                        },
                        blur: {
                          type: 'number',
                        },
                        spread: {
                          type: 'number',
                        },
                        color: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['x', 'y', 'blur', 'spread', 'color', 'type'],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['hover'],
            },
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    label: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'selected', 'label', 'hover'],
                },
              },
              required: ['typo', 'color'],
            },
            border: {
              type: 'object',
              properties: {
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    select: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'select'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['width', 'color', 'radius'],
            },
            size: {
              type: 'object',
              properties: {
                inner: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['inner', 'width'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    unselected: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover'],
                    },
                  },
                  required: ['default', 'unselected', 'selected'],
                },
              },
              required: ['color'],
            },
          },
          required: [
            'shadow',
            'content',
            'border',
            'size',
            'spacing',
            'background',
          ],
        },
        buttonText: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                    secondary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                    terciary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                  },
                  required: ['primary', 'secondary', 'terciary', 'phatic'],
                },
                default: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                        textDecoration: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                        'textDecoration',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                hover: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                        textDecoration: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                        'textDecoration',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'default', 'hover', 'typo'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                    secondary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                    terciary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                  },
                  required: ['primary', 'secondary', 'terciary', 'phatic'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                    secondary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                    terciary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                  },
                  required: ['primary', 'secondary', 'terciary', 'phatic'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'radius', 'width'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    vertical: {
                      type: 'object',
                      properties: {
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['md', 'sm'],
                    },
                    horizontal: {
                      type: 'object',
                      properties: {
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        xs: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['md', 'sm', 'xs'],
                    },
                  },
                  required: ['vertical', 'horizontal'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
          },
          required: ['content', 'background', 'border', 'spacing'],
        },
        buttonIcon: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default--reverse',
                      ],
                    },
                    ghost: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default'],
                    },
                    secondary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default--reverse',
                      ],
                    },
                    terciary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default--reverse',
                      ],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'hover--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down', 'hover--reverse'],
                    },
                  },
                  required: [
                    'primary',
                    'ghost',
                    'secondary',
                    'terciary',
                    'phatic',
                  ],
                },
              },
              required: ['color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        pressed: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        selected: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        focus: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'hover--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'down--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'pressed',
                        'selected',
                        'focus',
                        'down',
                        'default--reverse',
                        'hover--reverse',
                        'down--reverse',
                      ],
                    },
                    ghost: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        pressed: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        selected: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        focus: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'pressed',
                        'selected',
                        'focus',
                      ],
                    },
                    secondary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'hover--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'down--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default--reverse',
                        'hover--reverse',
                        'down--reverse',
                      ],
                    },
                    terciary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default-reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'hover-reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'down-reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default-reverse',
                        'hover-reverse',
                        'down-reverse',
                      ],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'hover--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'down--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default--reverse',
                        'hover--reverse',
                        'down--reverse',
                      ],
                    },
                  },
                  required: [
                    'primary',
                    'ghost',
                    'secondary',
                    'terciary',
                    'phatic',
                  ],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    rounded: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md', 'rounded'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'hover--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'down--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default--reverse',
                        'hover--reverse',
                        'down--reverse',
                      ],
                    },
                    secondary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default-reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'hover-reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'down-reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default-reverse',
                        'hover-reverse',
                        'down-reverse',
                      ],
                    },
                    terciary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default-reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'hover--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'down--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default-reverse',
                        'hover--reverse',
                        'down--reverse',
                      ],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'hover--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'down--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default--reverse',
                        'hover--reverse',
                        'down--reverse',
                      ],
                    },
                  },
                  required: ['primary', 'secondary', 'terciary', 'phatic'],
                },
              },
              required: ['radius', 'width', 'color'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md'],
                },
              },
              required: ['padding'],
            },
            shadow: {
              type: 'object',
              properties: {
                hover: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        x: {
                          type: 'number',
                        },
                        y: {
                          type: 'number',
                        },
                        blur: {
                          type: 'number',
                        },
                        spread: {
                          type: 'number',
                        },
                        color: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['x', 'y', 'blur', 'spread', 'color', 'type'],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['hover'],
            },
          },
          required: ['content', 'background', 'border', 'spacing', 'shadow'],
        },
        buttonAction: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'hover--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'down--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default--reverse',
                        'hover--reverse',
                        'down--reverse',
                      ],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                  },
                  required: ['primary', 'phatic'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'typo'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        pressed: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'hover--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'hover--reverse-transparent': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                            $extensions: {
                              type: 'object',
                              properties: {
                                'studio.tokens': {
                                  type: 'object',
                                  properties: {
                                    modify: {
                                      type: 'object',
                                      properties: {
                                        type: {
                                          type: 'string',
                                          minLength: 1,
                                        },
                                        value: {
                                          type: 'string',
                                          minLength: 1,
                                        },
                                        space: {
                                          type: 'string',
                                          minLength: 1,
                                        },
                                      },
                                      required: ['type', 'value', 'space'],
                                    },
                                  },
                                  required: ['modify'],
                                },
                              },
                              required: ['studio.tokens'],
                            },
                          },
                          required: ['value', 'type', '$extensions'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'down--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'pressed',
                        'hover--reverse',
                        'hover--reverse-transparent',
                        'down',
                        'down--reverse',
                      ],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                  },
                  required: ['primary', 'phatic'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    rounded: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md', 'rounded'],
                },
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'hover--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'down--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'hover--reverse',
                        'down--reverse',
                      ],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                  },
                  required: ['primary', 'phatic'],
                },
              },
              required: ['width', 'radius', 'color'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
          },
          required: ['content', 'background', 'border', 'spacing'],
        },
        input: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    placeholder: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    icon: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'icon--action': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    'default',
                    'placeholder',
                    'icon',
                    'icon--action',
                    'selected',
                  ],
                },
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'typo'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    subtle: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    negative: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'subtle', 'negative'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'radius', 'width'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    vertical: {
                      type: 'object',
                      properties: {
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        ssm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['md', 'ssm', 'sm'],
                    },
                    horizontal: {
                      type: 'object',
                      properties: {
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        xmsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['sm', 'md', 'xmsm'],
                    },
                    all: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['vertical', 'horizontal', 'all'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    none: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['none', 'sm', 'md', 'lg'],
                },
              },
              required: ['padding', 'gap'],
            },
          },
          required: ['content', 'background', 'border', 'spacing'],
        },
        label: {
          type: 'object',
          properties: {
            spacing: {
              type: 'object',
              properties: {
                gap: {
                  type: 'object',
                  properties: {
                    none: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['none', 'sm', 'md', 'lg'],
                },
              },
              required: ['gap'],
            },
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    subtle: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'subtle'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    '01': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '02': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '03': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['01', '02', '03'],
                },
                phatic: {
                  type: 'object',
                  properties: {
                    attention: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['attention'],
                },
              },
              required: ['color', 'typo', 'phatic'],
            },
          },
          required: ['spacing', 'content'],
        },
        helpText: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    emphasis: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'phatic--negative': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'phatic--attention': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    'default',
                    'emphasis',
                    'phatic--negative',
                    'phatic--attention',
                    'phatic',
                  ],
                },
                'typo-': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'fontSize',
                        'lineHeight',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'typo-', 'typo'],
            },
            spacing: {
              type: 'object',
              properties: {
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['gap'],
            },
          },
          required: ['content', 'spacing'],
        },
        radio: {
          type: 'object',
          properties: {
            size: {
              type: 'object',
              properties: {
                sm: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                md: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['sm', 'md'],
            },
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    label: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    icon: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['label', 'selected', 'default', 'icon', 'hover'],
                },
              },
              required: ['color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'selected--reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    'default',
                    'selected',
                    'default--reverse',
                    'selected--reverse',
                  ],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    error: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'selected', 'error', 'hover'],
                },
              },
              required: ['radius', 'width', 'color'],
            },
            spacing: {
              type: 'object',
              properties: {
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                paddings: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md', 'lg'],
                },
              },
              required: ['gap', 'paddings'],
            },
            shadow: {
              type: 'object',
              properties: {
                hover: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        x: {
                          type: 'number',
                        },
                        y: {
                          type: 'number',
                        },
                        blur: {
                          type: 'number',
                        },
                        spread: {
                          type: 'number',
                        },
                        color: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['x', 'y', 'blur', 'spread', 'color', 'type'],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['hover'],
            },
            label: {
              type: 'object',
              properties: {
                content: {
                  type: 'object',
                  properties: {
                    typo: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['typo'],
                },
              },
              required: ['content'],
            },
          },
          required: [
            'size',
            'content',
            'background',
            'border',
            'spacing',
            'shadow',
            'label',
          ],
        },
        checkbox: {
          type: 'object',
          properties: {
            shadow: {
              type: 'object',
              properties: {
                hover: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        x: {
                          type: 'number',
                        },
                        y: {
                          type: 'number',
                        },
                        blur: {
                          type: 'number',
                        },
                        spread: {
                          type: 'number',
                        },
                        color: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['x', 'y', 'blur', 'spread', 'color', 'type'],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['hover'],
            },
            size: {
              type: 'object',
              properties: {
                md: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['md'],
            },
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    label: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    icon: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'label', 'icon', 'selected'],
                },
              },
              required: ['color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    contrast: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'contrast', 'hover', 'selected'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    select: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    negative: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    'default',
                    'select',
                    'negative',
                    'hover',
                    'selected',
                  ],
                },
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'radius', 'width'],
            },
            spacing: {
              type: 'object',
              properties: {
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                paddings: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md', 'lg'],
                },
              },
              required: ['gap', 'paddings'],
            },
          },
          required: [
            'shadow',
            'size',
            'content',
            'background',
            'border',
            'spacing',
          ],
        },
        badge: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    caption: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'number',
                            },
                            textCase: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'fontSize',
                            'lineHeight',
                            'textCase',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'number',
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'sm--bold': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'md--bold': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['caption', 'sm', 'sm--bold', 'md', 'md--bold'],
                },
                color: {
                  type: 'object',
                  properties: {
                    'default--reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default--reverse', 'default'],
                },
              },
              required: ['typo', 'color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    neutral: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        white: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        grey: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'white',
                        'grey',
                        'default--reverse',
                      ],
                    },
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default'],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--warning': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'default--warning'],
                    },
                    info: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default'],
                    },
                    secondary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default'],
                    },
                  },
                  required: [
                    'neutral',
                    'primary',
                    'phatic',
                    'info',
                    'secondary',
                  ],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'md-radius': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    'default--reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    white: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    grey: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    'default--reverse',
                    'default',
                    'white',
                    'grey',
                    'hover',
                  ],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['radius', 'md-radius', 'color', 'width'],
            },
            size: {
              type: 'object',
              properties: {
                sm: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                md: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                lg: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                xlg: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                '2xlg': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['sm', 'md', 'lg', 'xlg', '2xlg'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    '3xsm': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['3xsm', 'md', 'lg', 'sm'],
                },
              },
              required: ['padding'],
            },
          },
          required: ['content', 'background', 'border', 'size', 'spacing'],
        },
        avatar: {
          type: 'object',
          properties: {
            size: {
              type: 'object',
              properties: {
                xsm: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                sm: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                md: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                xmd: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                lg: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                xlg: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['xsm', 'sm', 'md', 'xmd', 'lg', 'xlg'],
            },
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'number',
                            },
                            textCase: {
                              type: 'string',
                              minLength: 1,
                            },
                            lineHeight: {
                              type: 'number',
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'fontSize',
                            'textCase',
                            'lineHeight',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'number',
                            },
                            textCase: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'fontSize',
                            'textCase',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'number',
                            },
                            textCase: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'fontSize',
                            'textCase',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xlg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                            textCase: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'fontSize',
                            'textCase',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md', 'lg', 'xlg'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
              },
              required: ['typo', 'color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    10: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '01': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '02': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '03': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '04': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '05': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '06': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '07': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '08': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '09': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    '10',
                    '01',
                    '02',
                    '03',
                    '04',
                    '05',
                    '06',
                    '07',
                    '08',
                    '09',
                  ],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    circle: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['circle', 'md'],
                },
              },
              required: ['radius'],
            },
          },
          required: ['size', 'content', 'background', 'border'],
        },
        colorPicker: {
          type: 'object',
          properties: {
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    rounded: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md', 'rounded'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['radius', 'color', 'width'],
            },
            spacing: {
              type: 'object',
              properties: {
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                padding: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['gap', 'padding'],
            },
            size: {
              type: 'object',
              properties: {
                md: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['md'],
            },
          },
          required: ['background', 'border', 'spacing', 'size'],
        },
        calendar: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'sm--regular': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md', 'sm--regular', 'sm'],
                },
                color: {
                  type: 'object',
                  properties: {
                    calendarButton: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'default--reverse'],
                    },
                    weekName: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default'],
                    },
                    weekday: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--weekend': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default--weekend',
                      ],
                    },
                  },
                  required: ['calendarButton', 'weekName', 'weekday'],
                },
              },
              required: ['typo', 'color'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    vertical: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    horizontal: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['vertical', 'horizontal'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    rounded: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md', 'rounded'],
                },
              },
              required: ['radius'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    calendarButton: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'hover--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'down--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'hover',
                        'down',
                        'default--reverse',
                        'hover--reverse',
                        'down--reverse',
                      ],
                    },
                    weekday: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--alt': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down', 'default--alt'],
                    },
                    range: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                  },
                  required: ['calendarButton', 'weekday', 'range'],
                },
              },
              required: ['color'],
            },
            size: {
              type: 'object',
              properties: {
                md: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['md'],
            },
            shadow: {
              type: 'object',
              properties: {
                hover: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        x: {
                          type: 'number',
                        },
                        y: {
                          type: 'number',
                        },
                        blur: {
                          type: 'number',
                        },
                        spread: {
                          type: 'number',
                        },
                        color: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['x', 'y', 'blur', 'spread', 'color', 'type'],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['hover'],
            },
          },
          required: [
            'content',
            'spacing',
            'border',
            'background',
            'size',
            'shadow',
          ],
        },
        popover: {
          type: 'object',
          properties: {
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    enabled: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['enabled'],
                },
              },
              required: ['color'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    vertical: {
                      type: 'object',
                      properties: {
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['xsm', 'sm', 'md'],
                    },
                    horizontal: {
                      type: 'object',
                      properties: {
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['xsm', 'sm', 'md'],
                    },
                  },
                  required: ['vertical', 'horizontal'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    enabled: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['enabled'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'width', 'radius'],
            },
          },
          required: ['background', 'spacing', 'border'],
        },
        drawer: {
          type: 'object',
          properties: {
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    muted: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'muted'],
                },
              },
              required: ['color'],
            },
            spacing: {
              type: 'object',
              properties: {
                gap: {
                  type: 'object',
                  properties: {
                    xxs: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xs: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['xxs', 'xs', 'sm', 'md'],
                },
                padding: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['gap', 'padding'],
            },
            shadow: {
              type: 'object',
              properties: {
                left: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                top: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['x', 'y', 'blur', 'spread', 'color', 'type'],
                        properties: {
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                          color: {
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
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['left', 'top'],
            },
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    icon: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'icon'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'typo-regular': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'typo-bold': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'typo', 'typo-regular', 'typo-bold'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'width'],
            },
          },
          required: ['background', 'spacing', 'shadow', 'content', 'border'],
        },
        link: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                        textDecoration: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                        'textDecoration',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'typo--medium': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                        textDecoration: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                        'textDecoration',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    down: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover', 'down', 'default--reverse'],
                },
              },
              required: ['typo', 'typo--medium', 'color'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    horizontal: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['horizontal'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    pressed: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    down: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover', 'pressed', 'down'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['radius'],
            },
          },
          required: ['content', 'spacing', 'background', 'border'],
        },
        divider: {
          type: 'object',
          properties: {
            size: {
              type: 'object',
              properties: {
                sm: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['sm'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
              },
              required: ['color'],
            },
          },
          required: ['size', 'background'],
        },
        tab: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    down: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover', 'down'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['sm', 'value', 'type'],
                },
              },
              required: ['color', 'typo'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    content: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    down: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['hover', 'selected', 'content', 'default', 'down'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                width: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['sm', 'md', 'value', 'type'],
                },
              },
              required: ['color', 'radius', 'width'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    down: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover', 'selected', 'down'],
                },
              },
              required: ['color'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                vertical: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md'],
                },
                horizontal: {
                  type: 'object',
                  properties: {
                    xsm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['xsm'],
                },
              },
              required: ['padding', 'gap', 'vertical', 'horizontal'],
            },
          },
          required: ['content', 'border', 'background', 'spacing'],
        },
        segmentedControl: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'typo--medium': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    down: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover', 'selected', 'down'],
                },
              },
              required: ['typo', 'typo--medium', 'color'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover', 'selected'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover', 'selected'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['radius', 'color', 'width'],
            },
          },
          required: ['content', 'spacing', 'background', 'border'],
        },
        modal: {
          type: 'object',
          properties: {
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
              },
              required: ['color'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['radius', 'color', 'width'],
            },
          },
          required: ['background', 'spacing', 'border'],
        },
        dropdown: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--alt': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'default--alt'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'typo--medium': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'typo', 'typo--medium'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    '1xsm': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['1xsm', 'md', 'value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    down: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    active: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover', 'down', 'active'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
              },
              required: ['radius', 'width', 'color'],
            },
            shadow: {
              type: 'object',
              properties: {
                default: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['default'],
            },
          },
          required: ['content', 'spacing', 'background', 'border', 'shadow'],
        },
        score: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    muted: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'muted', 'default--reverse'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                            textCase: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                            'textCase',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                            textCase: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                            'textCase',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'lg--bold': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                            textCase: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                            'textCase',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                            textCase: {
                              type: 'string',
                              minLength: 1,
                            },
                            letterSpacing: {
                              type: 'string',
                            },
                            paragraphSpacing: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                            'textCase',
                            'letterSpacing',
                            'paragraphSpacing',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xlg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                            textCase: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                            'textCase',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '2xlg': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                            textCase: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                            'textCase',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md', 'lg--bold', 'lg', 'xlg', '2xlg'],
                },
              },
              required: ['color', 'typo'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    neutral: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        active: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'emphasis',
                        'subtle',
                        'hover',
                        'active',
                      ],
                    },
                    positive: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted'],
                    },
                    attention: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted'],
                    },
                    negative: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted'],
                    },
                  },
                  required: ['neutral', 'positive', 'attention', 'negative'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    neutral: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        active: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'active'],
                    },
                    positive: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted'],
                    },
                    attention: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted'],
                    },
                    negative: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted'],
                    },
                  },
                  required: ['neutral', 'positive', 'attention', 'negative'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md', 'lg'],
                },
              },
              required: ['color', 'width', 'radius'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xlg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md', 'lg', 'xlg'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
          },
          required: ['content', 'background', 'border', 'spacing'],
        },
        tree: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'fontSize',
                        'lineHeight',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
              },
              required: ['typo', 'color'],
            },
            spacing: {
              type: 'object',
              properties: {
                gap: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md'],
                },
                padding: {
                  type: 'object',
                  properties: {
                    vertical: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    horizontal: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['vertical', 'horizontal'],
                },
              },
              required: ['gap', 'padding'],
            },
            border: {
              type: 'object',
              properties: {
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default-alt': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'hover-alt': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover', 'default-alt', 'hover-alt'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['width', 'color', 'radius'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover'],
                },
              },
              required: ['color'],
            },
          },
          required: ['content', 'spacing', 'border', 'background'],
        },
        breadcrumbs: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'number',
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'number',
                            },
                            textDecoration: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                            'textDecoration',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    current: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'number',
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover', 'current'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--alt': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover', 'default--alt'],
                },
              },
              required: ['typo', 'color'],
            },
          },
          required: ['content'],
        },
        breadcrumb: {
          type: 'object',
          properties: {
            spacing: {
              type: 'object',
              properties: {
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['gap'],
            },
          },
          required: ['spacing'],
        },
        pager: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'number',
                        },
                        fontSize: {
                          type: 'number',
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'typo--bold': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'number',
                        },
                        fontSize: {
                          type: 'number',
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
              },
              required: ['typo', 'typo--bold', 'color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    down: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover', 'down', 'selected'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    down: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    selected: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover', 'down', 'selected'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'radius', 'width'],
            },
            size: {
              type: 'object',
              properties: {
                md: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['md'],
            },
            spacing: {
              type: 'object',
              properties: {
                gap: {
                  type: 'object',
                  properties: {
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['lg', 'md'],
                },
              },
              required: ['gap'],
            },
          },
          required: ['content', 'background', 'border', 'size', 'spacing'],
        },
        tooltip: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default-reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'default-reverse'],
                },
              },
              required: ['typo', 'color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--alt': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default-reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'default--alt', 'default-reverse'],
                },
              },
              required: ['color'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    vertical: {
                      type: 'object',
                      properties: {
                        '2xsm': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['2xsm', 'xsm', 'md', 'sm'],
                    },
                    horizontal: {
                      type: 'object',
                      properties: {
                        '2xsm': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['2xsm', 'sm', 'md'],
                    },
                  },
                  required: ['vertical', 'horizontal'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['radius'],
            },
            shadow: {
              type: 'object',
              properties: {
                default: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['default'],
            },
          },
          required: ['content', 'background', 'spacing', 'border', 'shadow'],
        },
        banner: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'typo--bold': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    success: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    error: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    warning: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    info: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'success', 'error', 'warning', 'info'],
                },
              },
              required: ['typo', 'typo--bold', 'color'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    vertical: {
                      type: 'object',
                      properties: {
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['xsm', 'sm', 'md'],
                    },
                    horizontal: {
                      type: 'object',
                      properties: {
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['sm', 'md'],
                    },
                  },
                  required: ['vertical', 'horizontal'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    error: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    warning: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    info: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['success', 'error', 'warning', 'info'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['radius'],
            },
          },
          required: ['content', 'spacing', 'background', 'border'],
        },
        chip: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
              },
              required: ['typo', 'color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--alt': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'hover--alt': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover', 'default--alt', 'hover--alt'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--alt': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'hover--alt': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    empty: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    'default',
                    'hover',
                    'default--alt',
                    'hover--alt',
                    'empty',
                  ],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'width', 'radius'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    horizontal: {
                      type: 'object',
                      properties: {
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['sm'],
                    },
                    vertical: {
                      type: 'object',
                      properties: {
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['sm'],
                    },
                  },
                  required: ['horizontal', 'vertical'],
                },
              },
              required: ['padding'],
            },
          },
          required: ['content', 'background', 'border', 'spacing'],
        },
        toast: {
          type: 'object',
          properties: {
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--alt': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--alt--reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    'default',
                    'default--reverse',
                    'default--alt',
                    'default--alt--reverse',
                  ],
                },
                typo: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'fontSize',
                            'lineHeight',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'number',
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md'],
                },
              },
              required: ['color', 'typo'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'default--reverse'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'default--reverse'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['radius', 'color', 'width'],
            },
          },
          required: ['spacing', 'content', 'background', 'border'],
        },
        menu: {
          type: 'object',
          properties: {
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    xms: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '3xms': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xsm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xlslg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xlgm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    'xms',
                    '3xms',
                    'xsm',
                    'sm',
                    'md',
                    'xlslg',
                    'xlgm',
                    'lg',
                  ],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'gap--1xsm': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'gap-md': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap', 'gap--1xsm', 'gap-md'],
            },
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    main: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        active: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'active'],
                    },
                    sub: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        active: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'active'],
                    },
                  },
                  required: ['main', 'sub'],
                },
                'typo--regular': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'typo--medium': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'fontSize',
                            'lineHeight',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md'],
                },
              },
              required: ['color', 'typo--regular', 'typo--medium', 'typo'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    main: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        active: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'active'],
                    },
                    sub: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        active: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'active'],
                    },
                  },
                  required: ['main', 'sub'],
                },
              },
              required: ['color'],
            },
            size: {
              type: 'object',
              properties: {
                md: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                lg: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['md', 'lg'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    main: {
                      type: 'object',
                      properties: {
                        active: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['active', 'default'],
                    },
                  },
                  required: ['main'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md'],
                },
              },
              required: ['color', 'radius'],
            },
            shadow: {
              type: 'object',
              properties: {
                value: {
                  type: 'array',
                  uniqueItems: true,
                  minItems: 1,
                  items: {
                    required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                    properties: {
                      color: {
                        type: 'string',
                        minLength: 1,
                      },
                      type: {
                        type: 'string',
                        minLength: 1,
                      },
                      x: {
                        type: 'number',
                      },
                      y: {
                        type: 'number',
                      },
                      blur: {
                        type: 'number',
                      },
                      spread: {
                        type: 'number',
                      },
                    },
                  },
                },
                type: {
                  type: 'string',
                  minLength: 1,
                },
              },
              required: ['value', 'type'],
            },
            footer: {
              type: 'object',
              properties: {
                value: {
                  type: 'array',
                  uniqueItems: true,
                  minItems: 1,
                  items: {
                    required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                    properties: {
                      color: {
                        type: 'string',
                        minLength: 1,
                      },
                      type: {
                        type: 'string',
                        minLength: 1,
                      },
                      x: {
                        type: 'number',
                      },
                      y: {
                        type: 'number',
                      },
                      blur: {
                        type: 'number',
                      },
                      spread: {
                        type: 'number',
                      },
                    },
                  },
                },
                type: {
                  type: 'string',
                  minLength: 1,
                },
              },
              required: ['value', 'type'],
            },
            modal: {
              type: 'object',
              properties: {
                value: {
                  type: 'array',
                  uniqueItems: true,
                  minItems: 1,
                  items: {
                    required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                    properties: {
                      color: {
                        type: 'string',
                        minLength: 1,
                      },
                      type: {
                        type: 'string',
                        minLength: 1,
                      },
                      x: {
                        type: 'number',
                      },
                      y: {
                        type: 'number',
                      },
                      blur: {
                        type: 'number',
                      },
                      spread: {
                        type: 'number',
                      },
                    },
                  },
                },
                type: {
                  type: 'string',
                  minLength: 1,
                },
              },
              required: ['value', 'type'],
            },
          },
          required: [
            'spacing',
            'content',
            'background',
            'size',
            'border',
            'shadow',
            'footer',
            'modal',
          ],
        },
        stepper: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'typo-pending': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    active: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    completed: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    icon: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'active', 'completed', 'icon'],
                },
              },
              required: ['typo', 'typo-pending', 'color'],
            },
            spacing: {
              type: 'object',
              properties: {
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                xsm: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                '2xsm': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                padding: {
                  type: 'object',
                  properties: {
                    xsm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['xsm', 'md'],
                },
              },
              required: ['gap', 'xsm', '2xsm', 'padding'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'active--reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    completed: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    active: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    'default',
                    'active--reverse',
                    'completed',
                    'active',
                  ],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    active: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    transaparet: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    completed: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'active', 'transaparet', 'completed'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                md: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'radius', 'md', 'width'],
            },
            size: {
              type: 'object',
              properties: {
                xs: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                sm: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                md: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                xlg: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['xs', 'sm', 'md', 'xlg'],
            },
          },
          required: ['content', 'spacing', 'background', 'border', 'size'],
        },
        accordion: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md', 'sm'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
              },
              required: ['typo', 'color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--alt': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'default--alt'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'width', 'radius'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md', 'lg'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['padding', 'gap'],
            },
          },
          required: ['content', 'background', 'border', 'spacing'],
        },
        table: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'md--medium': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'number',
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'md--bold': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'number',
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md', 'md--medium', 'sm', 'md--bold'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    subtext: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    icon: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'subtext', 'icon'],
                },
              },
              required: ['typo', 'color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    grey: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'grey'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    emphasis: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'emphasis'],
                },
                width: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'width', 'radius'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md', 'lg'],
                },
                gaps: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md', 'lg'],
                },
              },
              required: ['padding', 'gaps'],
            },
          },
          required: ['content', 'background', 'border', 'spacing'],
        },
        timeline: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'default--reverse'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'typo'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'default--reverse'],
                },
              },
              required: ['color'],
            },
            spacing: {
              type: 'object',
              properties: {
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                padding: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['gap', 'padding'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--reverse': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'default--reverse'],
                },
                width: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md'],
                },
              },
              required: ['color', 'width'],
            },
          },
          required: ['content', 'background', 'spacing', 'border'],
        },
        swiper: {
          type: 'object',
          properties: {
            size: {
              type: 'object',
              properties: {
                md: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['md'],
            },
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
              },
              required: ['color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'hover'],
                },
              },
              required: ['color'],
            },
            spacing: {
              type: 'object',
              properties: {
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                padding: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['gap', 'padding'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['radius'],
            },
          },
          required: ['size', 'content', 'background', 'spacing', 'border'],
        },
        comunica: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                typo: {
                  type: 'object',
                  properties: {
                    '01': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'number',
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '02': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'number',
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['01', '02'],
                },
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--alt': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'default--alt'],
                },
              },
              required: ['typo', 'color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    muted: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    emphasis: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'muted', 'emphasis'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'default--alt': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'default--alt'],
                },
                width: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'width', 'radius'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xlg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md', 'lg', 'xlg'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md', 'lg'],
                },
              },
              required: ['padding', 'gap'],
            },
          },
          required: ['content', 'background', 'border', 'spacing'],
        },
        menuLibrary: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    main: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        active: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'active'],
                    },
                    sub: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        active: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'active'],
                    },
                  },
                  required: ['main', 'sub'],
                },
              },
              required: ['color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    main: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        active: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                            failedToResolve: {
                              type: 'boolean',
                            },
                          },
                          required: ['value', 'type', 'failedToResolve'],
                        },
                      },
                      required: ['default', 'hover', 'active'],
                    },
                    sub: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        active: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'active'],
                    },
                  },
                  required: ['main', 'sub'],
                },
              },
              required: ['color'],
            },
          },
          required: ['content', 'background'],
        },
        headerCreate: {
          type: 'object',
          properties: {
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['lg'],
                },
              },
              required: ['padding'],
            },
            border: {
              type: 'object',
              properties: {
                width: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm'],
                },
              },
              required: ['width'],
            },
          },
          required: ['spacing', 'border'],
        },
        HeaderCreate: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
              },
              required: ['color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    hover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['hover'],
                },
              },
              required: ['color'],
            },
          },
          required: ['content', 'background', 'border'],
        },
        cardLibrary: {
          type: 'object',
          properties: {
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    horizontal: {
                      type: 'object',
                      properties: {
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        '2xsm': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['xsm', 'sm', 'md', '2xsm'],
                    },
                    vertical: {
                      type: 'object',
                      properties: {
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        '2xsm': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['xsm', 'sm', 'md', '2xsm'],
                    },
                  },
                  required: ['horizontal', 'vertical'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xlg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md', 'lg', 'xlg'],
                },
              },
              required: ['padding', 'gap'],
            },
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    emphasis: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    subje: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    muted: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    icon: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['emphasis', 'default', 'subje', 'muted', 'icon'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'number',
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['lg', 'md', 'sm'],
                },
              },
              required: ['color', 'typo'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    cover: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'cover'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    defaut: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    subtle: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['defaut', 'subtle'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    circle: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'circle'],
                },
                width: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'lg'],
                },
              },
              required: ['color', 'radius', 'width'],
            },
            shadow: {
              type: 'object',
              properties: {
                hover: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['hover'],
            },
          },
          required: ['spacing', 'content', 'background', 'border', 'shadow'],
        },
        buttonIconCard: {
          type: 'object',
          properties: {
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm'],
                },
              },
              required: ['padding'],
            },
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                  },
                  required: ['primary'],
                },
              },
              required: ['color'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                            $extensions: {
                              type: 'object',
                              properties: {
                                'studio.tokens': {
                                  type: 'object',
                                  properties: {
                                    modify: {
                                      type: 'object',
                                      properties: {
                                        type: {
                                          type: 'string',
                                          minLength: 1,
                                        },
                                        value: {
                                          type: 'string',
                                          minLength: 1,
                                        },
                                        space: {
                                          type: 'string',
                                          minLength: 1,
                                        },
                                      },
                                      required: ['type', 'value', 'space'],
                                    },
                                  },
                                  required: ['modify'],
                                },
                              },
                              required: ['studio.tokens'],
                            },
                          },
                          required: ['value', 'type', '$extensions'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                            $extensions: {
                              type: 'object',
                              properties: {
                                'studio.tokens': {
                                  type: 'object',
                                  properties: {
                                    modify: {
                                      type: 'object',
                                      properties: {
                                        type: {
                                          type: 'string',
                                          minLength: 1,
                                        },
                                        value: {
                                          type: 'string',
                                          minLength: 1,
                                        },
                                        space: {
                                          type: 'string',
                                          minLength: 1,
                                        },
                                      },
                                      required: ['type', 'value', 'space'],
                                    },
                                  },
                                  required: ['modify'],
                                },
                              },
                              required: ['studio.tokens'],
                            },
                          },
                          required: ['value', 'type', '$extensions'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'down'],
                    },
                  },
                  required: ['primary'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['md'],
                },
              },
              required: ['radius'],
            },
          },
          required: ['spacing', 'content', 'background', 'border'],
        },
        ButtonIconCard: {
          type: 'object',
          properties: {
            blur: {
              type: 'object',
              properties: {
                default: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['default'],
            },
          },
          required: ['blur'],
        },
        buttonIconLike: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        hover: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        active: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'hover', 'active'],
                    },
                  },
                  required: ['primary'],
                },
              },
              required: ['color'],
            },
          },
          required: ['content'],
        },
        cardAssignments: {
          type: 'object',
          properties: {
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    horizontal: {
                      type: 'object',
                      properties: {
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        '2xsm': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['xsm', 'sm', 'md', '2xsm'],
                    },
                    vertical: {
                      type: 'object',
                      properties: {
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        '2xsm': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['xsm', 'sm', 'md', '2xsm'],
                    },
                  },
                  required: ['horizontal', 'vertical'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xlg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md', 'lg', 'xlg'],
                },
              },
              required: ['padding', 'gap'],
            },
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    emphasis: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    subje: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    muted: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    icon: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['emphasis', 'default', 'subje', 'muted', 'icon'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'number',
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'sm--medium': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xxl: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xl: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['lg', 'md', 'sm', 'sm--medium', 'xxl', 'xl'],
                },
                phatic: {
                  type: 'object',
                  properties: {
                    positive: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    alert: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    danger: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['positive', 'alert', 'danger'],
                },
              },
              required: ['color', 'typo', 'phatic'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    top: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'top'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    subtle: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['subtle'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    circle: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'circle'],
                },
                width: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'lg'],
                },
              },
              required: ['color', 'radius', 'width'],
            },
            shadow: {
              type: 'object',
              properties: {
                hover: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['hover'],
            },
          },
          required: ['spacing', 'content', 'background', 'border', 'shadow'],
        },
        progress: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    text: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    porcentage: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    mutted: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    phatic: {
                      type: 'object',
                      properties: {
                        positive: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        attention: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        negative: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        info: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['positive', 'attention', 'negative', 'info'],
                    },
                  },
                  required: ['text', 'porcentage', 'mutted', 'phatic'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'sm--medium': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        fontFamily: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontWeight: {
                          type: 'number',
                        },
                        lineHeight: {
                          type: 'string',
                          minLength: 1,
                        },
                        fontSize: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        'fontFamily',
                        'fontWeight',
                        'lineHeight',
                        'fontSize',
                      ],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['color', 'typo', 'sm--medium'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    primary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default'],
                    },
                  },
                  required: ['primary'],
                },
              },
              required: ['color'],
            },
            spacing: {
              type: 'object',
              properties: {
                gap: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['gap'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    rounded: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['rounded'],
                },
              },
              required: ['radius'],
            },
          },
          required: ['content', 'background', 'spacing', 'border'],
        },
        ChipModule: {
          type: 'object',
          properties: {
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    horizontal: {
                      type: 'object',
                      properties: {
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['sm'],
                    },
                    vertical: {
                      type: 'object',
                      properties: {
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['sm'],
                    },
                  },
                  required: ['horizontal', 'vertical'],
                },
              },
              required: ['padding'],
            },
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm'],
                },
              },
              required: ['color', 'typo'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                radius: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['radius'],
            },
          },
          required: ['spacing', 'content', 'background', 'border'],
        },
        cardEvaluation: {
          type: 'object',
          properties: {
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    horizontal: {
                      type: 'object',
                      properties: {
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        '2xsm': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['xsm', 'sm', 'md', '2xsm'],
                    },
                    vertical: {
                      type: 'object',
                      properties: {
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        '2xsm': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['xsm', 'sm', 'md', '2xsm'],
                    },
                  },
                  required: ['horizontal', 'vertical'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xlg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md', 'lg', 'xlg'],
                },
              },
              required: ['padding', 'gap'],
            },
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    emphasis: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    subje: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    muted: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    icon: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['emphasis', 'default', 'subje', 'muted', 'icon'],
                },
                phatic: {
                  type: 'object',
                  properties: {
                    positive: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    alert: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    danger: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    info: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['positive', 'alert', 'danger', 'info'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'xsm--semiBold': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'sm--medium': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xxl: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xl: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'fontSize',
                            'lineHeight',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    'lg',
                    'md',
                    'sm',
                    'xsm--semiBold',
                    'sm--medium',
                    'xxl',
                    'xl',
                  ],
                },
              },
              required: ['color', 'phatic', 'typo'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    top: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    circle: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'top', 'circle'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    subtle: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['subtle'],
                },
                width: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'lg'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    circle: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'circle'],
                },
              },
              required: ['color', 'width', 'radius'],
            },
            shadow: {
              type: 'object',
              properties: {
                hover: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['hover'],
            },
          },
          required: ['spacing', 'content', 'background', 'border', 'shadow'],
        },
        cardModule: {
          type: 'object',
          properties: {
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    horizontal: {
                      type: 'object',
                      properties: {
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        '2xsm': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        lg: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['xsm', 'sm', 'md', '2xsm', 'lg'],
                    },
                    vertical: {
                      type: 'object',
                      properties: {
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        '2xsm': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['xsm', 'sm', 'md', '2xsm'],
                    },
                  },
                  required: ['horizontal', 'vertical'],
                },
                gap: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xlg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md', 'lg', 'xlg'],
                },
              },
              required: ['padding', 'gap'],
            },
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    emphasis: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    subje: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    muted: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    icon: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['emphasis', 'default', 'subje', 'muted', 'icon'],
                },
                phatic: {
                  type: 'object',
                  properties: {
                    positive: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    alert: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    danger: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['positive', 'alert', 'danger'],
                },
                typo: {
                  type: 'object',
                  properties: {
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    'sm--medium': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xxl: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xl: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['lg', 'md', 'sm', 'sm--medium', 'xxl', 'xl'],
                },
              },
              required: ['color', 'phatic', 'typo'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    default: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    top: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['default', 'top'],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    subtle: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['subtle'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    circle: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'circle'],
                },
                width: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'lg'],
                },
              },
              required: ['color', 'radius', 'width'],
            },
            shadow: {
              type: 'object',
              properties: {
                hover: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['hover'],
            },
          },
          required: ['spacing', 'content', 'background', 'border', 'shadow'],
        },
        global: {
          type: 'object',
          properties: {
            focus: {
              type: 'object',
              properties: {
                default: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        x: {
                          type: 'number',
                        },
                        y: {
                          type: 'number',
                        },
                        blur: {
                          type: 'number',
                        },
                        spread: {
                          type: 'number',
                        },
                        color: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['x', 'y', 'blur', 'spread', 'color', 'type'],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                'default-border': {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['default', 'default-border'],
            },
            content: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    text: {
                      type: 'object',
                      properties: {
                        dark: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'dark',
                        'emphasis',
                        'default',
                        'muted',
                        'subtle',
                        'default--reverse',
                      ],
                    },
                    icon: {
                      type: 'object',
                      properties: {
                        deep: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        dark: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'deep',
                        'dark',
                        'emphasis',
                        'default',
                        'muted',
                        'default--reverse',
                      ],
                    },
                    primary: {
                      type: 'object',
                      properties: {
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        strong: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'subtle',
                        'muted',
                        'default',
                        'emphasis',
                        'strong',
                      ],
                    },
                    secondary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    negative: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    positive: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    disabled: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    transparent: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    attention: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    tertiary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default'],
                    },
                    accent: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default'],
                    },
                    info: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    neutral: {
                      type: 'object',
                      properties: {
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'emphasis',
                        'default',
                        'muted',
                        'subtle',
                        'default--reverse',
                      ],
                    },
                  },
                  required: [
                    'text',
                    'icon',
                    'primary',
                    'secondary',
                    'negative',
                    'positive',
                    'disabled',
                    'transparent',
                    'attention',
                    'tertiary',
                    'accent',
                    'info',
                    'neutral',
                  ],
                },
                typo: {
                  type: 'object',
                  properties: {
                    heading: {
                      type: 'object',
                      properties: {
                        xlg: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'xlg--semiBold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        lg: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'lg--semiBold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'md--semiBold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'sm--semiBold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'xsm--semiBold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'xlg',
                        'xlg--semiBold',
                        'lg',
                        'lg--semiBold',
                        'md',
                        'md--semiBold',
                        'sm',
                        'sm--semiBold',
                        'xsm',
                        'xsm--semiBold',
                      ],
                    },
                    body: {
                      type: 'object',
                      properties: {
                        lg: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'lg--medium': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'lg--semiBold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'md--medium': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'md--semiBold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'sm--medium': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'sm--semiBold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'xsm--semiBold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'lg--bold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'md--bold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'sm--bold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'lg',
                        'lg--medium',
                        'lg--semiBold',
                        'md',
                        'md--medium',
                        'md--semiBold',
                        'sm',
                        'sm--medium',
                        'sm--semiBold',
                        'xsm',
                        'xsm--semiBold',
                        'lg--bold',
                        'md--bold',
                        'sm--bold',
                      ],
                    },
                    caption: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'fontSize',
                            'lineHeight',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['heading', 'body', 'caption'],
                },
                typoMobile: {
                  type: 'object',
                  properties: {
                    heading: {
                      type: 'object',
                      properties: {
                        xlg: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        lg: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        xsm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['xlg', 'lg', 'md', 'sm', 'xsm'],
                    },
                    body: {
                      type: 'object',
                      properties: {
                        lg: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'lg--bold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        md: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'md--bold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        sm: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'sm--bold': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'object',
                              properties: {
                                fontFamily: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontWeight: {
                                  type: 'number',
                                },
                                lineHeight: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                fontSize: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: [
                                'fontFamily',
                                'fontWeight',
                                'lineHeight',
                                'fontSize',
                              ],
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'lg',
                        'lg--bold',
                        'md',
                        'md--bold',
                        'sm',
                        'sm--bold',
                      ],
                    },
                    caption: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            fontFamily: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontWeight: {
                              type: 'number',
                            },
                            lineHeight: {
                              type: 'string',
                              minLength: 1,
                            },
                            fontSize: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'fontFamily',
                            'fontWeight',
                            'lineHeight',
                            'fontSize',
                          ],
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['heading', 'body', 'caption'],
                },
              },
              required: ['color', 'typo', 'typoMobile'],
            },
            background: {
              type: 'object',
              properties: {
                color: {
                  type: 'object',
                  properties: {
                    surface: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'emphasis',
                        'muted',
                        'subtle',
                        'default--reverse',
                      ],
                    },
                    primary: {
                      type: 'object',
                      properties: {
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        strong: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'subtle',
                        'muted',
                        'default',
                        'emphasis',
                        'strong',
                      ],
                    },
                    secondary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    accent: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'subtle'],
                    },
                    negative: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    positive: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    transparent: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    disabled: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    overlay: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default'],
                    },
                    attention: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    info: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    tertiary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default'],
                    },
                  },
                  required: [
                    'surface',
                    'primary',
                    'secondary',
                    'accent',
                    'negative',
                    'positive',
                    'transparent',
                    'disabled',
                    'overlay',
                    'attention',
                    'info',
                    'tertiary',
                  ],
                },
              },
              required: ['color'],
            },
            border: {
              type: 'object',
              properties: {
                width: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md', 'lg'],
                },
                radius: {
                  type: 'object',
                  properties: {
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    rounded: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    circle: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['sm', 'md', 'lg', 'rounded', 'circle'],
                },
                color: {
                  type: 'object',
                  properties: {
                    line: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        'default--reverse': {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'default',
                        'emphasis',
                        'muted',
                        'subtle',
                        'default--reverse',
                      ],
                    },
                    primary: {
                      type: 'object',
                      properties: {
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        strong: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: [
                        'subtle',
                        'muted',
                        'default',
                        'emphasis',
                        'strong',
                      ],
                    },
                    secondary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    negative: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    positive: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    transparent: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    disabled: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'muted'],
                    },
                    overlay: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default'],
                    },
                    attention: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    leemons: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                            failedToResolve: {
                              type: 'boolean',
                            },
                          },
                          required: ['value', 'type', 'failedToResolve'],
                        },
                      },
                      required: ['default'],
                    },
                    info: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        emphasis: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        muted: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        subtle: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default', 'emphasis', 'muted', 'subtle'],
                    },
                    tertiary: {
                      type: 'object',
                      properties: {
                        default: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'string',
                              minLength: 1,
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                      },
                      required: ['default'],
                    },
                  },
                  required: [
                    'line',
                    'primary',
                    'secondary',
                    'negative',
                    'positive',
                    'transparent',
                    'disabled',
                    'overlay',
                    'attention',
                    'leemons',
                    'info',
                    'tertiary',
                  ],
                },
              },
              required: ['width', 'radius', 'color'],
            },
            spacing: {
              type: 'object',
              properties: {
                padding: {
                  type: 'object',
                  properties: {
                    '3xsm': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '2xsm': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '1xsm': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xsm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xmsm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xlslg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xlg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '2xlg': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '3xlg': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    '3xsm',
                    '2xsm',
                    '1xsm',
                    'xsm',
                    'xmsm',
                    'sm',
                    'md',
                    'lg',
                    'xlslg',
                    'xlg',
                    '2xlg',
                    '3xlg',
                  ],
                },
                gap: {
                  type: 'object',
                  properties: {
                    none: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '1xsm': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xsm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    slg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xlg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xxlg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    'none',
                    '1xsm',
                    'sm',
                    'xsm',
                    'md',
                    'slg',
                    'lg',
                    'xlg',
                    'xxlg',
                  ],
                },
              },
              required: ['padding', 'gap'],
            },
            icon: {
              type: 'object',
              properties: {
                size: {
                  type: 'object',
                  properties: {
                    '1xs': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xsm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    xlg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    '2xlg': {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['1xs', 'xsm', 'sm', 'md', 'lg', 'xlg', '2xlg'],
                },
              },
              required: ['size'],
            },
            control: {
              type: 'object',
              properties: {
                size: {
                  type: 'object',
                  properties: {
                    50: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    100: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    200: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    300: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    400: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    500: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    600: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    700: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    800: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    900: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    1000: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    '50',
                    '100',
                    '200',
                    '300',
                    '400',
                    '500',
                    '600',
                    '700',
                    '800',
                    '900',
                    '1000',
                  ],
                },
              },
              required: ['size'],
            },
            hover: {
              type: 'object',
              properties: {
                default: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'object',
                      properties: {
                        x: {
                          type: 'number',
                        },
                        y: {
                          type: 'number',
                        },
                        blur: {
                          type: 'number',
                        },
                        spread: {
                          type: 'number',
                        },
                        color: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['x', 'y', 'blur', 'spread', 'color', 'type'],
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['default'],
            },
            shadow: {
              type: 'object',
              properties: {
                100: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                200: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                300: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                400: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['100', '200', '300', '400'],
            },
          },
          required: [
            'focus',
            'content',
            'background',
            'border',
            'spacing',
            'icon',
            'control',
            'hover',
            'shadow',
          ],
        },
        core: {
          type: 'object',
          properties: {
            color: {
              type: 'object',
              properties: {
                black: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                white: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                neutral: {
                  type: 'object',
                  properties: {
                    50: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    75: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    100: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    200: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    300: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    400: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    500: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    600: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    700: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    800: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    900: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    '50',
                    '75',
                    '100',
                    '200',
                    '300',
                    '400',
                    '500',
                    '600',
                    '700',
                    '800',
                    '900',
                  ],
                },
                primary: {
                  type: 'object',
                  properties: {
                    100: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    200: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    300: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    400: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    500: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    600: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    700: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    800: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    900: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    '100',
                    '200',
                    '300',
                    '400',
                    '500',
                    '600',
                    '700',
                    '800',
                    '900',
                  ],
                },
                danger: {
                  type: 'object',
                  properties: {
                    100: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    200: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    300: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    400: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    500: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    600: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    700: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    800: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    900: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    '100',
                    '200',
                    '300',
                    '400',
                    '500',
                    '600',
                    '700',
                    '800',
                    '900',
                  ],
                },
                success: {
                  type: 'object',
                  properties: {
                    100: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    200: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    300: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    400: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    500: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    600: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    700: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    800: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    900: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    '100',
                    '200',
                    '300',
                    '400',
                    '500',
                    '600',
                    '700',
                    '800',
                    '900',
                  ],
                },
                attention: {
                  type: 'object',
                  properties: {
                    100: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    200: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    300: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    400: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    500: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    600: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    700: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    800: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    900: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    '100',
                    '200',
                    '300',
                    '400',
                    '500',
                    '600',
                    '700',
                    '800',
                    '900',
                  ],
                },
                info: {
                  type: 'object',
                  properties: {
                    100: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    200: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    300: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    400: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    500: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    600: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    700: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    800: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    900: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    '100',
                    '200',
                    '300',
                    '400',
                    '500',
                    '600',
                    '700',
                    '800',
                    '900',
                  ],
                },
                secondary: {
                  type: 'object',
                  properties: {
                    100: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['100'],
                },
                tertiary: {
                  type: 'object',
                  properties: {
                    100: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['100'],
                },
                accent: {
                  type: 'object',
                  properties: {
                    100: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    200: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    300: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    400: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    500: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    600: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    700: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    800: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    900: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    '100',
                    '200',
                    '300',
                    '400',
                    '500',
                    '600',
                    '700',
                    '800',
                    '900',
                  ],
                },
                customPrimary: {
                  type: 'object',
                  properties: {
                    hue: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    saturation: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lightness: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hsla: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['hue', 'saturation', 'lightness', 'hsla'],
                },
                customAccent: {
                  type: 'object',
                  properties: {
                    hue: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    saturation: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lightness: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    hsla: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['hue', 'saturation', 'lightness', 'hsla'],
                },
              },
              required: [
                'black',
                'white',
                'neutral',
                'primary',
                'danger',
                'success',
                'attention',
                'info',
                'secondary',
                'tertiary',
                'accent',
                'customPrimary',
                'customAccent',
              ],
            },
            dimension: {
              type: 'object',
              properties: {
                0: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                50: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                100: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                150: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                175: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                200: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                250: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                300: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                350: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                400: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                500: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                600: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                700: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                800: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                900: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                1000: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                static: {
                  type: 'object',
                  properties: {
                    0: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    10: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    25: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    50: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    75: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    100: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    125: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    150: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    200: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    250: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    300: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    350: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    400: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    450: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    500: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    550: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    600: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    700: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    800: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    900: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    1000: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    '0',
                    '10',
                    '25',
                    '50',
                    '75',
                    '100',
                    '125',
                    '150',
                    '200',
                    '250',
                    '300',
                    '350',
                    '400',
                    '450',
                    '500',
                    '550',
                    '600',
                    '700',
                    '800',
                    '900',
                    '1000',
                  ],
                },
                root: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                percentage: {
                  type: 'object',
                  properties: {
                    50: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    100: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['50', '100'],
                },
                breakpoint: {
                  type: 'object',
                  properties: {
                    xsm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    sm: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    md: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    lg: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['xsm', 'sm', 'md', 'lg'],
                },
              },
              required: [
                '0',
                '50',
                '100',
                '150',
                '175',
                '200',
                '250',
                '300',
                '350',
                '400',
                '500',
                '600',
                '700',
                '800',
                '900',
                '1000',
                'static',
                'root',
                'percentage',
                'breakpoint',
              ],
            },
            font: {
              type: 'object',
              properties: {
                family: {
                  type: 'object',
                  properties: {
                    main: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    alt: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    code: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'string',
                          minLength: 1,
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['main', 'alt', 'code'],
                },
                weight: {
                  type: 'object',
                  properties: {
                    regular: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    medium: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    semiBold: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    light: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    bold: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: ['regular', 'medium', 'semiBold', 'light', 'bold'],
                },
                lineHeight: {
                  type: 'object',
                  properties: {
                    75: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    100: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    200: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    300: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    400: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    500: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    600: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    700: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    '75',
                    '100',
                    '200',
                    '300',
                    '400',
                    '500',
                    '600',
                    '700',
                  ],
                },
                size: {
                  type: 'object',
                  properties: {
                    25: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    30: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    50: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    75: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    100: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    200: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    300: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    400: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    500: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                    600: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number',
                        },
                        type: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: ['value', 'type'],
                    },
                  },
                  required: [
                    '25',
                    '30',
                    '50',
                    '75',
                    '100',
                    '200',
                    '300',
                    '400',
                    '500',
                    '600',
                  ],
                },
                uppercase: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['family', 'weight', 'lineHeight', 'size', 'uppercase'],
            },
            shadow: {
              type: 'object',
              properties: {
                100: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                200: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                300: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                400: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['color', 'type', 'x', 'y', 'blur', 'spread'],
                        properties: {
                          color: {
                            type: 'string',
                            minLength: 1,
                          },
                          type: {
                            type: 'string',
                            minLength: 1,
                          },
                          x: {
                            type: 'number',
                          },
                          y: {
                            type: 'number',
                          },
                          blur: {
                            type: 'number',
                          },
                          spread: {
                            type: 'number',
                          },
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['100', '200', '300', '400'],
            },
            blur: {
              type: 'object',
              properties: {
                value: {
                  type: 'string',
                  minLength: 1,
                },
                type: {
                  type: 'string',
                  minLength: 1,
                },
              },
              required: ['value', 'type'],
            },
          },
          required: ['color', 'dimension', 'font', 'shadow', 'blur'],
        },
        util: {
          type: 'object',
          properties: {
            color: {
              type: 'object',
              properties: {
                primary: {
                  type: 'object',
                  properties: {
                    lightness: {
                      type: 'object',
                      properties: {
                        scale: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'number',
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        up: {
                          type: 'object',
                          properties: {
                            1: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                            2: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                            3: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                            4: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                            5: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                          },
                          required: ['1', '2', '3', '4', '5'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            1: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                            2: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                            3: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                            4: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                            5: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                          },
                          required: ['1', '2', '3', '4', '5'],
                        },
                      },
                      required: ['scale', 'up', 'down'],
                    },
                  },
                  required: ['lightness'],
                },
                accent: {
                  type: 'object',
                  properties: {
                    lightness: {
                      type: 'object',
                      properties: {
                        scale: {
                          type: 'object',
                          properties: {
                            value: {
                              type: 'number',
                            },
                            type: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: ['value', 'type'],
                        },
                        up: {
                          type: 'object',
                          properties: {
                            1: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                            2: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                            3: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                            4: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                          },
                          required: ['1', '2', '3', '4'],
                        },
                        down: {
                          type: 'object',
                          properties: {
                            1: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                            2: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                            3: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                            4: {
                              type: 'object',
                              properties: {
                                value: {
                                  type: 'number',
                                },
                                type: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                              required: ['value', 'type'],
                            },
                          },
                          required: ['1', '2', '3', '4'],
                        },
                      },
                      required: ['scale', 'up', 'down'],
                    },
                  },
                  required: ['lightness'],
                },
                colorDebug: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                debugColorContainer: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      minLength: 1,
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: [
                'primary',
                'accent',
                'colorDebug',
                'debugColorContainer',
              ],
            },
            font: {
              type: 'object',
              properties: {
                scale: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
                base: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'number',
                    },
                    type: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['value', 'type'],
                },
              },
              required: ['scale', 'base'],
            },
          },
          required: ['color', 'font'],
        },
        underline: {
          type: 'object',
          properties: {
            value: {
              type: 'string',
              minLength: 1,
            },
            type: {
              type: 'string',
              minLength: 1,
            },
          },
          required: ['value', 'type'],
        },
      },
      required: [
        'button',
        'dropzone',
        'toggle',
        'buttonText',
        'buttonIcon',
        'buttonAction',
        'input',
        'label',
        'helpText',
        'radio',
        'checkbox',
        'badge',
        'avatar',
        'colorPicker',
        'calendar',
        'popover',
        'drawer',
        'link',
        'divider',
        'tab',
        'segmentedControl',
        'modal',
        'dropdown',
        'score',
        'tree',
        'breadcrumbs',
        'breadcrumb',
        'pager',
        'tooltip',
        'banner',
        'chip',
        'toast',
        'menu',
        'stepper',
        'accordion',
        'table',
        'timeline',
        'swiper',
        'comunica',
        'menuLibrary',
        'headerCreate',
        'HeaderCreate',
        'cardLibrary',
        'buttonIconCard',
        'ButtonIconCard',
        'buttonIconLike',
        'cardAssignments',
        'progress',
        'ChipModule',
        'cardEvaluation',
        'cardModule',
        'global',
        'core',
        'util',
        'underline',
      ],
    },
  },
  required: ['status', 'jsonTheme'],
};

module.exports = { schema };
