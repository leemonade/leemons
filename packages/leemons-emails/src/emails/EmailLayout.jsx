import React from 'react';

import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import PropTypes from 'prop-types';

const IS_DEV_MODE = String(process?.env?.EMAIL_DEV) === 'true';
const PLATFORM_NAME = '{{it.__platformName}}';
const currentYear = new Date().getFullYear();
const SOCIAL_BUTTONS = {
  twitter: {
    url: 'https://twitter.com/leemonslxp',
    icon: 'https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/twitter_38830e4b97.png',
  },
  linkedin: {
    url: 'https://www.linkedin.com/company/leemons',
    icon: 'https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/linkedin_5046778c5e.png',
  },
  productHunt: {
    url: 'https://www.producthunt.com/products/leemons',
    icon: 'https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/pinterest_6d27bd9f87.png',
  },
};

const messages = {
  en: {
    bodyEnd: `🫶🏼 ${IS_DEV_MODE ? 'Leemons' : PLATFORM_NAME}`,
    privacyPolicy: 'Privacy policy',
    privacyPolicyUrl: 'https://www.leemons.io/privacy-policy',
    social: SOCIAL_BUTTONS,
    helpCenter: 'Help center',
    helpCenterUrl: 'https://leemonssupport.zendesk.com',
    allRightsReserved: `© ${currentYear} Leemons Edtech Solutions S.L. <br /> Avda Manoteras 38 C411, 28050 Madrid <br /> <br /> All rights reserved.`,
  },
  es: {
    bodyEnd: `🫶🏼 ${IS_DEV_MODE ? 'Leemons' : PLATFORM_NAME}`,
    privacyPolicy: 'Política de privacidad',
    privacyPolicyUrl: 'https://www.leemons.io/privacy-policy',
    social: SOCIAL_BUTTONS,
    helpCenter: 'Centro de ayuda',
    helpCenterUrl: 'https://leemonssupport.zendesk.com',
    allRightsReserved: `© ${currentYear} Leemons Edtech Solutions S.L. <br /> Avda Manoteras 38 C411, 28050 Madrid <br /> <br /> Todos los derechos reservados.`,
  },
};

function EmailLayout({ locale, previewText, title, logoUrl, logoWidth, platformName, children }) {
  const socialButtons = Object.keys(messages[locale].social);
  const socialButtonsWidth = (socialButtons.length * 2 - 1) * 24;
  return (
    <Html>
      <Head>
        {[400, 500].map((weight, index) => (
          <React.Fragment key={weight}>
            <Font
              fontFamily="Albert Sans"
              fallbackFontFamily="Verdana"
              webFont={{
                url: `https://fonts.bunny.net/albert-sans/files/albert-sans-latin-${weight}-normal.woff2`,
                format: 'woff2',
              }}
              fontWeight={weight}
              fontStyle="normal"
            />
            <Font
              fontFamily="Albert Sans"
              fallbackFontFamily="Verdana"
              webFont={{
                url: `https://fonts.bunny.net/albert-sans/files/albert-sans-latin-ext-${weight}-normal.woff2`,
                format: 'woff2',
              }}
              fontWeight={weight}
              fontStyle="normal"
            />
          </React.Fragment>
        ))}
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            fontFamily: {
              sans: ['Albert Sans', 'sans-serif'],
            },
          },
        }}
      >
        <Body className="bg-white text-[#343A3F] my-auto mx-auto font-sans">
          <Container className="bg-[#F8F9FB] my-[24px] mx-auto p-[36px] w-[552px] max-w-full">
            <Container className="text-center">
              <Img src={logoUrl} width={logoWidth} alt={platformName} className="mx-auto" />
              <span className="text-[20px] font-medium block mt-4">{title}</span>
            </Container>
            {children}
            <Container className="text-center">
              <Text className="text-[14px] mt-0 mb-2">{messages[locale].bodyEnd}</Text>
            </Container>
            <Hr className="border border-solid border-[#eaeaea] mt-[20px] mb-[30px] mx-0 w-full" />
            <Section>
              <Row>
                <Column>
                  <Text className="text-[12px] mt-0 leading-4">Powered by:</Text>
                </Column>
              </Row>
              <Row className="mb-2 w-full">
                <Column>
                  <Img
                    src={
                      'https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/logo_leemons_407d9548b9.png'
                    }
                    width="150"
                    alt={'Leemons'}
                  />
                </Column>
                <Column style={{ width: socialButtonsWidth }}>
                  <Section>
                    <Row>
                      {socialButtons.map((social, index) => (
                        <Column key={social}>
                          <Link href={messages[locale].social[social].url}>
                            <Img
                              src={messages[locale].social[social].icon}
                              width="24"
                              height="24"
                              alt={social}
                              className={`inline ${index > 0 ? 'ml-6' : ''}`}
                            />
                          </Link>
                        </Column>
                      ))}
                    </Row>
                  </Section>
                </Column>
              </Row>
            </Section>

            <Section>
              <Link
                href={messages[locale].privacyPolicyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#878D96] underline"
              >
                {messages[locale].privacyPolicy}
              </Link>
              <span className="text-[12px] text-[#878D96]">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <Link
                href={messages[locale].helpCenterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#878D96] underline"
              >
                {messages[locale].helpCenter}
              </Link>
              <Text
                className="text-[12px] text-[#878D96] mb-0 leading-4"
                dangerouslySetInnerHTML={{ __html: messages[locale].allRightsReserved }}
              />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

const PROD_PROPS = {
  locale: 'en',
  title: '',
  previewText: '',
  logoUrl: '{{it.__logoUrl}}',
  logoWidth: '{{it.__logoWidth}}',
  platformName: '{{it.__platformName}}',
};

const DEV_PROPS = {
  locale: 'en',
  title: 'Welcome to Leemons!',
  previewText: '[Leemons] - New Email',
  logoUrl:
    'https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/logo_leemons_407d9548b9.png',
  logoWidth: '224px',
  platformName: 'Leemons',
};

EmailLayout.defaultProps = IS_DEV_MODE ? DEV_PROPS : PROD_PROPS;

EmailLayout.propTypes = {
  locale: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  previewText: PropTypes.string,
  logoUrl: PropTypes.string,
  logoWidth: PropTypes.string,
  platformName: PropTypes.string,
};

export default EmailLayout;
