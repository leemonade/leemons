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

const messages = {
  en: {
    title: 'You have new pending activities',
    actionText:
      "This information may have changed, always check your current activities so you don't miss anything.",
    buttonText: 'Review my activities',
    noActionText: 'You can change your email preferences from your user account.',
    activity: {
      new: 'NEW',
      delivery: 'Delivery',
      startActivity: 'Start activity',
      upcomingDeliveries: 'Upcoming deliveries',
      expDays: 'within {{it.days}} days',
      multiSubjects: 'Multi-Subject',
    },
  },
  es: {
    title: 'Tienes nuevas actividades pendientes',
    actionText:
      'Esta información puede haber cambiado, revisa siempre tus actividades en curso para no perderte nada.',
    buttonText: 'Revisar mis actividades',
    noActionText: 'Puedes cambiar tus preferencias de correo desde tu cuenta de usuario.',
    activity: {
      new: 'NUEVA',
      delivery: 'Entrega',
      startActivity: 'Empezar actividad',
      upcomingDeliveries: 'Próximas entregas',
      expDays: 'dentro de {{it.days}} días',
      multiSubjects: 'Multi-Asignatura',
    },
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
          <Container className="mb-4 text-left bg-white shadow-lg rounded-lg overflow-hidden w-[288px]">
            <Container className="border-t-4 border-solid border-[{{ it.instance.assignable.asset.color }}]">
              <Img
                className="w-full h-[144px] object-cover"
                src="{{it.instance.assignable.asset.url}}"
                alt="{{it.instance.assignable.asset.name}}"
              />
            </Container>
            <Container className="p-4">
              <Container className="mb-2 text-xs">
                <span className="inline-block py-1 px-2 border border-solid border-gray-400 rounded">
                  {messages[locale].activity.new}
                </span>
                {/*
                <span className="ml-2 bg-gray-100 inline-block py-1 px-2 border border-solid border-gray-300 rounded">
                  CALIFICABLE
                </span>
                */}
              </Container>
              <Text className="text-base font-semibold leading-5 text-gray-900 mb-0 mt-3">
                {'{{it.instance.assignable.asset.name}}'}
              </Text>
              {'{{ @if (it.instance.assignable.asset.description) }}'}
              <Text className="text-sm text-gray-700 leading-5 mt-2 mb-0">
                {'{{ it.instance.assignable.asset.description }}'}
              </Text>
              {'{{ /if}}'}
              <Section>
                <Row>
                  <Column>
                    <Container className="bg-[{{ it.classColor }}] rounded-full text-center align-middle w-[24px] h-[24px]">
                      {'{{ @if (it.subjectIconUrl) }}'}
                      <Img
                        src="{{it.subjectIconUrl}}"
                        width="13px"
                        height="13px"
                        className="filter brightness-0 invert align-middle"
                      />
                      {'{{ /if}}'}
                    </Container>
                  </Column>
                  <Column>
                    <Container className="ml-2 mt-4">
                      <Text className="leading-5 m-0">
                        <span className="text-xs">
                          {'{{ @if (it.classes.length === 1) }}'}
                          {'{{ it.classes[0].subject.name }}'}
                          {'{{ #else }}'}
                          {messages[locale].activity.multiSubjects}
                          {'{{ /if}}'}
                        </span>
                        {/* <span className="text-xs text-gray-400 block">2º Grupo B</span> */}
                      </Text>
                    </Container>
                  </Column>
                </Row>
              </Section>

              {'{{ @if (it.taskDate) }}'}
              <Container>
                <Text className="mb-0">
                  <span className="text-sm text-gray-600">
                    {messages[locale].activity.delivery}: {'{{it.taskDate}}'}
                  </span>
                </Text>
              </Container>
              {'{{ /if}}'}
            </Container>
          </Container>

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
