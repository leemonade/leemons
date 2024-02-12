import React from 'react';
import PropTypes from 'prop-types';
import { Section, Row, Column, Container, Img, Text } from '@react-email/components';

const IS_DEV_MODE = String(process?.env?.EMAIL_DEV) === 'true';

const messages = {
  en: {
    activity: {
      new: 'NEW',
      qualificable: 'QUALIFIABLE',
      delivery: 'Delivery',
      startActivity: 'Start activity',
      upcomingDeliveries: 'Upcoming deliveries',
      expDays: 'within {{it.days}} days',
      multiSubjects: 'Multi-Subject',
    },
  },
  es: {
    activity: {
      new: 'NUEVA',
      qualificable: 'CALIFICABLE',
      delivery: 'Entrega',
      startActivity: 'Empezar actividad',
      upcomingDeliveries: 'Próximas entregas',
      expDays: 'dentro de {{it.days}} días',
      multiSubjects: 'Multi-Asignatura',
    },
  },
};

function ActivityCard({
  locale = 'en',
  name = '{{it.instance.assignable.asset.name}}',
  description = '{{ it.instance.assignable.asset.description }}',
  color = '{{ it.instance.assignable.asset.color }}',
  coverUrl = '{{it.instance.assignable.asset.url}}',
  subjectColor = '{{ it.classColor }}',
  subjectName = '{{ it.classes[0].subject.name }}',
  subjectIcon = '{{it.subjectIconUrl}}',
  ifSubjectIcon = '{{ @if (it.subjectIconUrl) }}',
  ifSingleSubject = '{{ @if (it.classes.length === 1) }}',
  ifHasDescription = '{{ @if (it.instance.assignable.asset.description) }}',
  ifQualificable = '{{ @if (it.instance.type.calificable) }}',
  ifTaskDate = '{{ @if (it.taskDate) }}',
  endIf = '{{ /if }}',
  elseIf = '{{ #else }}',
  taskDate = '{{it.taskDate}}',
} = {}) {
  return (
    <Container className="mb-4 text-left bg-white border border-solid border-gray-200 rounded-lg overflow-hidden w-[300px]">
      <Container
        className="w-full h-[144px] border-t-4 border-solid relative"
        style={{
          borderColor: `${subjectColor}`,
          background: `url({{it.instance.assignable.asset.url}})`,
          backgroundSize: 'cover !important',
        }}
      ></Container>
      <Container className="p-4">
        <Container className="mb-2 text-[10px]">
          <span className="inline-block py-1 px-2 border border-solid border-gray-400 rounded">
            {messages[locale].activity.new}
          </span>
          {ifQualificable}
          <span className="ml-2 bg-gray-100 inline-block py-1 px-2 border border-solid border-gray-300 rounded">
            {messages[locale].activity.qualificable}
          </span>
          {endIf}
        </Container>
        <Text className="text-[16px] font-semibold leading-5 mb-0 mt-3">{name}</Text>
        {ifHasDescription}
        <Text className="text-[14px] text-[#4D5358] leading-5 mt-2 mb-0">{description}</Text>
        {endIf}
        <Section className="mt-4">
          <Row>
            <Column>
              <Container
                className="rounded-full text-center align-middle w-[24px] h-[24px]"
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
            </Column>
            <Column>
              <Container className="ml-2">
                <Text className="leading-5 m-0">
                  <span className="text-[14px]">
                    {ifSingleSubject}
                    {subjectName}
                    {elseIf}
                    {messages[locale].activity.multiSubjects}
                    {endIf}
                  </span>
                  {/* <span className="text-xs text-gray-400 block">2º Grupo B</span> */}
                </Text>
              </Container>
            </Column>
          </Row>
        </Section>

        {ifTaskDate}
        <Container>
          <Text className="mb-0">
            <span className="text-[14px]">
              {messages[locale].activity.delivery}: {taskDate}
            </span>
          </Text>
        </Container>
        {endIf}
      </Container>
    </Container>
  );
}

const DEV_PROPS = {
  locale: 'en',
  name: 'The oceans and their risks',
  description: 'The impact of climate change on our oceans cannot be described in...',
  color: '#FABADA',
  coverUrl: 'https://via.placeholder.com/300x144',
  subjectColor: '#FABADA',
  subjectName: 'Civic education',
  subjectIcon: 'https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/PHYSICS_7529c954d8.svg',
  ifSubjectIcon: null,
  ifSingleSubject: null,
  ifHasDescription: null,
  ifTaskDate: null,
  ifQualificable: null,
  endIf: null,
  elseIf: null,
  taskDate: '21/06/2024',
};

const PROD_PROPS = {
  locale: 'en',
  name: '{{it.instance.assignable.asset.name}}',
  description: '{{ it.instance.assignable.asset.description }}',
  color: '{{ it.instance.assignable.asset.color }}',
  coverUrl: '{{it.instance.assignable.asset.url}}',
  subjectColor: '{{ it.classColor }}',
  subjectName: '{{ it.classes[0].subject.name }}',
  subjectIcon: '{{it.subjectIconUrl}}',
  ifSubjectIcon: '{{ @if (it.subjectIconUrl) }}',
  ifSingleSubject: '{{ @if (it.classes.length === 1) }}',
  ifHasDescription: '{{ @if (it.instance.assignable.asset.description) }}',
  ifTaskDate: '{{ @if (it.taskDate) }}',
  ifQualificable: '{{ @if (it.instance.type.calificable) }}',
  endIf: '{{ /if }}',
  elseIf: '{{ #else }}',
  taskDate: '{{it.taskDate}}',
};

ActivityCard.defaultProps = IS_DEV_MODE ? DEV_PROPS : PROD_PROPS;

ActivityCard.propTypes = {
  locale: PropTypes.string,
  color: PropTypes.string,
  name: PropTypes.string,
  coverUrl: PropTypes.string,
  description: PropTypes.string,
  subjectColor: PropTypes.string,
  subjectName: PropTypes.string,
  subjectIcon: PropTypes.string,
  ifSubjectIcon: PropTypes.string,
  ifSingleSubject: PropTypes.string,
  ifHasDescription: PropTypes.string,
  ifTaskDate: PropTypes.string,
  ifQualificable: PropTypes.string,
  endIf: PropTypes.string,
  elseIf: PropTypes.string,
  taskDate: PropTypes.string,
};

export default ActivityCard;
