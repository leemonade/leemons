import React from 'react';
import PropTypes from 'prop-types';
import { compact, noop } from 'lodash';
import { Box, Table, Button, Select, ActionButton, ContextContainer } from '@bubbles-ui/components';
import { useProfiles } from '@users/hooks';
import { AddCircleIcon, DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { ViewOffIcon, ViewOnIcon } from '@bubbles-ui/icons/outline';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';

function ProfileTableInput({
  userAgents = [],
  onEnable = noop,
  onDisable = noop,
  onChange = noop,
}) {
  const [profileSelected, setProfileSelected] = React.useState(null);
  const { data: profiles, isLoading } = useProfiles();
  const { t: tCommon } = useCommonTranslate('formWithTheme');
  const [tEnableUser] = useTranslateLoader(prefixPN('enableUserModal'));
  const [tDisableUser] = useTranslateLoader(prefixPN('disableUserModal'));

  function handleOnAdd() {
    onChange(userAgents.concat({ profile: { id: profileSelected } }));
    setProfileSelected(null);
  }

  function handleRemove(userAgent) {
    // If not userAgent, its mean that the userAgent has not been saved yet, so we remove the userAgent from the list
    onChange(userAgents.filter((item) => item.profile.id !== userAgent.profile.id));
  }

  const getActionButton = React.useCallback(
    (userAgent) => {
      const commonProps = {
        width: 18,
        height: 18,
      };
      if (!userAgent.id) {
        return (
          <ActionButton
            tooltip={tCommon('remove')}
            icon={<DeleteBinIcon {...commonProps} />}
            onClick={() => handleRemove(userAgent)}
          />
        );
      }
      if (userAgent.id && !userAgent.disabled) {
        return (
          <ActionButton
            tooltip={tDisableUser('titleProfile')}
            icon={<ViewOffIcon {...commonProps} />}
            onClick={() => onDisable(userAgent)}
          />
        );
      }
      return (
        <ActionButton
          tooltip={tEnableUser('titleProfile')}
          icon={<ViewOnIcon {...commonProps} />}
          onClick={() => onEnable(userAgent)}
        />
      );
    },
    [userAgents]
  );

  const userProfiles = React.useMemo(
    () => compact(userAgents?.map((userAgent) => userAgent?.profile?.id) ?? []),
    [userAgents]
  );

  const profilesData = React.useMemo(
    () =>
      profiles?.map((profile) => ({
        value: profile.id,
        label: profile.name,
        disabled: userProfiles.includes(profile.id),
      })) ?? [],
    [profiles, userProfiles]
  );

  const columns = [
    {
      Header: '',
      accessor: 'name',
    },
    {
      Header: '',
      accessor: 'action',
      style: {
        width: '10%',
      },
    },
  ];

  const tableData = React.useMemo(
    () =>
      userAgents?.map((userAgent) => {
        const profileData = profilesData.find((p) => p.value === userAgent?.profile?.id);
        return {
          name: profileData?.label,
          action: getActionButton(userAgent),
        };
      }) ?? [],
    [userAgents, profilesData]
  );

  return (
    <Box>
      <ContextContainer direction="row" spacing={2}>
        <Select data={profilesData} value={profileSelected} onChange={setProfileSelected} />
        <Box noFlex>
          <Button variant="link" leftIcon={<AddCircleIcon />} onClick={handleOnAdd}>
            {tCommon('add')}
          </Button>
        </Box>
      </ContextContainer>
      {tableData.length > 0 && <Table data={tableData} columns={columns} />}
    </Box>
  );
}

ProfileTableInput.propTypes = {
  userAgents: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  onEnable: PropTypes.func,
  onDisable: PropTypes.func,
};

export default ProfileTableInput;
export { ProfileTableInput };
