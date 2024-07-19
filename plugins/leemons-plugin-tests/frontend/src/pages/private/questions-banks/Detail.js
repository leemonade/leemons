/* eslint-disable camelcase */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { isEmpty, omit } from 'lodash';

import {
  LoadingOverlay,
  TotalLayoutContainer,
  TotalLayoutHeader,
  VerticalStepperContainer,
} from '@bubbles-ui/components';

import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useLayout } from '@layout/context';
import { QuestionBankIcon } from '@tests/components/Icons/QuestionBankIcon';
import { getQuestionBankRequest, saveQuestionBankRequest } from '../../../request';
import DetailBasic from './components/DetailBasic';
import DetailQuestions from './components/DetailQuestions';

const mapQuestion = {
  id: 'lrn:local:tests:local:665a05e7a5fe771aef0e881d:Questions:6696312aa713e459a23e67b6',
  tags: null,
  type: 'map',
  stem: {
    format: 'html',
    text: '<p style="margin-left: 0px!important;">Enunciado</p>',
  },
  hasEmbeddedAnswers: false,
  hasImageAnswers: false,
  globalFeedback: {
    format: 'html',
    text: '<p style="margin-left: 0px!important;">Explicación</p>',
  },
  hasAnswerFeedback: false,
  clues: ['Pista de texto'],
  category:
    'lrn:local:tests:local:665a05e7a5fe771aef0e881d:QuestionBankCategories:6696312aa713e459a23e6730',
  level: 'beginner',
  mapProperties: {
    image: {
      _id: '6696312ab6801f025aaa37a2',
      id: 'lrn:local:common:local:665a05e7a5fe771aef0e881d:CurrentVersions:6696312aa713e459a23e6744@1.0.0',
      deploymentID: '665a05e7a5fe771aef0e881d',
      name: 'Image question',
      cover: {
        _id: '6695560e9dd680cf0b2bf6fa',
        id: 'lrn:local:leebrary:local:665a05e7a5fe771aef0e881d:Files:6695560eb4a8956d29bc8081',
        deploymentID: '665a05e7a5fe771aef0e881d',
        provider: 'leebrary-aws-s3',
        type: 'image/png',
        extension: 'png',
        name: 'cover',
        size: 24130,
        uri: 'leemons/665a05e7a5fe771aef0e881d/leebrary/lrn:local:leebrary:local:665a05e7a5fe771aef0e881d:Files:6695560eb4a8956d29bc8081.png',
        isFolder: false,
        metadata: '{"size":"23.6 KB","format":"JPEG","width":"400","height":"600"}',
        isDeleted: false,
        deletedAt: null,
        createdAt: '2024-07-15T17:02:06.960Z',
        updatedAt: '2024-07-15T17:02:08.854Z',
        __v: 0,
        copyright: {
          author: 'micheile henderson',
          authorProfileUrl: 'https://unsplash.com/@micheile?utm_source=leemons&utm_medium=referral',
          providerUrl: 'https://unsplash.com/?utm_source=leemons&utm_medium=referral',
          provider: 'unsplash',
        },
        externalUrl:
          'https://images.unsplash.com/photo-1678188466220-07a6f395ecfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MTkwMzR8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjEwNjI4OTd8&ixlib=rb-4.0.3&q=80&w=1080',
      },
      fromUser: 'lrn:local:users:local:665a05e7a5fe771aef0e881d:Users:665a05f38e2c5a70486025c5',
      fromUserAgent:
        'lrn:local:users:local:665a05e7a5fe771aef0e881d:UserAgent:668fd3fadce977b2dd145496',
      public: true,
      category:
        'lrn:local:leebrary:local:665a05e7a5fe771aef0e881d:Categories:665a05ee8e2c5a7048602414',
      indexable: false,
      isCover: false,
      isDeleted: false,
      deletedAt: null,
      createdAt: '2024-07-16T08:36:58.315Z',
      updatedAt: '2024-07-16T08:36:58.315Z',
      __v: 0,
      permissions: {
        viewer: [],
        editor: [],
      },
      duplicable: true,
      downloadable: true,
      tags: [],
      pinned: false,
    },
    imagePosition: {
      left: '94.65910298607658%',
      top: '84.50142415364583%',
    },
    caption: 'Texto alt',
    markers: {
      backgroundColor: '#3B76CC',
      type: 'numbering',
      list: [
        {
          response: 'Hilo',
          hideOnHelp: false,
          left: '52.90909980080413%',
          top: '29.168090820312496%',
        },
        {
          response: 'Joyería',
          hideOnHelp: true,
          left: '34.15909837029254%',
          top: '40.834757486979164%',
        },
        {
          response: 'Planta',
          hideOnHelp: false,
          left: '77.9091017081529%',
          top: '72.83475748697916%',
        },
      ],
    },
  },
  hasHelp: true,
};
const monoBasicQuestion = {
  id: 'lrn:local:tests:local:665a05e7a5fe771aef0e881d:Questions:66911fd4c00cae40605a0728',
  tags: null,
  type: 'mono-response',
  withQuestionImage: false,
  stem: {
    format: 'html',
    text: '<p style="margin-left: 0px!important;">Con categoría 1 (no había ninguna opción antes)</p>',
  },
  hasEmbeddedAnswers: false,
  globalFeedback: null,
  hasAnswerFeedback: false,
  clues: [],
  category:
    'lrn:local:tests:local:665a05e7a5fe771aef0e881d:QuestionBankCategories:66911fd4c00cae40605a0724',
  choices: [
    {
      isCorrect: true,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 1',
      },
      feedback: null,
    },
    {
      isCorrect: false,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 2',
      },
      feedback: null,
    },
  ],
};
const monoLevel = {
  id: 'lrn:local:tests:local:665a05e7a5fe771aef0e881d:Questions:66911fd4c00cae40605a0726',
  tags: null,
  type: 'mono-response',
  stem: {
    format: 'html',
    text: '<p style="margin-left: 0px!important;">Con nivel</p>',
  },
  hasEmbeddedAnswers: false,
  globalFeedback: null,
  hasAnswerFeedback: false,
  clues: [],
  category: null,
  level: 'beginner',
  choices: [
    {
      isCorrect: true,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 1',
      },
      feedback: null,
    },
    {
      isCorrect: false,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 2',
      },
      feedback: null,
    },
  ],
};

const monoGlobalExplanation = {
  id: 'lrn:local:tests:local:665a05e7a5fe771aef0e881d:Questions:66911fd4c00cae40605a0734',
  tags: null,
  type: 'mono-response',
  stem: {
    format: 'html',
    text: '<p style="margin-left: 0px!important;">Con explicación global.</p>',
  },
  hasEmbeddedAnswers: false,
  globalFeedback: {
    format: 'html',
    text: '<p style="margin-left: 0px!important;">Explicación global de la pregunta</p>',
  },
  hasAnswerFeedback: false,
  clues: [],
  category: null,
  choices: [
    {
      isCorrect: true,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 1',
      },
      feedback: null,
    },
    {
      isCorrect: false,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 2',
      },
      feedback: null,
    },
  ],
};

const monoFeaturedImage = {
  id: 'lrn:local:tests:local:665a05e7a5fe771aef0e881d:Questions:66911fd4c00cae40605a0787',
  tags: null,
  type: 'mono-response',
  stem: {
    format: 'html',
    text: '<p style="margin-left: 0px!important;">Pregunta con imagen destacada</p>',
  },
  hasEmbeddedAnswers: false,
  globalFeedback: null,
  hasAnswerFeedback: false,
  clues: [],
  category: null,
  choices: [
    {
      isCorrect: true,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 1',
      },
      feedback: null,
    },
    {
      isCorrect: false,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 2',
      },
      feedback: null,
    },
  ],
  questionImage: {
    _id: '66911fd4024d3485f91da8b1',
    id: 'lrn:local:common:local:665a05e7a5fe771aef0e881d:CurrentVersions:66911fd4c00cae40605a0736@1.0.0',
    deploymentID: '665a05e7a5fe771aef0e881d',
    name: 'Image question',
    cover: {
      _id: '668fd3abaf508021a39c8618',
      id: 'lrn:local:leebrary:local:665a05e7a5fe771aef0e881d:Files:668fd3abdce977b2dd1450a2',
      deploymentID: '665a05e7a5fe771aef0e881d',
      provider: 'leebrary-aws-s3',
      type: 'image/jpeg',
      extension: 'jpeg',
      name: 'brett-jordan-Fp4ERdkR5jU-unsplash',
      size: 25438,
      uri: 'leemons/665a05e7a5fe771aef0e881d/leebrary/lrn:local:leebrary:local:665a05e7a5fe771aef0e881d:Files:668fd3abdce977b2dd1450a2.jpeg',
      metadata: '{"size":"24.8 KB","format":"JPEG","width":"800","height":"600"}',
      isDeleted: false,
      deletedAt: null,
      createdAt: '2024-07-11T12:44:27.015Z',
      updatedAt: '2024-07-11T12:44:27.243Z',
      __v: 0,
    },
    fromUser: 'lrn:local:users:local:665a05e7a5fe771aef0e881d:Users:665a05f38e2c5a70486025c5',
    fromUserAgent:
      'lrn:local:users:local:665a05e7a5fe771aef0e881d:UserAgent:668fd3fadce977b2dd145496',
    public: true,
    category:
      'lrn:local:leebrary:local:665a05e7a5fe771aef0e881d:Categories:665a05ee8e2c5a7048602414',
    indexable: false,
    isCover: false,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2024-07-12T12:21:40.331Z',
    updatedAt: '2024-07-12T12:21:40.331Z',
    __v: 0,
    permissions: {
      viewer: [],
      editor: [],
    },
    duplicable: true,
    downloadable: true,
    tags: [],
    pinned: false,
  },
};

const monoCategory = {
  id: 'lrn:local:tests:local:665a05e7a5fe771aef0e881d:Questions:66911fd4c00cae40605a0728',
  tags: null,
  type: 'mono-response',
  stem: {
    format: 'html',
    text: '<p style="margin-left: 0px!important;">Con categoría 1 (no había ninguna opción antes)</p>',
  },
  hasEmbeddedAnswers: false,
  globalFeedback: null,
  hasAnswerFeedback: false,
  clues: [],
  category:
    'lrn:local:tests:local:665a05e7a5fe771aef0e881d:QuestionBankCategories:6696644ca713e459a23e6a6f',
  choices: [
    {
      isCorrect: true,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 1',
      },
      feedback: null,
    },
    {
      isCorrect: false,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 2',
      },
      feedback: null,
    },
  ],
};

const monoFeedbackByAnswer = {
  id: 'lrn:local:tests:local:665a05e7a5fe771aef0e881d:Questions:66911fd4c00cae40605a0732',
  tags: null,
  type: 'mono-response',
  stem: {
    format: 'html',
    text: '<p style="margin-left: 0px!important;">Con explicación por cada opción de respuesta. (deshabilita explicación global).</p>',
  },
  hasEmbeddedAnswers: false,
  globalFeedback: null,
  hasAnswerFeedback: true,
  clues: [],
  category: null,
  choices: [
    {
      isCorrect: true,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 1',
      },
      feedback: {
        format: 'plain',
        text: 'Explicación Respuesta 1',
      },
    },
    {
      isCorrect: false,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 2',
      },
      feedback: {
        format: 'plain',
        text: 'Explicación Respuesta 2',
      },
    },
  ],
};

const monoImageAnswers = {
  id: 'lrn:local:tests:local:665a05e7a5fe771aef0e881d:Questions:66911fd4c00cae40605a0793',
  tags: null,
  type: 'mono-response',
  stem: {
    format: 'html',
    text: '<p style="margin-left: 0px!important;">Pregunta con imágenes en las respuestas.</p>',
  },
  hasEmbeddedAnswers: false,
  hasImageAnswers: true,
  globalFeedback: null,
  clues: [],
  category: null,
  choices: [
    {
      isCorrect: true,
      weight: null,
      image: {
        _id: '66911fd4024d3485f91da8f1',
        id: 'lrn:local:common:local:665a05e7a5fe771aef0e881d:CurrentVersions:66911fd4c00cae40605a073e@1.0.0',
        deploymentID: '665a05e7a5fe771aef0e881d',
        name: 'Image question Response 0',
        description: 'Respuesta 1',
        cover: {
          _id: '668fd3a3af508021a39c8494',
          id: 'lrn:local:leebrary:local:665a05e7a5fe771aef0e881d:Files:668fd3a3dce977b2dd145051',
          deploymentID: '665a05e7a5fe771aef0e881d',
          provider: 'leebrary-aws-s3',
          type: 'image/svg+xml',
          extension: 'svg',
          name: 'Practices ico',
          size: 12490,
          uri: 'leemons/665a05e7a5fe771aef0e881d/leebrary/lrn:local:leebrary:local:665a05e7a5fe771aef0e881d:Files:668fd3a3dce977b2dd145051.svg',
          metadata: '{"size":"12.2 KB"}',
          isDeleted: false,
          deletedAt: null,
          createdAt: '2024-07-11T12:44:19.564Z',
          updatedAt: '2024-07-11T12:44:19.757Z',
          __v: 0,
        },
        fromUser: 'lrn:local:users:local:665a05e7a5fe771aef0e881d:Users:665a05f38e2c5a70486025c5',
        fromUserAgent:
          'lrn:local:users:local:665a05e7a5fe771aef0e881d:UserAgent:668fd3fadce977b2dd145496',
        public: true,
        category:
          'lrn:local:leebrary:local:665a05e7a5fe771aef0e881d:Categories:665a05ee8e2c5a7048602414',
        indexable: false,
        isCover: false,
        isDeleted: false,
        deletedAt: null,
        createdAt: '2024-07-12T12:21:40.340Z',
        updatedAt: '2024-07-12T12:21:40.340Z',
        __v: 0,
        permissions: {
          viewer: [],
          editor: [],
        },
        duplicable: true,
        downloadable: true,
        tags: [],
        pinned: false,
      },
      imageDescription: 'Respuesta 1',
      feedback: null,
    },
    {
      isCorrect: false,
      weight: null,
      image: {
        _id: '66911fd4024d3485f91da8c9',
        id: 'lrn:local:common:local:665a05e7a5fe771aef0e881d:CurrentVersions:66911fd4c00cae40605a0740@1.0.0',
        deploymentID: '665a05e7a5fe771aef0e881d',
        name: 'Image question Response 1',
        description: '',
        cover: {
          _id: '668fd3a9af508021a39c85c4',
          id: 'lrn:local:leebrary:local:665a05e7a5fe771aef0e881d:Files:668fd3a9dce977b2dd145091',
          deploymentID: '665a05e7a5fe771aef0e881d',
          provider: 'leebrary-aws-s3',
          type: 'image/svg+xml',
          extension: 'svg',
          name: 'Behavioral frameworks ico',
          size: 11596,
          uri: 'leemons/665a05e7a5fe771aef0e881d/leebrary/lrn:local:leebrary:local:665a05e7a5fe771aef0e881d:Files:668fd3a9dce977b2dd145091.svg',
          metadata: '{"size":"11.3 KB"}',
          isDeleted: false,
          deletedAt: null,
          createdAt: '2024-07-11T12:44:25.415Z',
          updatedAt: '2024-07-11T12:44:25.609Z',
          __v: 0,
        },
        fromUser: 'lrn:local:users:local:665a05e7a5fe771aef0e881d:Users:665a05f38e2c5a70486025c5',
        fromUserAgent:
          'lrn:local:users:local:665a05e7a5fe771aef0e881d:UserAgent:668fd3fadce977b2dd145496',
        public: true,
        category:
          'lrn:local:leebrary:local:665a05e7a5fe771aef0e881d:Categories:665a05ee8e2c5a7048602414',
        indexable: false,
        isCover: false,
        isDeleted: false,
        deletedAt: null,
        createdAt: '2024-07-12T12:21:40.334Z',
        updatedAt: '2024-07-12T12:21:40.334Z',
        __v: 0,
        permissions: {
          viewer: [],
          editor: [],
        },
        duplicable: true,
        downloadable: true,
        tags: [],
        pinned: false,
      },
      imageDescription: '',
      feedback: null,
    },
  ],
};

const monoClues = {
  id: 'lrn:local:tests:local:665a05e7a5fe771aef0e881d:Questions:66911fd4c00cae40605a072e',
  tags: null,
  type: 'mono-response',
  stem: {
    format: 'html',
    text: '<p style="margin-left: 0px!important;">Con pista de texto.</p>',
  },
  hasEmbeddedAnswers: false,
  globalFeedback: null,
  clues: ['Esta es la pista'],
  category: null,
  choices: [
    {
      isCorrect: false,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 1',
      },
      feedback: null,
      hideOnHelp: false,
    },
    {
      isCorrect: true,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 2',
      },
      feedback: null,
      hideOnHelp: false,
    },
    {
      isCorrect: false,
      weight: null,
      text: {
        format: 'plain',
        text: 'Respuesta 3',
      },
      feedback: null,
      hideOnHelp: false,
    },
  ],
  hasHelp: true,
};

export default function Detail(p) {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail'));
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [savingAs, setSavingAs] = useState(null);

  const scrollRef = useRef();
  const history = useHistory();
  const params = useParams();
  const isNew = useMemo(() => !params.id, [params.id]);

  const form = useForm();
  const formValues = form.watch();

  form.register('questions', {
    required: t('questionRequired'),
    validate: (value) => {
      if (value.length === 0) {
        return t('questionRequired');
      }
      return undefined;
    },
  });

  // FUNCTIONS ········································································ |

  async function saveAsDraft() {
    setSavingAs('draft');
    console.log('saveAsDraft');
  }

  async function saveAsPuglished() {
    setSavingAs('published');
    console.log('saveAsPuglished');
  }

  // EFFECTS ········································································ |

  useEffect(() => {
    setIsLoading(true);

    getQuestionBankRequest(params.id)
      .then(
        ({
          // eslint-disable-next-line camelcase
          questionBank: {
            deleted,
            deleted_at,
            created_at,
            updated_at,
            deletedAt,
            createdAt,
            updatedAt,
            ...qBank
          },
        }) => {
          // eslint-disable-next-line no-param-reassign
          qBank.questions = [
            monoBasicQuestion,
            mapQuestion,
            monoLevel,
            monoCategory,
            monoGlobalExplanation,
            monoFeaturedImage,
            monoFeedbackByAnswer,
            monoImageAnswers,
            monoClues,
          ];
          if (qBank.questions?.length > 0) {
            setCurrentStep(1);
          }

          form.reset(qBank);
          setIsLoading(false);
        }
      )
      .catch((error) => {
        addErrorAlert(error);
        setIsLoading(false);
      });
  }, [params, form]);

  if (isLoading) return <LoadingOverlay visible />;

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          icon={<QuestionBankIcon width={23} height={23} />}
          title={isNew ? t('pageTitleNew') : t('pageTitle')}
          formTitlePlaceholder={formValues.name ? formValues.name : t('headerTitlePlaceholder')}
          onCancel={() => history.goBack()}
          mainActionLabel={t('cancel')}
        />
      }
    >
      <VerticalStepperContainer
        scrollRef={scrollRef}
        currentStep={currentStep}
        data={[
          { label: t('basic'), status: 'OK' },
          { label: t('questions'), status: 'OK' },
        ]}
        onChangeActiveIndex={setCurrentStep}
      >
        {currentStep === 0 && (
          <DetailBasic
            t={t}
            form={form}
            savingAs={savingAs}
            stepName={t('basic')}
            scrollRef={scrollRef}
            advancedConfig={{
              alwaysOpen: true,
              program: { show: true, required: false },
              subjects: { show: true, required: true, showLevel: false, maxOne: true },
            }}
            onNext={() => setCurrentStep(1)}
            onSaveDraft={saveAsDraft}
          />
        )}
        {currentStep === 1 || currentStep === 2 ? (
          <DetailQuestions
            t={t}
            form={form}
            savingAs={savingAs}
            scrollRef={scrollRef}
            stepName={t('questions')}
            onPrev={() => setCurrentStep(0)}
            onPublish={saveAsPuglished}
            onSaveDraft={saveAsDraft}
          />
        ) : null}
      </VerticalStepperContainer>
    </TotalLayoutContainer>
  );
}
