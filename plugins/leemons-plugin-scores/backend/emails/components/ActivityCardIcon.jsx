import React from 'react';
import { Container, Section, Text, Img } from '@react-email/components';
import PropTypes from 'prop-types';

const IS_DEV_MODE = String(process?.env?.EMAIL_DEV) === 'true';

const messages = {
  en: {
    multiSubjects: 'Multi-Subject',
  },
  es: {
    multiSubjects: 'Multi-Asignatura',
  },
};

export default function ActivityCardIcon({
  subjectColor,
  subjectIcon,
  locale = 'es',
  subjectName,
  ifSubjectIcon = '{{ @if (it.subjectIconUrl) }}',
  ifSingleSubject = '{{ @if (it.classes?.length === 1) }}',
  endIf = '{{ /if }}',
  elseIf = '{{ #else }}',
}) {
  return (
    <Section>
      <Container
        className="rounded-full  w-[24px] h-[24px]"
        style={{ backgroundColor: `${subjectColor}` }}
      >
        {ifSubjectIcon}
        <Img
          src={subjectIcon}
          width="13px"
          height="13px"
          className="mx-auto"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        {endIf}
      </Container>
      <Container className="mt-2">
        <Text className="leading-5 m-0">
          <span className="text-[14px]">
            {ifSingleSubject}
            {subjectName}
            {elseIf}
            {messages[locale].multiSubjects}
            {endIf}
          </span>
        </Text>
      </Container>
    </Section>
  );
}

const DEV_PROPS = {
  locale: 'es',
  subjectColor: '#FABADA',
  subjectIcon: 'https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/PHYSICS_7529c954d8.svg',
  subjectName: 'Educación cívica',
  ifSubjectIcon: '',
  ifSingleSubject: '',
  endIf: '',
  elseIf: '',
};

if (IS_DEV_MODE) {
  ActivityCardIcon.defaultProps = DEV_PROPS;
}

ActivityCardIcon.propTypes = {
  subjectColor: PropTypes.string.isRequired,
  subjectIcon: PropTypes.string.isRequired,
  ifSubjectIcon: PropTypes.string.isRequired,
  ifSingleSubject: PropTypes.string.isRequired,
  endIf: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  subjectName: PropTypes.string.isRequired,
  elseIf: PropTypes.string.isRequired,
};
