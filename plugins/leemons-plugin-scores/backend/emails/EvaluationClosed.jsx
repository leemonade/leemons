import React from 'react';
import EmailLayout from '@leemons/emails/src/emails/EmailLayout.jsx';
import { Button, Container, Text } from '@react-email/components';
import PropTypes from 'prop-types';

import ActivityCardIcon from './components/ActivityCardIcon';

const IS_DEV_MODE = String(process?.env?.EMAIL_DEV) === 'true';

const messages = {
  en: {
    title: 'Evaluation closed',
    subtitle: 'We would like to inform you that on {{it.date}}',
    subtitle2: '',
    subtitle3: 'for this subject has been closed',

    yourGrade: 'Your grade was:',
    buttonText: 'Access evaluation',

    reminderText: 'Remember that you can manage communications from the',
    emailPreferences: 'email preferences',
    profileText: 'in your profile',
  },
  es: {
    title: 'Evaluación finalizada',
    subtitle: 'Te comunicamos que con fecha {{it.date}}',
    subtitle2: 'ha finalizado la',
    subtitle3: 'de la asignatura',

    yourGrade: 'Tu nota ha sido:',
    buttonText: 'Acceder a la evaluación',

    reminderText: 'Recuerda que puedes gestionar las comunicaciones desde las',
    emailPreferences: 'preferencias de correo',
    profileText: 'de tu perfil',
  },
};

function EvaluationClosedEmail({
  locale = 'es',
  date,
  periodName = '{{it.periodName}}',
  subjectName = '{{it.subjectName}}',
  subjectIcon = '{{it.subjectIconUrl}}',
  subjectColor = '{{it.subjectColor}}',
  gradeLetter = '{{it.gradeLetter}}',
  gradeInt = '{{it.gradeInt}}',
  gradeDecimals = '{{it.gradeDecimals}}',
  gradeLabel = '{{it.gradeLabel}}',

  ifSubjectIcon = '{{ @if (it.subjectIconUrl) }}',
  ifSingleSubject = '{{ @if (it.classes?.length === 1) }}',
  ifGradeLetter = '{{ @if (it.gradeLetter) }}',
  ifGradeInt = '{{ @if (it.gradeInt) }}',
  ifGradeDecimals = '{{ @if (it.gradeDecimals) }}',
  endIf = '{{ /if }}',
  elseIf = '{{ #else }}',
}) {
  const t = messages[locale];
  const previewText = `${t.title} - ${subjectName}`;

  return (
    <EmailLayout previewText={previewText} title={t.title} locale={locale}>
      <Container className="text-center">
        <Text className="text-[14px] leading-5 mb-0">{t.subtitle}</Text>
        <Text className="text-[14px] leading-5 mt-0">
          {t.subtitle2 ? `${t.subtitle2} ` : ''}
          <b>{periodName}</b> {t.subtitle3}
        </Text>
      </Container>

      <Container className="text-center">
        <ActivityCardIcon
          locale={locale}
          subjectName={subjectName}
          subjectIcon={subjectIcon}
          subjectColor={subjectColor}
          ifSubjectIcon={ifSubjectIcon}
          ifSingleSubject={ifSingleSubject}
          endIf={endIf}
          elseIf={elseIf}
        />
      </Container>

      <Container className="text-center">
        <Text className="text-[14px] leading-5 mb-4">{t.yourGrade}</Text>

        <Container className="bg-[#F2F4F8] rounded-sm mb-[10px] mt-[10px] w-[160px] mx-auto border-solid border-[#DDE1E6] border">
          {ifGradeInt}
          <Text className="mb-0 font-bold">
            <span style={{ fontSize: '48px', lineHeight: '48px' }}>{gradeInt}</span>
            {ifGradeDecimals}
            <span style={{ fontSize: '28px', lineHeight: '28px' }}>.{gradeDecimals}</span>
            {endIf}
          </Text>
          {endIf}
          {ifGradeLetter}
          <Text className="mb-0 font-bold text-[48px] leading-[48px]">{gradeLetter}</Text>
          {endIf}
          <Text className="text-[14px] text-gray-600 mt-0">{gradeLabel}</Text>
        </Container>
      </Container>

      <Button
        href="{{it.evaluationUrl}}"
        className="bg-[#B4E600] py-3 mt-4 px-4 rounded text-black text-[14px] no-underline text-center block w-full max-w-[160px] mx-auto"
      >
        {t.buttonText}
      </Button>

      <Text className="text-[12px] text-gray-500 mt-6 mb-0 text-center">{t.reminderText}</Text>
      <Text className="text-[12px] text-gray-500 mt-0 text-center">
        <a href="{{it.preferencesUrl}}" className="text-black underline">
          {t.emailPreferences}
        </a>{' '}
        {t.profileText}
      </Text>
    </EmailLayout>
  );
}

const DEV_PROPS = {
  locale: 'es',
  date: '2025-02-06',
  periodName: '2024-2025',
  subjectName: 'Educación cívica',
  subjectIcon: 'https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/PHYSICS_7529c954d8.svg',
  subjectColor: '#FABADA',
  grade: 9.76,
  gradeLabel: 'Sobresaliente',

  ifSubjectIcon: '',
  ifSingleSubject: '',
  endIf: '',
  elseIf: '',
};

const PROD_PROPS = {
  periodName: '{{it.periodName}}',
  subjectName: '{{it.subjectName}}',
  subjectIcon: '{{it.subjectIconUrl}}',
  subjectColor: '{{it.subjectColor}}',
  grade: '{{it.grade}}',
  gradeLabel: '{{it.gradeLabel}}',
  gradeLetter: '{{it.gradeLetter}}',
  ifGradeLetter: '{{ @if (it.gradeLetter) }}',
  ifGradeInt: '{{ @if (it.gradeInt) }}',
  ifGradeDecimals: '{{ @if (it.gradeDecimals) }}',
  ifSubjectIcon: '{{ @if (it.subjectIconUrl) }}',
  ifSingleSubject: '{{ @if (it.classes?.length === 1) }}',
  endIf: '{{ /if }}',
  elseIf: '{{ #else }}',
};

EvaluationClosedEmail.propTypes = {
  locale: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  periodName: PropTypes.string.isRequired,
  subjectName: PropTypes.string.isRequired,

  subjectIcon: PropTypes.string.isRequired,
  subjectColor: PropTypes.string.isRequired,
  gradeLetter: PropTypes.string,
  gradeInt: PropTypes.number,
  gradeDecimals: PropTypes.number,
  gradeLabel: PropTypes.string.isRequired,

  ifSubjectIcon: PropTypes.string.isRequired,
  ifSingleSubject: PropTypes.string.isRequired,
  ifGradeLetter: PropTypes.string.isRequired,
  ifGradeInt: PropTypes.string.isRequired,
  ifGradeDecimals: PropTypes.string.isRequired,
  endIf: PropTypes.string.isRequired,
  elseIf: PropTypes.string.isRequired,
};

EvaluationClosedEmail.defaultProps = IS_DEV_MODE ? DEV_PROPS : PROD_PROPS;

export default EvaluationClosedEmail;
