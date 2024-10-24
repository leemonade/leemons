import { Box, Alert } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

import prefixPN from '@layout/helpers/prefixPN';
import useIsOverHeader from '@layout/hooks/useIsOverHeader';
import useUserInfo from '@layout/hooks/useUserInfo';

export default function ImpersonationLayout({ children }) {
  const borderColor = '#F39C12';
  const isOverHeader = useIsOverHeader();
  const [t, , , isLoading] = useTranslateLoader(prefixPN('impersonation'));

  const { name, profile, hasOtherProfiles, isLoading: isLoadingUserAgentsInfo } = useUserInfo();
  const impersonating = Cookies.get('impersonated') === 'true';

  if (!impersonating) {
    return children;
  }

  return (
    <>
      <Box
        sx={{
          boxShadow: `inset 0 0 0 4px ${borderColor}`,
          boxSizing: 'border-box',
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 999999999999999,
          pointerEvents: 'none',
        }}
        id="impersonation-layout"
      >
        {!isLoading && !isLoadingUserAgentsInfo && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              opacity: isOverHeader ? 0.3 : 1,
              '& .mantine-Alert-root': {
                border: `4px solid ${borderColor}!important`,
                borderColor: `${borderColor}!important`,
              },
            }}
          >
            <Alert severity="warning" closeable={false} title={t('alert.title')}>
              {t(hasOtherProfiles ? 'alert.descriptionMultiProfile' : 'alert.description', {
                user: name,
                profile,
              })}
            </Alert>
          </Box>
        )}
      </Box>
      {children}
    </>
  );
}

ImpersonationLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
