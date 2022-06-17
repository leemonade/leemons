import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { LoadingOverlay } from '@bubbles-ui/components';
import { getCookieToken } from '@users/session';
import { getSettingsRequest } from '../request/settings';
import LocaleContext from '../contexts/translations';

const UserRedirect = ({ to }) => {
  const [loading, setLoading] = React.useState(true);
  const { loadLocale } = React.useContext(LocaleContext);
  const { path } = useRouteMatch();
  const component = React.useRef(null);
  const token = getCookieToken(true);

  const getComponent = (url, comp) => (path === url ? comp : <Redirect to={url} />);

  const getSettings = async () => {
    setLoading(true);

    try {
      const response = await getSettingsRequest();

      if (response.settings?.lang) {
        loadLocale(response.settings?.lang);
      }

      if (response.settings?.configured) {
        if (path === '/admin/login') {
          component.current = getComponent('/admin/login', to);
        } else {
          component.current = <Redirect to={'/private/dashboard'} />;
        }
      } else if (response.settings?.status === 'ADMIN_CREATED') {
        if (!isEmpty(token?.profile)) {
          component.current = getComponent('/private/admin/setup', to);
        } else {
          component.current = getComponent('/admin/login', to);
        }
      } else if (response.settings?.status === 'LOCALIZED') {
        component.current = getComponent('/admin/signup', to);
      } else {
        component.current = getComponent('/admin/welcome', to);
      }

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
