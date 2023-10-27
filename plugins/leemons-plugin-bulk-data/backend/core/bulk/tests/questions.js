const { keys, trim, isNil, isEmpty, isString, isArray } = require('lodash');
const showdown = require('showdown');
const itemsImport = require('../helpers/simpleListImport');

const converter = new showdown.Converter();

async function importQuestions(filePath) {
  const items = await itemsImport(filePath, 'te_questions', 40, true, true);
  const questions = [];

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const question = items[key];

      question.question = converter.makeHtml(question.question || '');

      question.tags = (question.tags || '')
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val));

      question.tags = question.tags || [];

      question.clues = (question.clues || '')
        .split('|')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((value) => ({ value }));

      // ·····················································
      // FEEDBACKS

      const feedbacks = (question.answers_feedback || '')
        .split('|')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((feedbackItem) => {
          const [answer, feedback] = feedbackItem.split('@');
          return {
            answer: Number(answer),
            feedback: converter.makeHtml(feedback),
          };
        });

      // ·····················································
      // PROPERTIES

      const properties = {};

      if (feedbacks && feedbacks.length > 1) {
        properties.explanationInResponses = true;
        properties.explanation = '<p></p>';
      } else {
        properties.explanation = converter.makeHtml(question.answers_feedback) || '';
      }

      // ·····················································
      // RESPONSES

      const imageResponses = Boolean(question.withImages && question.answers_images);
      const responseBreak = imageResponses ? ',' : '|';

      if (imageResponses) {
        // console.log('-- QUESTION HAS IMAGES RESPONSES:');
        // console.log('responseBreak:', responseBreak);

        if (!isString(question.answers_images) && isArray(question.answers_images?.richText)) {
          question.answers_images = question.answers_images.richText
            .map((item) => item.text)
            .join('');
        }

        // console.log(question.answers_images);
      }

      try {
        properties.responses = String(
          (imageResponses ? question.answers_images : question.answers) || question.answers || ''
        )
          .split(responseBreak)
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val))
          .map((answer, index) => {
            const { feedback } = feedbacks.find((item) => item.answer === index + 1) || {};
            const hideOnHelp = answer.slice(-1) === '@';
            let response = answer;

            if (hideOnHelp) {
              response = answer.slice(0, -1);
            }

            const value = {
              explanation: feedback || null,
              isCorrectResponse: Number(question.answer_correct) === index + 1,
              hideOnHelp,
            };

            if (imageResponses) {
              const [url, caption] = response.split('|');
              value.image = url;
              value.imageDescription = caption;
            } else {
              value.response = response;
            }

            return { value };
          });
      } catch (e) {
        console.log('-- QUESTIONS IMPORT ERROR --');
        console.log(e);
        console.log('imageResponses:', imageResponses);
        console.log('question.answers_images:', question.answers_images);
        console.log('question.answers:', question.answers);
        console.log('---------------------------------');
        properties.responses = [];
      }
      // ·····················································
      // QUESTION MAP

      if (question.type === 'map') {
        if (!isEmpty(question.questionImage)) {
          properties.image = question.questionImage;
          delete question.questionImage;
        }

        properties.markers = {
          list: properties.responses.map(({ value }, index) => ({
            left: `${(100 / (properties.responses.length + 1)) * (index + 1)}%`,
            top: '50%',
            response: value?.response,
            hideOnHelp: value?.hideOnHelp || undefined,
          })),
          type: 'numbering',
          backgroundColor: '#3B76CC',
          position: { left: '100%', top: '100%' },
        };

        delete properties.responses;
        delete question.answers_feedback_image;
      }

      question.properties = properties;

      // ·····················································
      // CLEAN

      delete question.answers;
      delete question.answers_feedback;
      delete question.answer_correct;
      delete question.answers_images;
      delete question.answers_feedback_image;

      items[key] = question;
      questions.push(question);
    });

  // eslint-disable-next-line no-unused-vars
  const mock = {
    id: '09080890-f570-491b-afd4-323aaacb2356@1.0.0',
    name: 'Nombre del qbank',
    program: 'e9999152-59d1-45ee-9dc2-ee1541ed189e',
    published: false,
    asset: {
      id: 'a612f087-c852-4d18-9083-00a39001cd97@1.0.0',
      name: 'Nombre del qbank',
      tagline: 'Subtítulo del qbank',
      description: 'Descripción del qbank',
      color: '#d98c8c',
      cover: null,
      fromUser: 'a3d16ca2-0289-4e5a-bbf0-37a7622684bb',
      fromUserAgent: '222154db-e09d-4d91-8247-8021ad3d25a3',
      public: 1,
      category: '6f9a8546-2f92-4b1c-b302-c16f226a5136',
      indexable: 1,
      deleted: 0,
      created_at: '2022-05-26T15:39:34.000Z',
      updated_at: '2022-05-26T15:39:34.000Z',
      deleted_at: null,
      duplicable: 1,
      downloadable: false,
      providerData: {
        id: '09080890-f570-491b-afd4-323aaacb2356@1.0.0',
        name: 'Nombre del qbank',
        program: 'e9999152-59d1-45ee-9dc2-ee1541ed189e',
        published: 0,
        asset: 'a612f087-c852-4d18-9083-00a39001cd97@1.0.0',
        deleted: 0,
        created_at: '2022-05-26T15:39:34.000Z',
        updated_at: '2022-05-26T15:39:34.000Z',
        deleted_at: null,
        tags: ['un-tag'],
        categories: [
          { value: 'Categoría para el qbank', id: '47f2ed6f-7921-4dd3-9d15-37e43a428f13' },
        ],
        subjects: ['e77cec64-a462-4d8a-a34f-e80688cb22bb'],
        questions: [
          {
            id: '7f77f4e1-664a-477f-bc45-f4adf2666ea5',
            questionBank: '09080890-f570-491b-afd4-323aaacb2356@1.0.0',
            type: 'mono-response',
            withImages: 1,
            level: 'intermediate',
            question: '<p style="margin-left: 0px!important;">Pregunta 2 - Soy el enunciado</p>',
            questionImage: {
              id: '173246ea-ca49-45c1-a6a0-99a902b90cb9@1.0.0',
              name: 'Image question',
              tagline: null,
              description: null,
              color: null,
              cover: {
                id: '0a1d069b-a423-4d66-9b52-0a31c3700e03',
                provider: 'leebrary-aws-s3',
                type: 'image/jpeg',
                extension: 'jpeg',
                name: 'Image question',
                uri: 'leemons/leebrary/0a1d069b-a423-4d66-9b52-0a31c3700e03.jpeg',
                metadata: '{"size":"77.9 KB","format":"JPEG","width":"1024","height":"694"}',
                deleted: 0,
                created_at: '2022-05-26T15:39:35.000Z',
                updated_at: '2022-05-26T15:39:36.000Z',
                deleted_at: null,
              },
              fromUser: 'a3d16ca2-0289-4e5a-bbf0-37a7622684bb',
              fromUserAgent: '222154db-e09d-4d91-8247-8021ad3d25a3',
              public: 1,
              category: '60703618-586a-451d-ab87-6c9b50d565c3',
              indexable: 1,
              deleted: 0,
              created_at: '2022-05-26T15:39:36.000Z',
              updated_at: '2022-05-26T15:39:36.000Z',
              deleted_at: null,
              duplicable: 1,
              downloadable: true,
              tags: [],
              pinned: false,
            },
            clues: null,
            category: '47f2ed6f-7921-4dd3-9d15-37e43a428f13',
            properties: {
              responses: [
                {
                  value: {
                    image: {
                      id: 'c944a4fb-76f5-41a7-949f-2e9608d51385@1.0.0',
                      name: 'Image question Response 0',
                      tagline: null,
                      description: 'Pregunta 2 - Caption respuesta 1',
                      color: null,
                      cover: {
                        id: 'ef60014d-03c5-4a08-b841-1d956831d224',
                        provider: 'leebrary-aws-s3',
                        type: 'image/jpeg',
                        extension: 'jpeg',
                        name: 'Image question Response 0',
                        uri: 'leemons/leebrary/ef60014d-03c5-4a08-b841-1d956831d224.jpeg',
                        metadata:
                          '{"size":"107.3 KB","format":"JPEG","width":"1024","height":"683"}',
                        deleted: 0,
                        created_at: '2022-05-26T15:39:34.000Z',
                        updated_at: '2022-05-26T15:39:35.000Z',
                        deleted_at: null,
                      },
                      fromUser: 'a3d16ca2-0289-4e5a-bbf0-37a7622684bb',
                      fromUserAgent: '222154db-e09d-4d91-8247-8021ad3d25a3',
                      public: 1,
                      category: '60703618-586a-451d-ab87-6c9b50d565c3',
                      indexable: 1,
                      deleted: 0,
                      created_at: '2022-05-26T15:39:35.000Z',
                      updated_at: '2022-05-26T15:39:35.000Z',
                      deleted_at: null,
                      duplicable: 1,
                      downloadable: true,
                      tags: [],
                      pinned: false,
                    },
                    explanation:
                      '<p style="margin-left: 0px!important;">Pregunta 2 - Explicación respuesta 1</p>',
                    imageDescription: 'Pregunta 2 - Caption respuesta 1',
                    isCorrectResponse: true,
                  },
                },
                {
                  value: {
                    image: {
                      id: '77e6de4c-c740-42eb-94b9-f81d0d042414@1.0.0',
                      name: 'Image question Response 1',
                      tagline: null,
                      description: 'Pregunta 2 - Caption respuesta 2',
                      color: null,
                      cover: {
                        id: '8fa59db4-5de3-46ba-914a-bceb8db7bbf0',
                        provider: 'leebrary-aws-s3',
                        type: 'image/jpeg',
                        extension: 'jpeg',
                        name: 'Image question Response 1',
                        uri: 'leemons/leebrary/8fa59db4-5de3-46ba-914a-bceb8db7bbf0.jpeg',
                        metadata:
                          '{"size":"24.4 KB","format":"JPEG","width":"1024","height":"683"}',
                        deleted: 0,
                        created_at: '2022-05-26T15:39:34.000Z',
                        updated_at: '2022-05-26T15:39:35.000Z',
                        deleted_at: null,
                      },
                      fromUser: 'a3d16ca2-0289-4e5a-bbf0-37a7622684bb',
                      fromUserAgent: '222154db-e09d-4d91-8247-8021ad3d25a3',
                      public: 1,
                      category: '60703618-586a-451d-ab87-6c9b50d565c3',
                      indexable: 1,
                      deleted: 0,
                      created_at: '2022-05-26T15:39:35.000Z',
                      updated_at: '2022-05-26T15:39:35.000Z',
                      deleted_at: null,
                      duplicable: 1,
                      downloadable: true,
                      tags: [],
                      pinned: false,
                    },
                    explanation:
                      '<p style="margin-left: 0px!important;">Pregunta 2 - Explicación respuesta 2</p>',
                    imageDescription: 'Pregunta 2 - Caption respuesta 2',
                    isCorrectResponse: false,
                  },
                },
              ],
              explanation: '<p style="margin-left: 0px!important;"></p>',
              explanationInResponses: true,
            },
            deleted: 0,
            created_at: '2022-05-26T15:39:36.000Z',
            updated_at: '2022-05-26T15:39:36.000Z',
            deleted_at: null,
            tags: [],
            questionImageDescription: null,
          },
          {
            id: 'c16031e7-592d-4f67-9885-7beb40cb0e8c',
            questionBank: '09080890-f570-491b-afd4-323aaacb2356@1.0.0',
            type: 'mono-response',
            withImages: null,
            level: 'elementary',
            question: '<p style="margin-left: 0px!important;">Pregunta 1 - Soy el enunciado</p>',
            questionImage: null,
            clues: [{ value: 'Pregunta 1 - Soy una pista' }],
            category: '47f2ed6f-7921-4dd3-9d15-37e43a428f13',
            properties: {
              responses: [
                { value: { response: 'Pregunta 1 - Respuesta 1', isCorrectResponse: false } },
                {
                  value: {
                    response: 'Pregunta 1 - Respuesta 2',
                    explanation: null,
                    isCorrectResponse: true,
                  },
                },
              ],
              explanation:
                '<p style="margin-left: 0px!important;">Pregunta 1 - Soy la explicación general o de la respuesta correcta</p>',
            },
            deleted: 0,
            created_at: '2022-05-26T15:39:34.000Z',
            updated_at: '2022-05-26T15:39:34.000Z',
            deleted_at: null,
            tags: [],
          },
        ],
      },
      tags: ['un-tag'],
      pinned: false,
    },
    tags: ['un-tag'],
    tagline: 'Subtítulo del qbank',
    description: 'Descripción del qbank',
    color: '#d98c8c',
    cover: null,
    categories: [{ value: 'Categoría para el qbank', id: '47f2ed6f-7921-4dd3-9d15-37e43a428f13' }],
    subjects: ['e77cec64-a462-4d8a-a34f-e80688cb22bb'],
    questions: [
      {
        id: '7f77f4e1-664a-477f-bc45-f4adf2666ea5',
        questionBank: '09080890-f570-491b-afd4-323aaacb2356@1.0.0',
        type: 'mono-response',
        withImages: 1,
        level: 'intermediate',
        question: '<p style="margin-left: 0px!important;">Pregunta 2 - Soy el enunciado</p>',
        questionImage: '0a1d069b-a423-4d66-9b52-0a31c3700e03',
        clues: null,
        category: '47f2ed6f-7921-4dd3-9d15-37e43a428f13',
        properties: {
          responses: [
            {
              value: {
                image: 'ef60014d-03c5-4a08-b841-1d956831d224',
                explanation:
                  '<p style="margin-left: 0px!important;">Pregunta 2 - Explicación respuesta 1</p>',
                imageDescription: 'Pregunta 2 - Caption respuesta 1',
                isCorrectResponse: true,
              },
            },
            {
              value: {
                image: '8fa59db4-5de3-46ba-914a-bceb8db7bbf0',
                explanation:
                  '<p style="margin-left: 0px!important;">Pregunta 2 - Explicación respuesta 2</p>',
                imageDescription: 'Pregunta 2 - Caption respuesta 2',
                isCorrectResponse: false,
              },
            },
          ],
          explanation: '<p style="margin-left: 0px!important;"></p>',
          explanationInResponses: true,
        },
        deleted: 0,
        created_at: '2022-05-26T15:39:36.000Z',
        updated_at: '2022-05-26T15:39:36.000Z',
        deleted_at: null,
        tags: [],
        questionImageDescription: null,
      },
      {
        id: 'c16031e7-592d-4f67-9885-7beb40cb0e8c',
        questionBank: '09080890-f570-491b-afd4-323aaacb2356@1.0.0',
        type: 'mono-response',
        withImages: null,
        level: 'elementary',
        question: '<p style="margin-left: 0px!important;">Pregunta 1 - Soy el enunciado</p>',
        questionImage: null,
        clues: [{ value: 'Pregunta 1 - Soy una pista' }],
        category: '47f2ed6f-7921-4dd3-9d15-37e43a428f13',
        properties: {
          responses: [
            { value: { response: 'Pregunta 1 - Respuesta 1', isCorrectResponse: false } },
            {
              value: {
                response: 'Pregunta 1 - Respuesta 2',
                explanation: null,
                isCorrectResponse: true,
              },
            },
          ],
          explanation:
            '<p style="margin-left: 0px!important;">Pregunta 1 - Soy la explicación general o de la respuesta correcta</p>',
        },
        deleted: 0,
        created_at: '2022-05-26T15:39:34.000Z',
        updated_at: '2022-05-26T15:39:34.000Z',
        deleted_at: null,
        tags: [],
      },
      {
        type: 'map',
        level: 'advanced',
        question: '<p style="margin-left: 0px!important;">Pregunta 3 - Soy el Enunciado</p>',
        properties: {
          image: 'ae05fb73-216a-4d9e-8ca1-722e0669d1fb',
          markers: {
            list: [
              { left: '40.147329650092075%', top: '46.32973090222398%', response: 'Cáceres' },
              {
                left: '57.73334502616271%',
                top: '30.160897247776656%',
                hideOnHelp: true,
                response: 'Zamora',
              },
              { left: '61.225603398715734%', top: '46.4930524542891%', response: 'Ávila' },
            ],
            type: 'numbering',
            backgroundColor: '#3B76CC',
            position: { left: '97.89431631052257%', top: '88.14004823089584%' },
          },
          explanation: '<p style="margin-left: 0px!important;">Pregunta 3 - Soy la Explicación</p>',
        },
        clues: [{ value: 'Pregunta 3 - Soy una pista' }],
      },
    ],
  };

  return { items, questions };
}

module.exports = importQuestions;
