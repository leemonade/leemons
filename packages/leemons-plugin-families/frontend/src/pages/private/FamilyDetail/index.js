import * as _ from 'lodash';
import { useForm } from 'react-hook-form';
import React, { useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import {
  Alert,
  Button,
  TextInput,
  Modal,
  PageContainer,
  RadioGroup,
  Radio,
  Box,
  Textarea,
  Select,
  ContextContainer,
  Title,
  Stack,
  Table,
  Text,
  UserDisplayItem,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import {
  DeleteBinIcon,
  FamilyChildIcon,
  SingleActionsGraduateMaleIcon,
} from '@bubbles-ui/icons/outline';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@families/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import {
  addFamilyRequest,
  detailFamilyRequest,
  getDatasetFormRequest,
  removeFamilyRequest,
  searchUsersRequest,
  updateFamilyRequest,
} from '@families/request';
import { constants } from '@families/constants';
import moment from 'moment';
import { useAsync } from '@common/useAsync';
import formWithTheme from '@common/formWithTheme';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import hooks from 'leemons-hooks';
import { PackageManagerService } from '@package-manager/services';
import RelationSelect from '@families/components/relationSelect';
import loadable from '@loadable/component';
import { SearchUserDrawer, UserListBox } from '@families/components/';

function dynamicImport(component) {
  return loadable(() =>
    import(
      /* webpackInclude: /(families-emergency-numbers.+)\.js/ */ `@leemons/plugins${component}.js`
    )
  );
}

function SearchUsersModal({ t, type, alreadyExistingMembers, onAdd = () => { } }) {
  const { t: tCommonForm } = useCommonTranslate('forms');
  const [selectedFilter, setSelectedFilter] = useState('name');
  const [loading, setLoading] = useState(false);
  const [error, setError, ErrorAlert] = useRequestErrorMessage();
  const [users, setUsers] = useState();
  const [inputValue, setInputValue] = useState('');
  const [inputValueRequired, setInputValueRequired] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedRelation, setSelectedRelation] = useState('...');
  const [otherRelationValue, setOtherRelationValue] = useState('');
  const [relationError, setRelationError] = useState();
  const [dirty, setDirty] = useState(false);

  const tableHeaders = useMemo(
    () => [
      {
        Header: ' ',
        accessor: (currentUser) => (
          <Radio
            name="searchUserModalUser"
            checked={currentUser.id === selectedUser?.id}
            onChange={() => setSelectedUser(currentUser)}
            value={currentUser.id}
          />
        ),
      },
      {
        Header: t('table.email'),
        accessor: (field) => <UserDisplayItem {...field} variant="email" />,
      },
      {
        Header: t('table.name'),
        accessor: ({ name }) => <Text>{name}</Text>,
      },
      {
        Header: t('table.surname'),
        accessor: ({ surnames }) => <Text>{surnames}</Text>,
      },
      {
        Header: t('table.created_at'),
        accessor: ({ created_at }) => moment(created_at).format('L'),
      },
    ],
    [t, selectedUser]
  );

  const add = async () => {
    setDirty(true);
    const value = {};
    if (type === 'guardian') {
      if (!selectedRelation || selectedRelation === '...') {
        setRelationError('need-relation');
        return;
      }
      if (selectedRelation === 'other' && !otherRelationValue) {
        setRelationError('need-other-relation');
        return;
      }
      value.memberType = selectedRelation === 'other' ? otherRelationValue : selectedRelation;
    }
    if (selectedUser) {
      onAdd({ ...selectedUser, ...value });
    }
  };

  const search = async () => {
    try {
      setInputValueRequired(false);
      if (!inputValue) {
        setInputValueRequired(true);
        return false;
      }
      setLoading(true);
      const query = {
        ignoreUserIds: _.map(alreadyExistingMembers, 'id'),
      };
      if (selectedFilter === 'name') {
        query.user = {
          name: inputValue,
          surnames: inputValue,
        };
      }
      if (selectedFilter === 'email') {
        query.user = {
          email: inputValue,
        };
      }
      const { users } = await searchUsersRequest(type, query);
      setUsers(users);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  if (error) return <ErrorAlert />;
  if (!users || !users.length) {
    return (
      <Stack direction="column" spacing={2}>
        <RadioGroup
          label={t('search_user_to_add')}
          name="searchUsersFilter"
          data={[
            { value: 'name', label: t('search_by_name') },
            { value: 'email', label: t('search_by_email') },
          ]}
          onChange={setSelectedFilter}
        />
        <TextInput
          placeholder={t(`enter_${selectedFilter}`)}
          error={inputValueRequired ? tCommonForm('required') : ''}
          value={inputValue}
          onChange={setInputValue}
        />
        {users && <Alert severity="error">{t('no_users_to_add')}</Alert>}
        <Box>
          <Button loading={loading} onClick={search}>
            {t('search')}
          </Button>
        </Box>
      </Stack>
    );
  }
  return (
    <Box>
      {/* <FormControl
        multiple={true}
        formError={!selectedUser && dirty ? { message: tCommonForm('required') } : null}
      > */}
      <Table columns={tableHeaders} data={users} />
      {type === 'guardian' ? (
        <Stack spacing={4}>
          <RelationSelect
            label={t('guardian_relation')}
            error={relationError === 'need-relation' ? tCommonForm('required') : ''}
            value={selectedRelation}
            onChange={(e) => {
              setRelationError(null);
              setSelectedRelation(e);
            }}
          />
          {selectedRelation === 'other' && (
            <TextInput
              label={t('specify_relation')}
              error={relationError === 'need-other-relation' ? tCommonForm('required') : ''}
              value={otherRelationValue}
              onChange={(e) => {
                setRelationError(null);
                setOtherRelationValue(e);
              }}
            />
          )}
        </Stack>
      ) : null}
      <Box>
        <Button color="primary" loading={loading} onClick={add}>
          {t('add')}
        </Button>
      </Box>
    </Box>
  );
}

function Detail() {
  const [t] = useTranslateLoader(prefixPN('detail_page'));
  const { t: tCommonHeader } = useCommonTranslate('page_header');
  const { t: tCommonForm } = useCommonTranslate('forms');

  const history = useHistory();
  const params = useParams();

  const {
    register,
    setValue,
    watch,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm();

  const [addType, setAddType] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [datasetConfig, setDatasetConfig] = useState(false);
  const [datasetData, setDatasetData] = useState(false);
  const [emergencyNumberIsInstalled, setEmergencyNumberIsInstalled] = useState(false);
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [_permissions, setPermissions] = useState([]);
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();
  const [removeModalOpened, setRemoveModalOpened] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);

  const permissions = useMemo(() => {
    const response = {
      basicInfo: { view: false, update: false },
      customInfo: { view: false, update: false },
      guardiansInfo: { view: false, update: false },
      studentsInfo: { view: false, update: false },
    };
    const permissionsByName = _.keyBy(_permissions, 'permissionName');
    _.forIn(response, (value, key) => {
      const info = permissionsByName[constants?.permissions[key]];
      if (info) {
        if (info.actionNames.indexOf('view') >= 0) value.view = true;
        if (info.actionNames.indexOf('update') >= 0) value.update = true;
      }
    });
    return response;
  }, [_permissions]);

  const goodDatasetConfig = useMemo(() => {
    const response = _.cloneDeep(datasetConfig);
    if (!isEditMode) {
      if (response && response.jsonSchema) {
        _.forIn(response.jsonSchema.properties, (value, key) => {
          if (!response.jsonUI[key]) response.jsonUI[key] = {};
          response.jsonUI[key]['ui:readonly'] = true;
        });
      }
    }
    return response;
  }, [datasetConfig, isEditMode]);
  const datasetProps = useMemo(() => ({ formData: datasetData }), [datasetData]);

  const [form, formActions] = formWithTheme(
    goodDatasetConfig?.jsonSchema,
    goodDatasetConfig?.jsonUI,
    undefined,
    datasetProps
  );

  const guardians = watch('guardian') || [];
  const students = watch('student') || [];
  const members = guardians.concat(students);

  const load = useMemo(
    () => async () => {
      setLoading(true);
      let family = null;
      if (params.id) {
        family = await detailFamilyRequest(params.id);
        family = family.family;
      }
      let familyDatasetForm = null;
      try {
        const { jsonSchema, jsonUI } = await getDatasetFormRequest();
        jsonUI['ui:className'] = 'grid grid-cols-3 gap-6';
        familyDatasetForm = { jsonSchema, jsonUI };
      } catch (e) { }
      const [{ permissions }, phoneNumbersInstalled] = await Promise.all([
        getPermissionsWithActionsIfIHaveRequest([
          constants?.permissions.basicInfo,
          constants?.permissions.customInfo,
          constants?.permissions.guardiansInfo,
          constants?.permissions.studentsInfo,
        ]),
        PackageManagerService.isPluginInstalled('leemons-plugin-families-emergency-numbers'),
      ]);

      return { family, familyDatasetForm, permissions, phoneNumbersInstalled };
    },
    [params.id]
  );

  const onSuccess = useMemo(
    () => (data) => {
      if (data) {
        const { family, familyDatasetForm, permissions, phoneNumbersInstalled } = data;
        if (family) {
          setValue('name', family.name);
          setValue('maritalStatus', family.maritalStatus);
          setValue('guardian', family.guardians);
          setValue('student', family.students);
          setValue('emergencyPhoneNumbers', family.emergencyPhoneNumbers);
          setDatasetData(family.datasetValues);
          setFamily(family);
          setIsEditMode(false);
        } else {
          setValue('maritalStatus', '...');
          setIsEditMode(true);
        }
        if (familyDatasetForm) setDatasetConfig(familyDatasetForm);
        setPermissions(permissions);
        setEmergencyNumberIsInstalled(phoneNumbersInstalled);
        setLoading(false);
      }
    },
    []
  );

  const onError = useMemo(
    () => (e) => {
      // ES: 4001 codigo de que aun no existe schema, como es posible ignoramos el error
      if (e.code !== 4001) {
        setError(e);
      }
      setLoading(false);
    },
    []
  );

  useAsync(load, onSuccess, onError);

  const EmergencyNumbers = useMemo(
    () =>
      emergencyNumberIsInstalled
        ? dynamicImport('/families-emergency-numbers/src/components/phoneNumbers')
        : null,
    [emergencyNumberIsInstalled]
  );

  async function save(data) {
    try {
      setSaveLoading(true);

      const dataToSend = { ...data };
      if (_.isArray(dataToSend.guardian)) {
        dataToSend.guardians = _.map(dataToSend.guardian, (g) => ({
          user: g.id,
          memberType: g.memberType,
        }));
        delete dataToSend.guardian;
      }
      if (_.isArray(dataToSend.student)) {
        dataToSend.students = _.map(dataToSend.student, (g) => ({
          user: g.id,
          memberType: 'student',
        }));
        delete dataToSend.student;
      }

      let response;
      if (family && family.id) {
        response = await updateFamilyRequest({
          ...dataToSend,
          id: family.id,
        });
        addSuccessAlert(t('update_done'));
      } else {
        response = await addFamilyRequest(dataToSend);
        addSuccessAlert(t('save_done'));
      }

      setSaveLoading(false);
      await hooks.fireEvent('menu-builder:reset-menu');
      await history.push(`/private/families/detail/${response.family.id}`);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
      setSaveLoading(false);
    }
  }

  const deleteFamily = async () => {
    try {
      await removeFamilyRequest(family.id);
      addSuccessAlert(t('deleted_done'));
      await hooks.fireEvent('menu-builder:reset-menu');
      await history.push(`/private/families/list`);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  const onSubmit = async (data) => {
    const toSend = { ...data };
    let errors = [];
    if (formActions.isLoaded()) {
      formActions.submit();
      errors = formActions.getErrors();
      toSend.datasetValues = formActions.getValues();
    }
    if (!errors.length) {
      await save(toSend);
    }
  };

  const onEditButton = () => {
    setIsEditMode(true);
  };

  const onCancelButton = () => {
    if (family.id) {
      setIsEditMode(false);
    } else {
      history.push('/private/families/list');
    }
  };

  const onDeleteButton = () => {
    setRemoveModalOpened(false);
  };

  const onAddGuardian = () => {
    setAddType('guardian');
    setModalOpened(true);
  };

  const onAddStudent = () => {
    setAddType('student');
    setModalOpened(true);
  };

  const addMember = (member) => {
    let value = getValues(addType);
    value = value || [];
    setValue(addType, [...value, member]);
    setModalOpened(!modalOpened);
  };

  const removeMember = (type, memberId) => {
    const value = getValues(type);
    const index = _.findIndex(value, { id: memberId });
    value.splice(index, 1);
    setValue(type, [...value]);
  };

  const onChangePhoneNumbers = (e) => {
    setValue('emergencyPhoneNumbers', e);
  };

  return (
    <>
      {!error && !loading ? (
        <>
          <Modal
            opened={removeModalOpened}
            onClose={() => setRemoveModalOpened(false)}
            title={t('remove_modal.title')}
          >
            <Stack direction="column" spacing={4}>
              <Text>{t('remove_modal.message')}</Text>
              <Stack justifyContent="space-between" spacing={4}>
                <Button onClick={() => setRemoveModalOpened(false)}>Cancel</Button>
                <Button onClick={deleteFamily}>Remove</Button>
              </Stack>
            </Stack>
          </Modal>
          {/* <Modal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            title={t(`assign_${addType}_to_family`)}
          >
            <SearchUsersModal
              t={t}
              type={addType}
              alreadyExistingMembers={members}
              onAdd={addMember}
            />
          </Modal> */}
          <SearchUserDrawer
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            onBack={() => setModalOpened(false)}
            t={t}
            type={addType}
            alreadyExistingMembers={members}
            onAdd={addMember}
          />
          <AdminPageHeader
            values={{ title: watch('name') }}
            placeholders={{ title: t('title_placeholder') }}
            editMode={isEditMode}
            loading={saveLoading}
            // registerFormTitle={
            //   isEditMode
            //     ? permissions.basicInfo.update
            //       ? register('name', { required: tCommonForm('required') })
            //       : null
            //     : null
            // }
            // registerFormTitleErrors={errors.name}
            // titlePlaceholder={t('title_placeholder')}
            // saveButtonLoading={saveLoading}
            buttons={{
              new: isEditMode ? tCommonHeader('save') : '',
              edit: isEditMode
                ? tCommonHeader('cancel')
                : family?.id
                  ? tCommonHeader('delete')
                  : '',
              cancel: isEditMode ? '' : tCommonHeader('edit'),
            }}
            onSave={() => (formActions.isLoaded() ? formActions.submit() : null)}
            onCancel={isEditMode ? onCancelButton : onDeleteButton}
            onEdit={onEditButton}
            fullWidth
          />
          <form onSubmit={handleSubmit(onSubmit)}>
            <PageContainer fullWidth>
              <Stack spacing={10} style={{ marginTop: 36, width: '100%' }}>
                <Stack direction="column" spacing={6}>
                  {permissions.guardiansInfo.view && (
                    <UserListBox
                      title={t('guardians')}
                      icon={<FamilyChildIcon height={32} width={32} />}
                      label="No tutors yet"
                      // relationship={'Married'}
                      type={'guardian'}
                      isEditing={isEditMode}
                      data={guardians}
                      onClick={onAddGuardian}
                      onRemove={removeMember}
                      t={t}
                      permissions={permissions}
                    />
                  )}
                  {/*
                  {permissions.guardiansInfo.view ? (
                    <Box>
                      <Stack justifyContent="space-between" alignItems="center">
                        <Box>
                          <Text>{t('guardians')}</Text>
                        </Box>
                        {isEditMode && guardians.length < 2 && permissions.guardiansInfo.update && (
                          <Button type="button" color="secondary" onClick={onAddGuardian}>
                            <PlusIcon className="w-6 h-6 mr-1" />
                            {t('add_guardian')}
                          </Button>
                        )}
                      </Stack>
                      <Stack className="flex flex-row">
                        {guardians.map((guardian) => (
                          <Stack alignItems="center" key={guardian.id}>
                            <UserDisplayItem {...guardian} />
                            <Box className="ml-2">
                              <Text>
                                {guardian.name} {guardian.surname || ''}
                              </Text>
                              <Text>
                                {t(
                                  guardian.memberType.replace('plugins.families.detail_page.', '')
                                )}
                              </Text>
                            </Box>
                            {isEditMode && permissions.guardiansInfo.update && (
                              <DeleteBinIcon
                                onClick={() => removeMember('guardian', guardian.id)}
                              />
                            )}
                          </Stack>
                        ))}
                      </Stack>
                      {guardians.length >= 2 && permissions.guardiansInfo.view ? (
                        <Select
                          label={t('guardian_relation')}
                          data={[
                            { value: '...', label: t('maritalStatus.select_marital_status') },
                            {
                              value: t('maritalStatus.married', undefined, true),
                              label: t('maritalStatus.married', undefined, true),
                            },
                            {
                              value: t('maritalStatus.divorced', undefined, true),
                              label: t('maritalStatus.divorced'),
                            },
                            {
                              value: t('maritalStatus.domestic_partners', undefined, true),
                              label: t('maritalStatus.domestic_partners'),
                            },
                            {
                              value: t('maritalStatus.cohabitants', undefined, true),
                              label: t('maritalStatus.cohabitants'),
                            },
                            {
                              value: t('maritalStatus.separated', undefined, true),
                              label: t('maritalStatus.separated'),
                            },
                          ]}
                          disabled={!permissions.guardiansInfo.update}
                        />
                      ) : null}
                    </Box>
                  ) : null}
                        */}
                  {permissions.studentsInfo.view && (
                    <UserListBox
                      title={t('students')}
                      icon={<SingleActionsGraduateMaleIcon height={32} width={32} />}
                      label="No students yet"
                      // relationship={'Married'}
                      type={'student'}
                      isEditing={isEditMode}
                      data={students}
                      onClick={onAddStudent}
                      onRemove={removeMember}
                      t={t}
                      permissions={permissions}
                    />
                  )}
                  {/*
                  permissions.studentsInfo.view ? (
                    <Box>
                      <Text>{t('students')}</Text>
                      {isEditMode && permissions.studentsInfo.update ? (
                        <Button type="button" color="secondary" onClick={onAddStudent}>
                          <PlusIcon className="w-6 h-6 mr-1" />
                          {t('add_student')}
                        </Button>
                      ) : null}

                      <Stack>
                        {students.map((student) => (
                          <Box key={student.id}>
                            <UserDisplayItem {...student} />
                            {student.name} {student.surname || ''}
                            {isEditMode && permissions.studentsInfo.update && (
                              <DeleteBinIcon onClick={() => removeMember('student', student.id)} />
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  ) : null
                  */}
                </Stack>
                <Stack direction="column" spacing={6} fullWidth>
                  <UserListBox
                    title={'Emergency Phone numbers'}
                    icon={<FamilyChildIcon height={32} width={32} />}
                    label="No Emergency Numbers"
                    // relationship={'Married'}
                    type={'phones'}
                    isEditing={isEditMode}
                    data={students}
                    onClick={onAddStudent}
                    onRemove={removeMember}
                    t={t}
                    permissions={permissions}
                    fullWidth
                  />
                  {permissions.customInfo.view && (
                    <ContextContainer title={t('other_information')}>
                      <TextInput
                        label="CRM Old ID"
                        placeholder="Placeholder"
                        orientation="horizontal"
                      />
                      <Textarea
                        label="Family Address"
                        placeholder="Placeholder"
                        orientation="horizontal"
                      />
                      <TextInput
                        label="Main Contact Phone"
                        placeholder="Placeholder"
                        orientation="horizontal"
                      />
                      <TextInput
                        label="Visa Status"
                        placeholder="Placeholder"
                        orientation="horizontal"
                      />
                      <Select
                        label="Member of public Administration"
                        placeholder="Placeholder"
                        orientation="horizontal"
                        data={[]}
                      />
                    </ContextContainer>
                  )}
                  <ContextContainer title={'Permissions'}></ContextContainer>
                </Stack>
              </Stack>
            </PageContainer>
          </form>
          {/* <EmergencyNumbers
            editMode={isEditMode}
            onChangePhoneNumbers={onChangePhoneNumbers}
            phoneNumbers={watch('emergencyPhoneNumbers')}
          /> */}
        </>
      ) : (
        <ErrorAlert />
      )}
    </>
  );
}

export default Detail;
