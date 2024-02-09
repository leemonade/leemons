import React from 'react';
import PropTypes from 'prop-types';
import {
  Body,
  Container,
  Heading,
  Hr,
  Img,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

function EmailLayout({ title, children }) {
  return (
    <Tailwind>
      <Body className="bg-white my-auto mx-auto font-sans">
        <Container className="bg-[#F8F9FB] rounded my-[40px] mx-auto py-[20px] px-[40px] w-[465px]">
          <Container className="text-center">
            <Heading as="h4">{title}</Heading>
            <Img
              src="{{it.__logoUrl}}"
              width="{{it.__logoWidth}}"
              alt="{{it.__platformName}}"
              className="mx-auto"
            />
          </Container>
          <Section>
            {children}

            <Hr className="border border-solid border-[#eaeaea] my-[20px] mx-0 w-full" />
            <Text className="my-0 text-center text-xs text-[#666666]">
              <span className="block">{'{{it.__platformName}}'}</span>
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  );
}

EmailLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default EmailLayout;
