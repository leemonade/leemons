import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ContextContainer,
  Title,
  Text,
  Stack,
  Box,
  Paper,
  ImageLoader,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';

const InfoTab = ({ subjectDetails, onlyClassToShow }) => {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const subjectHeaderData = useMemo(() => {
    const subjectData = {};
    const courses = subjectDetails?.classes[0]?.courses?.name;
    subjectData.courses = courses;
    const groups = subjectDetails?.classes
      ?.map((cls) => cls.groups?.name)
      .sort()
      .join(', ');
    subjectData.groups = groups;
    const knowledgeAreas = subjectDetails?.classes[0]?.knowledges?.name;
    subjectData.knowledgeAreas = knowledgeAreas;
    const subjectType = subjectDetails?.classes[0]?.subjectType?.name;
    subjectData.subjectType = subjectType;
    const credits = subjectDetails?.credits;
    subjectData.credits = credits;
    return subjectData;
  }, [subjectDetails, onlyClassToShow]);

  const subjectIcon = getFileUrl(subjectDetails?.icon?.cover?.id);
  const cover = getFileUrl(subjectDetails?.image?.cover?.id);

  return (
    <ContextContainer sx={{ padding: 24 }}>
      <ContextContainer>
        <Title>{t('basicDataTitle')}</Title>
        <Stack spacing={4}>
          <Box>
            <Text strong>{`${t('idLabel')}: `}</Text>
            <Text>{subjectDetails?.internalId}</Text>
          </Box>
          <Box>
            <Text strong>{`${t('courseLabel')}: `}</Text>
            <Text>{subjectHeaderData?.courses}</Text>
          </Box>
          <Box>
            <Text strong>{`${t('groupLabel')}: `}</Text>
            <Text>{subjectHeaderData?.groups}</Text>
          </Box>
          <Box>
            <Text strong>{`${t('knowledgeLabel')}: `}</Text>
            <Text>{subjectHeaderData?.knowledgeAreas}</Text>
          </Box>
          <Box>
            <Text strong>{`${t('subjectTypeLabel')}: `}</Text>
            <Text>{subjectHeaderData?.subjectType}</Text>
          </Box>
          {subjectDetails?.credits && (
            <Box>
              <Text strong>{`${t('creditsLabel')}: `}</Text>
              <Text>{subjectDetails?.credits}</Text>
            </Box>
          )}
        </Stack>
      </ContextContainer>

      <ContextContainer>
        <Title>{t('icon')}</Title>
        <Text>{t('iconDescription')}</Text>
        <Stack>
          <Paper
            shadow="none"
            bordered
            style={{
              minWidth: 282,
              maxHeight: 108,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: subjectDetails?.color,
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                }}
              >
                <ImageLoader src={subjectIcon} width={32} height={32} />
              </Box>
            </Box>
            <Text strong style={{ marginTop: 6 }}>
              {subjectDetails?.name}
            </Text>
          </Paper>
        </Stack>
      </ContextContainer>

      <ContextContainer>
        <Title>{t('image')}</Title>
        <Text>{t('image')}</Text>
        <Stack>
          <Box
            style={{
              borderRadius: 12,
              backgroundImage: `url(${cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: 282,
              height: 108,
            }}
          >
            {/* <ImageLoader src={cover} width={282} height={108} /> */}
          </Box>
        </Stack>
      </ContextContainer>
    </ContextContainer>
  );
};

InfoTab.propTypes = {
  subjectDetails: PropTypes.object,
  onlyClassToShow: PropTypes.oneOfType([PropTypes.object, PropTypes.null]),
};

export default InfoTab;
