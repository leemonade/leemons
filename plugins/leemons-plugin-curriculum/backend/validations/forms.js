const _ = require('lodash');

const { LeemonsValidator } = require('leemons-validator');
const { LeemonsError } = require('leemons-error');
const { stringSchema, numberSchema, stringSchemaNullable } = require('./types');

const addCurriculumSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    description: stringSchema,
    country: stringSchema,
    locale: stringSchema,
    center: stringSchema,
    program: stringSchema,
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: ['name', 'country', 'locale', 'center', 'program'],
  additionalProperties: false,
};

function validateAddCurriculum(data) {
  const validator = new LeemonsValidator(addCurriculumSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  // TODO: Check center and program exist and program is from his center
}

const addNodeLevelSchema = {
  type: 'object',
  properties: {
    curriculum: stringSchema,
    nodeLevels: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: stringSchema,
          type: stringSchema,
          listType: {
            type: 'string',
            enum: ['not-ordered', 'bullets', 'style-1', 'style-2', 'custom'],
          },
          levelOrder: numberSchema,
        },
        required: ['name', 'type', 'listType', 'levelOrder'],
        additionalProperties: false,
      },
    },
  },
  required: ['curriculum', 'nodeLevels'],
  additionalProperties: false,
};

async function validateAddNodeLevels({ data, ctx }) {
  const validator = new LeemonsValidator(addNodeLevelSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const existCurriculum = await ctx.tx.db.Curriculums.countDocuments({ id: data.curriculum });
  if (!existCurriculum) throw new LeemonsError(ctx, { message: 'Curriculum not found' });

  // ES: Compobamos que no existan niveles repetidos
  // EN: Check that there are no duplicate levels
  const currentLevels = await ctx.tx.db.NodeLevels.find({ curriculum: data.curriculum })
    .select(['id', 'levelOrder'])
    .lean();
  let levelOrders = _.map(data.nodeLevels, 'levelOrder');
  levelOrders = levelOrders.concat(_.map(currentLevels, 'levelOrder'));
  const duplicatedLevels = _.uniq(levelOrders).length !== levelOrders.length;
  if (duplicatedLevels) throw new LeemonsError(ctx, { message: 'Duplicated order levels' });
}

const updateNodeLevelSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    listType: stringSchema,
  },
  required: ['id', 'name', 'listType'],
  additionalProperties: false,
};

async function validateUpdateNodeLevel({ data, ctx }) {
  const validator = new LeemonsValidator(updateNodeLevelSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const existNodeLevel = await ctx.tx.db.NodeLevels.countDocuments({ id: data.id });
  if (!existNodeLevel) throw new LeemonsError(ctx, { message: 'Node level not found' });
}

const addNodeSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    curriculum: stringSchema,
    nodeLevel: stringSchema,
    parentNode: stringSchemaNullable,
    nodeOrder: numberSchema,
  },
  required: ['name', 'curriculum', 'nodeLevel', 'parentNode', 'nodeOrder'],
  additionalProperties: false,
};

async function validateAddNode({ data, ctx }) {
  const validator = new LeemonsValidator(addNodeSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  // ES: Comprobamos que el currículo existe
  // EN: Check that the curriculum exists
  const existCurriculum = await ctx.tx.db.Curriculums.countDocuments({ id: data.curriculum });
  if (!existCurriculum) throw new LeemonsError(ctx, { message: 'Curriculum not found' });

  // ES: Comprobamos que el nodeLevel exista para el curriculum
  // EN: Check that the nodeLevel exists for the curriculum
  const existNodeLevel = await ctx.tx.db.NodeLevels.countDocuments({
    id: data.nodeLevel,
    curriculum: data.curriculum,
  });
  if (!existNodeLevel) throw new LeemonsError(ctx, { message: 'Node level not found' });

  // ES: Comprobamos que el nodo padre exista para el curriculum si no es null
  // EN: Check that the parent node exists for the curriculum if it is not null
  if (data.parentNode) {
    const existParentNode = await ctx.tx.db.Nodes.countDocuments({
      id: data.parentNode,
      curriculum: data.curriculum,
    });
    if (!existParentNode) throw new LeemonsError(ctx, { message: 'Parent node not found' });
  }
}

module.exports = {
  validateAddNode,
  validateAddNodeLevels,
  validateAddCurriculum,
  validateUpdateNodeLevel,
};
