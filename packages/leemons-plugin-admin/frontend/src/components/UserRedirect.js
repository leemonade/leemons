import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { LoadingOverlay } from '@bubbles-ui/components';
import { getSettingsRequest } from '../request/settings';
import LocaleContext from '../contexts/translations';

const UserRedirect = ({ to }) => {
  const [loading, setLoading] = React.useState(true);
  const { loadLocale } = React.useContext(LocaleContext);
  const { path } = useRouteMatch();
  const component = React.useRef(null);

  const getComponent = (url, comp) => (path === url ? comp : <Redirect to={url} />);

  const getRedirect = (settings, isSuperAdmin) => {
    if (settings.configured) {
      if (isSuperAdmin) {
        return getComponent('/private/admin/setup', to);
      }
      if (path === '/admin/login') {
        return getComponent('/users/login', to);
      }
      return <Redirect to={'/private/dashboard'} />;
    }

    // If not configured yet but user is UserAdmin, just redirect to the page requested
    if (isSuperAdmin) {
      return getComponent(path, to);
    }

    if (settings.status === 'ADMIN_CREATED') {
      return getComponent('/users/login', to);
    }

    if (settings.status === 'LOCALIZED') {
      return getComponent('/admin/signup', to);
    }

    return getComponent('/admin/welcome', to);
  };

  const getSettings = async () => {
    setLoading(true);

    try {
      let userToken = null;
      try {
        userToken = await leemons.api(`users/user`);
      } catch (e) {
        leemons.log.debug('Token not valid or session expired');
      }
      const response = await getSettingsRequest();

      if (response.settings?.lang) {
        loadLocale(response.settings?.lang);
      }

      component.current = getRedirect(response.settings || {}, userToken?.user?.isSuperAdmin);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => getSettings(), [to, path]);

  if (loading) return <LoadingOverlay visible />;

  return component.current;
};

UserRedirect.propTypes = {
  to: PropTypes.node,
};

export { UserRedirect };
export default UserRedirect;
