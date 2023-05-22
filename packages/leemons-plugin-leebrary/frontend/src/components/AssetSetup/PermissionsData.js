import { SelectProgram } from '@academic-portfolio/components';
import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import usePrograms from '@academic-portfolio/hooks/usePrograms';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';
import {
  Alert,
  Box,
  Button,
  ContextContainer,
  ImageLoader,
  Paper,
  Paragraph,
  Select,
  Stack,
  Switch,
  TableInput,
  Text,
  Title,
  UserDisplayItem,
} from '@bubbles-ui/components';
import { LibraryItem } from '@bubbles-ui/leemons';
import { unflatten, useRequestErrorMessage } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import SelectUserAgent from '@users/components/SelectUserAgent';
import useGetProfileSysName from '@users/helpers/useGetProfileSysName';
import { getCentersWithToken } from '@users/session';
import _, { find, isArray, isEmpty, isFunction, isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import prefixPN from '../../helpers/prefixPN';
import { prepareAsset } from '../../helpers/prepareAsset';
import { getAssetRequest, setPermissionsRequest } from '../../request';

const ROLES = [
  { label: 'Owner', value: 'owner' },
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
  { label: 'Commentor', value: 'commentor' },
];

function ClassItem({ class: klass, ...props }) {
  if (!klass) {
    return null;
  }

  return (
    <Box {...props}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing[2],
          alignItems: 'center',
        })}
      >
        <Box
          sx={() => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 26,
            minHeight: 26,
            maxWidth: 26,
            maxHeight: 26,
            borderRadius: '50%',
            backgroundColor: klass?.color,
          })}
        >
          <ImageLoader
            sx={() => ({
              borderRadius: 0,
              filter: 'brightness(0) invert(1)',
            })}
            forceImage
            width={16}
            height={16}
            src={getClassIcon(klass)}
          />
        </Box>
        <Text>{`${klass.subject.name}${
          klass?.groups?.name ? ` - ${klass.groups.name}` : ''
        }`}</Text>
      </Box>
    </Box>
  );
}

const SelectAgents = ({ usersData, ...props }) => (
  <SelectUserAgent {...props} selectedUsers={_.map(usersData, 'user.id')} returnItem />
);

const RoleSelect = (props) => {
  if (!props.value) {
    props.onChange('viewer');
  }
  return <Select {...props} />;
};

const PermissionsData = ({
  asset: assetProp,
  sharing,
  onNext = () => {},
  onSavePermissions,
  isDrawer,
  drawerTranslations,
}) => {
  const [asset, setAsset] = useState(assetProp);
  const [t, translations] = isDrawer
    ? drawerTranslations
    : useTranslateLoader(prefixPN('assetSetup'));
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [roles, setRoles] = useState([]);
  const [adminPrograms, setAdminPrograms] = useState(assetProp.adminPrograms || []);
  const [isPublic, setIsPublic] = useState(adminPrograms.length || asset?.public);
  const params = useParams();
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const { data: classes } = useSessionClasses();
  const { data: programs } = usePrograms();
  const profileSysName = useGetProfileSysName();

  const programsData = useMemo(() => {
    let goodPrograms = programs;
    if (asset?.program) {
      goodPrograms = _.filter(programs, { id: asset.program });
    }
    return (
      goodPrograms?.map((program) => ({
        value: program.id,
        label: program.name,
      })) ?? []
    );
  }, [programs, asset?.program]);

  const classesData = useMemo(() => {
    let goodClasses = classes;
    if (selectedProgram) {
      goodClasses = _.filter(goodClasses, { program: selectedProgram });
    }
    if (asset?.subjects?.length) {
      const subjectsIds = _.map(asset.subjects, 'subject');
      goodClasses = _.filter(goodClasses, ({ subject }) => subjectsIds.includes(subject.id));
    }
    return (
      goodClasses?.map((klass) => ({
        value: klass.id,
        label: klass.groups.isAlone
          ? klass.subject.name
          : `${klass.subject.name} - ${klass.groups.name}`,
        ...klass,
      })) ?? []
    );
  }, [classes, selectedProgram, asset?.subjects]);

  // ··············································································
  // DATA PROCESS

  const loadAsset = async (id) => {
    const results = await getAssetRequest(id);
    if (results.asset && results.asset.id !== asset?.id) {
      setAsset(prepareAsset(results.asset));
    }
  };

  const savePermissions = async () => {
    try {
      setLoading(true);
      const canAccess = usersData
        .filter((item) => item.editable !== false)
        .map((userData) => ({
          userAgent: userData.user.value || userData.user.userAgentIds[0],
          role: userData.role,
        }));
      const classesCanAccess = selectedClasses.map((klass) => ({
        class: klass.class[0],
        role: klass.role,
      }));

      if (isFunction(onSavePermissions)) {
        await onSavePermissions(asset.id, {
          canAccess,
          programsCanAccess: isPublic ? adminPrograms : [],
          classesCanAccess,
          isPublic,
        });
      } else {
        await setPermissionsRequest(asset.id, {
          canAccess,
          programsCanAccess: isPublic ? adminPrograms : [],
          classesCanAccess,
          isPublic,
        });
      }

      setLoading(false);
      addSuccessAlert(
        sharing
          ? t(`permissionsData.labels.shareSuccess`)
          : t(`permissionsData.labels.permissionsSuccess`)
      );
      onNext();
    } catch (err) {
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  };

  // ··············································································
  // EFFECTS

  useEffect(() => {
    if (
      !isEmpty(params.asset) &&
      (isNil(asset) || (!isEmpty(asset) && asset.id !== params.asset))
    ) {
      loadAsset(params.asset);
    }
  }, [params]);

  useEffect(() => {
    if (asset?.public !== isPublic) {
      // setIsPublic(asset?.public);
    }

    const { canAccess, classesCanAccess } = asset;

    if (isArray(classesCanAccess) && classesCanAccess.length) {
      const classe = find(classes, { id: classesCanAccess[0].class });
      if (classe) {
        setSelectedProgram(classe.program);
      }
      setSelectedClasses(
        classesCanAccess.map((klass) => ({
          class: [klass.class],
          role: klass.role,
        }))
      );
    }
    if (isArray(canAccess)) {
      setUsersData(
        canAccess.map((user) => ({
          user,
          role: user.permissions[0],
          editable: user.permissions[0] !== 'owner',
        }))
      );
    }
  }, [asset, classes]);

  useEffect(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const { roleLabels } = items.plugins.leebrary.assetSetup;
      ROLES.forEach((rol, index) => {
        ROLES[index].label = roleLabels[rol.value] || ROLES[index].label;
      });
      setRoles(ROLES);
    }
  }, [translations]);

  // ··············································································
  // HANDLERS

  const handleOnClick = () => {
    savePermissions();
  };

  const checkIfUserIsAdded = (userData) => {
    const found = find(usersData, (data) => data.user.id === userData.user.id);
    return isNil(found);
  };

  const checkIfClassIsAdded = (newClass) => {
    const found = find(
      selectedClasses,
      (selectedClass) => selectedClass.class[0] === newClass.class[0]
    );
    return isNil(found);
  };

  // ··············································································
  // LABELS & STATICS

  const USERS_COLUMNS = useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'user',
        input: {
          node: <SelectAgents usersData={usersData} />,
          rules: { required: 'Required field' },
        },
        editable: false,
        valueRender: (value) => <UserDisplayItem {...value} variant="inline" size="xs" />,
        style: { width: '50%' },
      },
      {
        Header: 'Role',
        accessor: 'role',
        input: {
          node: <RoleSelect />,
          rules: { required: 'Required field' },
          data: roles,
        },
        valueRender: (value) => find(roles, { value })?.label,
      },
    ],
    [roles, usersData]
  );

  const USER_LABELS = useMemo(
    () => ({
      add: t('permissionsData.labels.addUserButton', 'Add'),
      remove: t('permissionsData.labels.removeUserButton', 'Remove'),
      edit: t('permissionsData.labels.editUserButton', 'Edit'),
      accept: t('permissionsData.labels.acceptButton', 'Accept'),
      cancel: t('permissionsData.labels.cancelButton', 'Cancel'),
    }),
    [t]
  );

  const CLASSES_COLUMNS = useMemo(
    () => [
      {
        Header: 'Class',
        accessor: 'class',
        input: {
          node: (
            <Select
              itemComponent={(item) => (
                <ClassItem {...item} class={classesData.find((klass) => klass.id === item.value)} />
              )}
              valueComponent={(item) => (
                <ClassItem {...item} class={classesData.find((klass) => klass.id === item.value)} />
              )}
              data={classesData}
            />
          ),
          rules: { required: 'Required field' },
        },
        editable: false,
        valueRender: (values) =>
          values.map((value) => (
            <ClassItem
              key={value}
              class={classesData.find((klass) => klass.id === value)}
              variant="inline"
              size="xs"
            />
          )),
      },
      {
        Header: 'Role',
        accessor: 'role',
        input: {
          node: <Select />,
          rules: { required: 'Required field' },
          data: roles?.filter((role) => ['viewer', 'editor'].includes(role.value)),
        },
        valueRender: (value) => find(roles, { value })?.label,
      },
    ],
    [roles, classesData]
  );

  // ··············································································
  // RENDER

  return (
    <Box>
      {!isEmpty(asset) && (
        <ContextContainer
          title={
            sharing ? t('permissionsData.header.shareTitle') : t('permissionsData.labels.title')
          }
        >
          <Paper bordered padding={1} shadow="none">
            <LibraryItem asset={asset} />
          </Paper>
          {isArray(asset?.canAccess) ? (
            <ContextContainer divided>
              {profileSysName === 'admin' ? (
                <Box>
                  <Switch
                    checked={isPublic}
                    onChange={setIsPublic}
                    label={t('permissionsData.labels.isPublic')}
                  />
                  {isPublic ? (
                    <SelectProgram
                      multiple
                      label={t('permissionsData.labels.program')}
                      center={getCentersWithToken()[0].id}
                      value={adminPrograms}
                      onChange={setAdminPrograms}
                    />
                  ) : null}
                </Box>
              ) : null}

              {!isPublic && (profileSysName === 'teacher' || profileSysName === 'student') && (
                <ContextContainer>
                  {profileSysName === 'teacher' ? (
                    <Box>
                      <Select
                        label={t('permissionsData.labels.programs')}
                        value={selectedProgram}
                        onChange={(e) => {
                          setSelectedClasses([]);
                          setSelectedProgram(e);
                        }}
                        data={programsData}
                      />
                    </Box>
                  ) : null}

                  <Box>
                    <Title order={5}>{t('permissionsData.labels.addClasses')}</Title>
                    <Paragraph>{t('permissionsData.labels.addClassesDescription')}</Paragraph>
                  </Box>
                  {!isEmpty(USERS_COLUMNS) && !isEmpty(USER_LABELS) && (
                    <TableInput
                      data={selectedClasses}
                      onChange={setSelectedClasses}
                      columns={CLASSES_COLUMNS}
                      labels={USER_LABELS}
                      disabled={profileSysName === 'student' ? false : !selectedProgram}
                      showHeaders={false}
                      forceShowInputs
                      sortable={false}
                      onBeforeAdd={checkIfClassIsAdded}
                      resetOnAdd
                      editable
                      unique
                    />
                  )}
                </ContextContainer>
              )}
              <ContextContainer>
                <Box>
                  <Title order={5}>{t('permissionsData.labels.addUsers')}</Title>
                  <Paragraph>{t('permissionsData.labels.addUsersDescription')}</Paragraph>
                </Box>
                {!isEmpty(USERS_COLUMNS) && !isEmpty(USER_LABELS) && (
                  <TableInput
                    data={usersData}
                    onChange={setUsersData}
                    columns={USERS_COLUMNS}
                    labels={USER_LABELS}
                    showHeaders={false}
                    forceShowInputs
                    sortable={false}
                    onBeforeAdd={checkIfUserIsAdded}
                    resetOnAdd
                    editable
                    unique
                  />
                )}
              </ContextContainer>
              <Stack justifyContent={'end'} fullWidth>
                <Button loading={loading} onClick={handleOnClick}>
                  {sharing
                    ? t('permissionsData.labels.shareButton')
                    : t('permissionsData.labels.saveButton')}
                </Button>
              </Stack>
            </ContextContainer>
          ) : (
            <Alert severity="error" closeable={false}>
              {t('permissionsData.errorMessages.share')}
            </Alert>
          )}
        </ContextContainer>
      )}
    </Box>
  );
};

PermissionsData.propTypes = {
  asset: PropTypes.object,
  loading: PropTypes.bool,
  sharing: PropTypes.bool,
  onNext: PropTypes.func,
  onSavePermissions: PropTypes.func,
  isDrawer: PropTypes.bool,
  drawerTranslations: PropTypes.array,
};

export default PermissionsData;
export { PermissionsData };
