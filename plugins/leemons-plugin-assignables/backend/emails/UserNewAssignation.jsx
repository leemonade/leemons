import React from 'react';

import EmailLayout from '@leemons/emails/src/emails/EmailLayout.jsx';
import { Section, Row, Column, Button, Container, Img, Text } from '@react-email/components';
import PropTypes from 'prop-types';

import ActivityCard from './ActivityCard.jsx';

const IS_DEV_MODE = String(process?.env?.EMAIL_DEV) === 'true';

const messages = {
  en: {
    title: 'You have new pending activities.',
    actionText:
      "This information may have changed, always check your current activities so you don't miss anything.",
    buttonText: 'Review my activities',
    noActionText:
      'If you do not wish to receive this communication, remember that you can change your email preferences from your user account.',
  },
  es: {
    title: 'Tienes nuevas actividades pendientes.',
    actionText:
      'Esta información puede haber cambiado, revisa siempre tus actividades en curso para no perderte nada.',
    buttonText: 'Revisar mis actividades',
    noActionText:
      'Si no deseas recibir esta comunicación, recuerda que puedes cambiar tus preferencias de correo electrónico desde tu cuenta de usuario.',
  },
};

const UserNewAssignation = ({
  locale = 'en',
  ifMessage = '{{ @if (it.instance.messageToAssignees) }}',
  ifAvatar = '{{ @if (it.userSession.avatarUrl) }}',
  elseIf = '{{ #else }}',
  endIf = '{{ /if }}',
  userFullname = '{{it.userSession.name}} {{it.userSession.surnames}}',
  avatarUrl = '{{it.userSession.avatarUrl}}',
  messageToAssignees = '{{* it.instance.messageToAssignees}}',
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

export const DEV_PROPS = {
  locale: 'en',
  ifMessage: null,
  ifAvatar: null,
  elseIf: null,
  endIf: null,
  userFullname: 'Antonio Gonzalvez',
  avatarUrl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
  messageToAssignees:
    'This module is about describing people in the context of an informal conversation. You will begin by listening to the audio of a conversation and answering a fill-in-the-blanks quiz. Finally, you will complete a writing exercise to practice describing people.',
};

export const PROD_PROPS = {
  locale: 'en',
  ifMessage: '{{ @if (it.instance.messageToAssignees) }}',
  ifAvatar: '{{ @if (it.userSession.avatarUrl) }}',
  elseIf: '{{ #else }}',
  endIf: '{{ /if }}',
  userFullname: '{{it.userSession.name}} {{it.userSession.surnames}}',
  avatarUrl: '{{it.userSession.avatarUrl}}',
  messageToAssignees: '{{* it.instance.messageToAssignees}}',
};

export const PROP_TYPES = {
  locale: PropTypes.string,
  ifMessage: PropTypes.string,
  ifAvatar: PropTypes.string,
  elseIf: PropTypes.string,
  endIf: PropTypes.string,
  userFullname: PropTypes.string,
  avatarUrl: PropTypes.string,
  messageToAssignees: PropTypes.string,
};

UserNewAssignation.defaultProps = IS_DEV_MODE ? DEV_PROPS : PROD_PROPS;

UserNewAssignation.propTypes = PROP_TYPES;

export default UserNewAssignation;
