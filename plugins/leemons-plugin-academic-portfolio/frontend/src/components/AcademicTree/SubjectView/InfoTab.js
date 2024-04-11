import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Title, Text } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';

const InfoTab = ({ subjectDetails, onlyClassToShow }) => {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  return (
    <ContextContainer sx={{ padding: 24 }}>
      <ContextContainer>
        <Title>{t('basicDataTitle')}</Title>
        <Text>{`${'ID'}:${subjectDetails?.internalId}`}</Text>
      </ContextContainer>

      <ContextContainer>
        <Title>{'Icono 🔫'}</Title>
      </ContextContainer>

      <ContextContainer>
        <Title>{'Imagen 🔫'}</Title>
      </ContextContainer>
    </ContextContainer>
  );
};

InfoTab.propTypes = {
  subjectDetails: PropTypes.object,
  onlyClassToShow: PropTypes.oneOfType([PropTypes.object, PropTypes.null]),
};

export default InfoTab;
