import React, { useEffect, useState } from 'react';

import { Box, Text } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { capitalize } from 'lodash';

import { QuestionBankIcon } from '../Icons/QuestionBankIcon';

import {
  ASSET_METADATA_QUESTION_BANK_DEFAULT_PROPS,
  ASSET_METADATA_QUESTION_BANK_PROP_TYPES,
} from './AssetMetadataQuestionBank.constants';
import { AssetMetadataQuestionBankStyles } from './AssetMetadataQuestionBank.styles';

import prefixPN from '@tests/helpers/prefixPN';

const AssetMetadataQuestionBank = ({ metadata }) => {
  const [t] = useTranslateLoader(prefixPN('testsCard'));
  const [fields, setFields] = useState();
  const typologyName = t('questionBank');
  const { classes } = AssetMetadataQuestionBankStyles({}, { name: 'AssetMetadataQuestionBank' });
  const questions = metadata?.providerData?.questions;
  const categories = metadata?.providerData?.categories;
  const getFieldsToRender = (questionsTest, categoriesTest) => {
    const cuestionsNumber = Array.isArray(questionsTest) ? questionsTest.length : 0;
    let singleAnsWers = 0;
    let mapAnswers = 0;
    let trueFalseAnswers = 0;
    let hasHints = false;
    let categoriesStrigified = '';
    if (Array.isArray(questionsTest) && questionsTest.length >= 1) {
      questionsTest.forEach((question) => {
        if (question.type === 'mono-response') singleAnsWers += 1;
        if (question.type === 'map') mapAnswers += 1;
        if (question.type === 'true-false') trueFalseAnswers += 1;
        if (question.clues && question.clues.length) hasHints = true;
      });
    }
    if (Array.isArray(categoriesTest) && categoriesTest.length >= 1) {
      categoriesStrigified = categoriesTest
        .map((category) => category.value)
        .join(', ')
        .toString();
    }
    return {
      cuestionsNumber,
      singleAnsWers,
      mapAnswers,
      trueFalseAnswers,
      hasHints,
      categoriesStrigified,
    };
  };

  useEffect(() => {
    if (metadata) {
      setFields(getFieldsToRender(questions, categories));
    }
  }, [metadata]);

  if (!fields) return null;
  return (
    <Box>
      <Box className={classes.typologyContainer}>
        <QuestionBankIcon width={24} height={24} />
        <Text className={classes.value}>{capitalize(typologyName)}</Text>
      </Box>

      <Box className={classes.box}>
        <Box>
          <Text className={classes.title}>{`${t('questions')} `}</Text>
          <Text className={classes.value}>{fields.cuestionsNumber}</Text>
        </Box>
        <Box>
          <Text className={classes.title}>{`${t('simpleQuestion')}: `}</Text>
          <Text className={classes.value}>{fields.singleAnsWers}</Text>
        </Box>
        <Box>
          <Text className={classes.title}>{`${t('map')}: `}</Text>
          <Text className={classes.value}>{fields.mapAnswers}</Text>
        </Box>
        <Box>
          <Text className={classes.title}>{`${t('trueFalse')}: `}</Text>
          <Text className={classes.value}>{fields.trueFalseAnswers}</Text>
        </Box>
        <Box>
          <Text className={classes.title}>{`${t('hints')}: `}</Text>
          <Text className={classes.value}>{fields.hasHints ? t('yes') : t('no')}</Text>
        </Box>
        <Box>
          <Text className={classes.title}>{`${t('categories')} `}</Text>
          <Text className={classes.value}>{fields.categoriesStrigified}</Text>
        </Box>
      </Box>
    </Box>
  );
};
AssetMetadataQuestionBank.propTypes = ASSET_METADATA_QUESTION_BANK_PROP_TYPES;
AssetMetadataQuestionBank.defaultProps = ASSET_METADATA_QUESTION_BANK_DEFAULT_PROPS;
AssetMetadataQuestionBank.displayName = 'AssetMetadataQuestionBank';

export default AssetMetadataQuestionBank;
export { AssetMetadataQuestionBank };
