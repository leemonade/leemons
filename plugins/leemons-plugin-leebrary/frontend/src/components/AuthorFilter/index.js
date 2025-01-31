import { useMemo } from 'react';

import { Select, Box } from '@bubbles-ui/components';
import { UserDisplayItem } from '@bubbles-ui/components/lib/informative/UserDisplayItem/UserDisplayItem';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useProfiles } from '@users/hooks';
import { useUserList } from '@users/hooks/queries/useUserList';
import useIsAdmin from '@users/hooks/useIsAdmin';
import { getCentersWithToken } from '@users/session';
import PropTypes from 'prop-types';

import prefixPN from '@leebrary/helpers/prefixPN';

const ItemComponent = ({ label, value, ...props }) => {
  return <Box {...props}>{label}</Box>;
};

ItemComponent.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

export default function AuthorFilter({ value = null, onChange = () => {}, isLoading }) {
  const [t] = useTranslateLoader(prefixPN('authorFilter'));
  const isAdmin = useIsAdmin();
  const { data: profiles } = useProfiles();
  const [center] = getCentersWithToken();

  const contentDeveloperProfile = useMemo(
    () =>
      profiles
        ?.filter((profile) => profile.sysName === 'content-developer')
        .map((profile) => profile.id),
    [profiles]
  );

  const { data: developerUsersList, isLoading: isLoadingDeveloperUsersList } = useUserList({
    params: {
      page: 0,
      size: 999999,
      query: {
        profiles: contentDeveloperProfile,
        centers: center?.id,
        listUserAgents: true,
      },
    },
    options: {
      enabled: !!contentDeveloperProfile?.length && !!center?.id,
    },
  });

  // SELECT DATA ··················································

  const authorSelectData = useMemo(() => {
    if (!developerUsersList?.items?.length) return null;
    const authorsGroup = developerUsersList?.items.map((item) => {
      const userAgentId = developerUsersList?.userAgents?.find(
        (userAgent) => userAgent.user === item.id
      )?.id;
      return {
        ...item,
        userAgent: userAgentId,
        value: userAgentId,
        label: item.name,
      };
    });

    const groupOne = [
      { label: t('mine'), value: 'mine' },
      { label: t('all'), value: 'all' },
    ];

    return [
      ...groupOne.map((item) => ({ ...item, group: t('mineAll') })),
      ...authorsGroup.map((item) => ({ ...item, group: t('authors') })),
    ];
  }, [developerUsersList, t]);

  // FUNCTIONS ··················································

  const renderItem = (item) => {
    if (item.value === item.userAgent) {
      return <UserDisplayItem style={{ cursor: 'pointer' }} {...item} />;
    }
    return <ItemComponent {...item} />;
  };

  if (!isAdmin) return null;
  return (
    <Select
      sx={{ minWidth: 170 }}
      data-cypress-id="search-asset-author-selector"
      data={authorSelectData || []}
      value={value || 'mine'}
      itemComponent={renderItem}
      valueComponent={renderItem}
      onChange={([value]) => onChange(value)}
      placeholder={t('placeholder')}
      disabled={isLoading || isLoadingDeveloperUsersList}
      skipFlex
    />
  );
}

AuthorFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  program: PropTypes.string,
  subject: PropTypes.string,
  isLoading: PropTypes.bool,
};
