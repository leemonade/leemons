import React, { useEffect, useState } from 'react';

import { Box, Text, ImageLoader } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { capitalize } from 'lodash';

import { getQuestionBankRequest } from '../../request';

import {
  ASSET_METADATA_TEST_DEFAULT_PROPS,
  ASSET_METADATA_TEST_PROP_TYPES,
} from './AssetMetadataTest.constants';
import { AssetMetadataTestStyles } from './AssetMetadataTest.styles';

import prefixPN from '@tests/helpers/prefixPN';
import { QUESTION_TYPES } from '@tests/pages/private/questions-banks/questionConstants';

const AssetMetadataTest = ({ metadata, canEdit }) => {
  const [t] = useTranslateLoader(prefixPN('testsCard'));
  const [data, setData] = useState(null);
  const [fields, setFields] = useState();
  const typologyName = metadata?.providerData?.role;
  const getQuestionBankData = () =>
    getQuestionBankRequest(metadata?.providerData?.metadata?.questionBank).then((res) =>
      setData(res.questionBank)
    );
  useEffect(() => {
    if (metadata?.providerData?.metadata?.questionBank) {
      getQuestionBankData();
    }
  }, [metadata]);
  const { classes } = AssetMetadataTestStyles({}, { name: 'AssetMetadataTest' });
  const name = data?.name;
  const questions = data?.questions;
  const categories = data?.categories;
  const getFieldsToRender = (nameTest, questionsTest, categoriesTest) => {
    const titleTest = {
      name: nameTest,
      url: `/private/tests/questions-banks/${data?.asset?.providerData?.id}`,
    };
    const cuestionsNumber = Array.isArray(questionsTest) ? questionsTest.length : 0;
    let singleAnsWers = 0;
    let mapAnswers = 0;
    let trueFalseAnswers = 0;
    let hasHints = false;
    let categoriesStrigified = '';
    if (Array.isArray(questionsTest) && questionsTest.length >= 1) {
      questionsTest.forEach((question) => {
        if (question.type === QUESTION_TYPES.MONO_RESPONSE) singleAnsWers += 1;
        if (question.type === QUESTION_TYPES.MAP) mapAnswers += 1;
        if (question.type === QUESTION_TYPES.TRUE_FALSE) trueFalseAnswers += 1;
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
      titleTest,
      cuestionsNumber,
      singleAnsWers,
      mapAnswers,
      trueFalseAnswers,
      hasHints,
      categoriesStrigified,
    };
  };

  useEffect(() => {
    if (data) {
      setFields(getFieldsToRender(name, questions, categories));
    }
  }, [data]);
  const iconComponent = (
    <ImageLoader
      src={metadata?.providerData?.roleDetails?.icon}
      style={{
        width: 24,
        height: 24,
        position: 'relative',
      }}
      width={24}
      height={24}
    />
  );

  if (!fields) return null;
  return (
    <Box>
      <Box className={classes.typologyContainer}>
        {iconComponent}
        <Text className={classes.value}>{capitalize(typologyName)}</Text>
      </Box>
      <Box className={classes.box}>
        <Text className={classes.title}>{`${t('questionBank')}: `}</Text>
        <Text className={classes.link}>{fields.titleTest.name}</Text>
      </Box>
      <Box>
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
AssetMetadataTest.propTypes = ASSET_METADATA_TEST_PROP_TYPES;
AssetMetadataTest.defaultProps = ASSET_METADATA_TEST_DEFAULT_PROPS;
AssetMetadataTest.displayName = 'AssetMetadataTest';

export default AssetMetadataTest;
export { AssetMetadataTest };
