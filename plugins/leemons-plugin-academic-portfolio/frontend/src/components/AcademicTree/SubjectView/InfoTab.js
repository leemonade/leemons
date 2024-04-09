import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Title, Text } from '@bubbles-ui/components';

const InfoTab = ({ subjectDetails, onlyClassToShow }) => {
  const parsedCourses = useMemo(() => {
  }, [subjectDetails]);
  return (
    <ContextContainer sx={{ padding: 24 }}>
      <ContextContainer>
        <Title>{'Datos básicos 🔫'}</Title>
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
