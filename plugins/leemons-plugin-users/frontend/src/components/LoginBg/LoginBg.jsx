import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Box, Logo, Text, Stack, ImageLoader, useMediaQuery } from '@bubbles-ui/components';
import { LoginBgStyles } from './LoginBg.styles';

export const LOGIN_BG_DEFAULT_PROPS = {
  accentColor: '#E2FF7A',
  dobleQuoted: true,
  logoUrl: '',
  logoWidth: 180,
  heroImage: '/public/users/login-hero.svg',
};

export const LOGIN_BG_PROP_TYPES = {
  quote: PropTypes.string,
  author: PropTypes.string,
  dobleQuoted: PropTypes.bool,
  accentColor: PropTypes.string,
  logoUrl: PropTypes.string,
  logoWidth: PropTypes.number,
  heroImage: PropTypes.string,
};

const LoginBg = ({ quote, author, dobleQuoted, accentColor, logoUrl, logoWidth, heroImage }) => {
  const { classes } = LoginBgStyles({ logoWidth }, { name: 'LoginBg' });
  const matches = useMediaQuery('(min-width: 1300px)', true, { getInitialValueInEffect: false });

  return (
    <Stack
      direction="column"
      fullHeight
      fullWidth
      sx={{ backgroundColor: '#F8F9FB', padding: 50, paddingBottom: 0 }}
    >
      <Box noFlex>
        {!isEmpty(logoUrl) ? (
          <ImageLoader src={logoUrl} forceImage className={classes.logo} height="auto" />
        ) : (
          <Logo className={classes.logo} />
        )}
      </Box>

      <Stack direction="column" justifyContent="center">
        <Stack direction="column" spacing={6} sx={{ paddingInline: matches ? 35 : 0 }}>
          <Box className={classes.hero}>
            <ImageLoader
              src={heroImage}
              forceImage
              className={classes.heroImage}
              height="auto"
              alt="Hero Image"
            />
          </Box>
          <Box
            dangerouslySetInnerHTML={{ __html: dobleQuoted ? `"${quote}"` : quote }}
            sx={{
              lineHeight: 1.2,
              fontSize: matches ? 26 : 20,
              color: '#4D5358',
            }}
          />
          {!!author && <Text size="md">{author}</Text>}
        </Stack>
      </Stack>
    </Stack>
  );
};

LoginBg.defaultProps = LOGIN_BG_DEFAULT_PROPS;
LoginBg.propTypes = LOGIN_BG_PROP_TYPES;

export { LoginBg };
