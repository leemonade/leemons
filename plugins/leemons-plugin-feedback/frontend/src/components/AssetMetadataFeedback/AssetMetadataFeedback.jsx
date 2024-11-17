/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useState } from 'react';
import { Box, Text, HtmlText, TextClamp } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { AssetMetadataFeedbackStyles } from './AssetMetadataFeedback.styles';
import {
  ASSET_METADATA_FEEDBACK_DEFAULT_PROPS,
  ASSET_METADATA_FEEDBACK_PROP_TYPES,
} from './AssetMetadataFeedback.constants';
import { FeedbackCardIcon } from '../FeedbackCardIcon';
import { getFeedbackRequest } from '../../request';

const AssetMetadataFeedback = ({ metadata }) => {
  const [t] = useTranslateLoader(prefixPN('feedbackDrawerDetail'));
  const [data, setData] = useState(null);
  const [fields, setFields] = useState();
  const getQuestionSurveyData = () =>
    getFeedbackRequest(metadata?.providerData?.id).then((res) => setData(res.feedback));
  useEffect(() => {
    if (metadata?.providerData?.id) {
      getQuestionSurveyData();
    }
  }, [metadata]);
  const { classes } = AssetMetadataFeedbackStyles({}, { name: 'AssetMetadataFeedback' });
  const getFieldsToRender = (dataSurvey) => {
    const cuestionsNumber = Array.isArray(dataSurvey.questions) ? dataSurvey.questions.length : 0;
    let singleResponse = 0;
    let multiResponse = 0;
    let likertScale = 0;
    let netPromoterScore = 0;
    let openResponse = 0;
    const introduction = dataSurvey?.introductoryText;
    if (Array.isArray(dataSurvey.questions) && dataSurvey.questions.length >= 1) {
      dataSurvey.questions.forEach((question) => {
        if (question.type === 'singleResponse') singleResponse += 1;
        if (question.type === 'multiResponse') multiResponse += 1;
        if (question.type === 'likertScale') likertScale += 1;
        if (question.type === 'netPromoterScore') netPromoterScore += 1;
        if (question.type === 'openResponse') openResponse += 1;
      });
    }
    return {
      cuestionsNumber,
      netPromoterScore,
      singleResponse,
      multiResponse,
      likertScale,
      openResponse,
      introduction,
    };
  };

  useEffect(() => {
    if (data) {
      setFields(getFieldsToRender(data));
    }
  }, [data]);

  if (!fields) return null;

  return (
    <Box>
      <Box className={classes.typologyContainer}>
        <FeedbackCardIcon width={24} height={24} />
        <Text className={classes.value}>{t('survey')}</Text>
      </Box>
      <Box className={classes.box}>
        <Box>
          <Text className={classes.title}>{`${t('questions')}: `}</Text>
          <Text className={classes.value}>{fields.cuestionsNumber}</Text>
        </Box>
        {fields.multiResponse && (
          <Box>
            <Text className={classes.title}>{`${t('multiAnswer')}: `}</Text>
            <Text className={classes.value}>{fields.multiResponse}</Text>
          </Box>
        )}
        {fields.openResponse && (
          <Box>
            <Text className={classes.title}>{`${t('open')}: `}</Text>
            <Text className={classes.value}>{fields.openResponse}</Text>
          </Box>
        )}
        {fields.netPromoterScore && (
          <Box>
            <Text className={classes.title}>{`${t('nps')}: `}</Text>
            <Text className={classes.value}>{fields.netPromoterScore}</Text>
          </Box>
        )}
        {fields.likertScale && (
          <Box>
            <Text className={classes.title}>{`${t('likert')}: `}</Text>
            <Text className={classes.value}>{fields.likertScale}</Text>
          </Box>
        )}
      </Box>
      {!!fields?.introduction && (
        <Box className={classes.box}>
          <Text className={classes.value}>{`${t('introduction')}: `}</Text>
          <TextClamp lines={3} withToggle showMore={t('viewMore')} showLess={t('viewLess')}>
            <Text>
              <HtmlText>{fields?.introduction}</HtmlText>
            </Text>
          </TextClamp>
        </Box>
      )}
    </Box>
  );
};
AssetMetadataFeedback.propTypes = ASSET_METADATA_FEEDBACK_PROP_TYPES;
AssetMetadataFeedback.defaultProps = ASSET_METADATA_FEEDBACK_DEFAULT_PROPS;
AssetMetadataFeedback.displayName = 'AssetMetadataFeedback';

export default AssetMetadataFeedback;
export { AssetMetadataFeedback };
