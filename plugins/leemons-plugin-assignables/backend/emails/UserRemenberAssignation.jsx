import React from 'react';
import PropTypes from 'prop-types';
import {
  Section,
  Row,
  Column,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Img,
  Text,
} from '@react-email/components';
import EmailLayout from './EmailLayout.jsx';
import ActivityCard from './ActivityCard.jsx';

const messages = {
  en: {
    title: 'Pending activity reminder',
    actionText:
      "This information may have changed, always check your current activities so you don't miss anything.",
    buttonText: 'Review my activities',
    noActionText: 'You can change your email preferences from your user account.',
  },
  es: {
    title: 'Recordatorio de actividad pendiente',
    actionText:
      'Esta información puede haber cambiado, revisa siempre tus actividades en curso para no perderte nada.',
    buttonText: 'Revisar mis actividades',
    noActionText: 'Puedes cambiar tus preferencias de correo desde tu cuenta de usuario.',
  },
};

const UserNewAssignation = ({ locale = 'en' } = {}) => {
  const previewText = `[Leemons] ${messages[locale].title}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <EmailLayout title={messages[locale].title}>
        <Container className="text-center mt-4">
          {'{{ @if (it.instance.messageToAssignees) }}'}
          <Text className="text-sm leading-4">{'{{*it.instance.messageToAssignees}}'}</Text>
          <Section>
            <Row>
              <Column align="center" className="table-cell">
                {'{{ @if (it.userSession.avatarUrl) }}'}
                <Img
                  src="{{it.userSession.avatarUrl}}"
                  height="30"
                  width="30"
                  className="rounded-full inline-block align-middle"
                />
                {'{{ /if}}'}
                <Text className="inline-block ml-2 text-xs">
                  {'{{it.userSession.name}} {{it.userSession.surnames}}'}
                </Text>
              </Column>
            </Row>
          </Section>
          {'{{ #else }}'}
          <Text className="text-sm leading-4">{messages[locale].actionText}</Text>
          {'{{ /if}}'}
        </Container>

        <Container className="bg-white text-center p-4 rounded-lg mt-4">
          <ActivityCard locale={locale} />
          <Button
            href="{{it.btnUrl}}"
            className="bg-[#B4E600] py-2 px-4 my-2 rounded text-black text-[12px] no-underline text-center"
          >
            {messages[locale].buttonText}
          </Button>
        </Container>
        <Container className="text-center mt-2">
          <Text className="text-xs">{messages[locale].noActionText}</Text>
        </Container>
      </EmailLayout>
    </Html>
  );
};

UserNewAssignation.propTypes = {
  locale: PropTypes.string,
};

export default UserNewAssignation;
