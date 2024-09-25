import React from 'react';

import EmailLayout from '@leemons/emails/src/emails/EmailLayout.jsx';
import { Section, Row, Column, Button, Container, Img, Text } from '@react-email/components';

import ActivityCard from './ActivityCard.jsx';
import { DEV_PROPS, PROD_PROPS, PROP_TYPES } from './UserNewAssignation.jsx';

const IS_DEV_MODE = String(process?.env?.EMAIL_DEV) === 'true';

const messages = {
  en: {
    title: 'Pending activity reminder.',
    actionText:
      "This information may have changed, always check your current activities so you don't miss anything.",
    buttonText: 'Review my activities',
    noActionText:
      'If you do not wish to receive this communication, remember that you can change your email preferences from your user account.',
  },
  es: {
    title: 'Recordatorio de actividad pendiente.',
    actionText:
      'Esta información puede haber cambiado, revisa siempre tus actividades en curso para no perderte nada.',
    buttonText: 'Revisar mis actividades',
    noActionText:
      'Si no deseas recibir esta comunicación, recuerda que puedes cambiar tus preferencias de correo electrónico desde tu cuenta de usuario.',
  },
};

const UserRememberAssignation = ({
  locale,
  ifMessage,
  ifAvatar,
  elseIf,
  endIf,
  userFullname,
  avatarUrl,
  messageToAssignees,
} = {}) => {
  const previewText = `${messages[locale].title}`;

  return (
    <EmailLayout previewText={previewText} title={messages[locale].title} locale={locale}>
      <Container className="text-center">
        {ifMessage}
        <Text className="text-[14px] leading-5 mb-2">{messageToAssignees}</Text>
        <Section>
          <Row>
            <Column align="center" className="table-cell">
              {ifAvatar}
              <Img
                src={avatarUrl}
                height="36"
                width="36"
                className="rounded-full inline-block align-middle"
              />
              {endIf}
              <Text className="inline-block ml-2 text-[16px]">{userFullname}</Text>
            </Column>
          </Row>
        </Section>
        {elseIf}
        <Text className="text-[14px] leading-5">{messages[locale].actionText}</Text>
        {endIf}
      </Container>

      <Container className="text-center p-4 rounded-lg mt-4">
        <ActivityCard locale={locale} />
        <Button
          href="{{it.btnUrl}}"
          className="bg-[#B4E600] py-3 px-4 mt-3 mb-4 rounded text-black text-[14px] no-underline text-center"
        >
          {messages[locale].buttonText}
        </Button>
      </Container>
      <Container className="text-center">
        <Text className="text-[14px] leading-5">{messages[locale].noActionText}</Text>
      </Container>
    </EmailLayout>
  );
};

UserRememberAssignation.defaultProps = IS_DEV_MODE ? DEV_PROPS : PROD_PROPS;
UserRememberAssignation.propTypes = PROP_TYPES;

export default UserRememberAssignation;
