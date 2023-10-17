import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Box, HeroBg, Logo, Paragraph, Text, Stack, ImageLoader } from '@bubbles-ui/components';
import { LoginBgStyles } from './LoginBg.styles';

export const LOGIN_BG_DEFAULT_PROPS = {
  backgroundColor: '#F0F5FC',
  foregroundColor: '#FFFFFF',
  containerColor: '#FFFFFF',
  fillColor: 'none',
  dobleQuoted: true,
  accentColor: null,
  logoUrl: '',
  logoWidth: 140,
};

export const LOGIN_BG_PROP_TYPES = {
  quote: PropTypes.string,
  author: PropTypes.string,
  backgroundColor: PropTypes.string,
  foregroundColor: PropTypes.string,
  containerColor: PropTypes.string,
  dobleQuoted: PropTypes.bool,
  accentColor: PropTypes.string,
  logoUrl: PropTypes.string,
  fillColor: PropTypes.string,
  quoteColor: PropTypes.string,
  logoWidth: PropTypes.number,
};

const LoginBg = ({
  quote,
  author,
  backgroundColor,
  foregroundColor,
  containerColor,
  fillColor,
  dobleQuoted,
  accentColor,
  logoUrl,
  logoWidth,
  quoteColor,
  ...props
}) => {
  const { classes, cx } = LoginBgStyles({ logoWidth });

  /*
  useEffect(
    () => console.log('Bubbles >> LoginBg >> containerColor:', containerColor),
    [containerColor]
  );
  */

  return (
    <Box className={classes.root}>
      <HeroBg
        {...props}
        size="x-md"
        style={{ backgroundColor, color: foregroundColor }}
        accentColor={!isEmpty(accentColor) ? accentColor : undefined}
        containerColor={!isEmpty(containerColor) ? containerColor : undefined}
        fillColor={!isEmpty(fillColor) ? fillColor : undefined}
      />
      <Box className={classes.content}>
        {!isEmpty(logoUrl) ? (
          <ImageLoader src={logoUrl} forceImage className={classes.logo} height="auto" />
        ) : (
          <Logo className={classes.logo} />
        )}

        <Stack direction="column" spacing={2}>
          <Paragraph
            size="xl"
            color="secondary"
            style={{ color: !!quoteColor ? quoteColor : undefined }}
          >
            {dobleQuoted ? `"${quote}"` : quote}
          </Paragraph>
          <Text size="md">{author}</Text>
        </Stack>
        <Box className={classes.footer}></Box>
      </Box>
    </Box>
  );
};

LoginBg.defaultProps = LOGIN_BG_DEFAULT_PROPS;
LoginBg.propTypes = LOGIN_BG_PROP_TYPES;

export { LoginBg };
