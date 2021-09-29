import * as _ from 'lodash';
import { useSession } from '@users/session';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import { withLayout } from '@layout/hoc';
import { goLoginPage } from '@users/navigate';
import {
  Alert,
  Button,
  FormControl,
  Input,
  Label,
  Modal,
  PageContainer,
  PageHeader,
  Radio,
  Select,
  Table,
  useModal,
} from 'leemons-ui';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@families/helpers/prefixPN';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';
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
import { UserImage } from '@common/userImage';
import { useAsync } from '@common/useAsync';
import formWithTheme from '@common/formWithTheme';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import hooks from 'leemons-hooks';
import { dynamicImport } from '@common/dynamicImport';
import { PackageManagerService } from '@package-manager/services';
import RelationSelect from '@families/components/relationSelect';

function SearchUsersModal({ t, type, alreadyExistingMembers, onAdd = () => {} }) {
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
        accessor: (currentUser) => {
          return (
            <div className="text-left">
              <FormControl>
                <Radio
                  name="searchUserModalUser"
                  color="primary"
                  checked={currentUser.id === selectedUser?.id}
                  onChange={() => setSelectedUser(currentUser)}
                  value={currentUser.id}
                />
              </FormControl>
            </div>
          );
        },
        className: 'text-left',
      },
      {
        Header: t('table.email'),
        accessor: (field) => (
          <div className="flex flex-row items-center">
            <UserImage />
            <span className="pl-2">{field.email}</span>
          </div>
        ),
        className: 'text-left',
      },
      {
        Header: t('table.name'),
        accessor: ({ name }) => <div className="text-center">{name}</div>,
        className: 'text-center',
      },
      {
        Header: t('table.surname'),
        accessor: ({ surname }) => <div className="text-center">{surname}</div>,
        className: 'text-center',
      },
      {
        Header: t('table.created_at'),
        accessor: ({ created_at }) => {
          return moment(created_at).format('L');
        },
        className: 'text-center',
      },
    ],
    [t, selectedUser]
  );

  const add = async () => {
    setDirty(true);
    let value = {};
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
      <>
        <div className="text-sm text-secondary mb-6">{t('search_user_to_add')}</div>
        <FormControl multiple={true}>
          <div className="flex flex-row gap-4">
            <Label text={t('search_by_name')} labelPosition="right">
              <Radio
                name="searchUsersFilter"
                checked={selectedFilter === 'name'}
                onChange={(e) => setSelectedFilter(e.target.value)}
                color="primary"
                value="name"
              />
            </Label>
            <Label text={t('search_by_email')} labelPosition="right">
              <Radio
                name="searchUsersFilter"
                checked={selectedFilter === 'email'}
                onChange={(e) => setSelectedFilter(e.target.value)}
                color="primary"
                value="email"
              />
            </Label>
          </div>
        </FormControl>
        <FormControl formError={inputValueRequired ? { message: tCommonForm('required') } : null}>
          <Input
            outlined={true}
            className="w-full mt-6"
            placeholder={t(`enter_${selectedFilter}`)}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </FormControl>
        {users ? (
          <Alert className="mt-4" color="error">
            <label>{t('no_users_to_add')}</label>
          </Alert>
        ) : null}
        <div className="text-right mt-6">
          <Button color="primary" loading={loading} onClick={search}>
            {t('search')}
          </Button>
        </div>
      </>
    );
  } else {
    return (
      <div>
        <FormControl
          multiple={true}
          formError={!selectedUser && dirty ? { message: tCommonForm('required') } : null}
        >
          <Table columns={tableHeaders} data={users} />
        </FormControl>

        {type === 'guardian' ? (
          <div className="flex flex-row mt-4 gap-4">
            <FormControl
              label={t('guardian_relation')}
              formError={
                relationError === 'need-relation' ? { message: tCommonForm('required') } : null
              }
            >
              <RelationSelect
                value={selectedRelation}
                onChange={(e) => {
                  setRelationError(null);
                  setSelectedRelation(e.target.value);
                }}
                className="w-full max-w-xs"
              />
            </FormControl>
            {selectedRelation === 'other' ? (
              <FormControl
                label={t('specify_relation')}
                formError={
                  relationError === 'need-other-relation'
                    ? { message: tCommonForm('required') }
                    : null
                }
              >
                <Input
                  outlined={true}
                  value={otherRelationValue}
                  onChange={(e) => {
                    setRelationError(null);
                    setOtherRelationValue(e.target.value);
                  }}
                />
              </FormControl>
            ) : null}
          </div>
        ) : null}

        <div className="text-right mt-6">
          <Button color="primary" loading={loading} onClick={add}>
            {t('add')}
          </Button>
        </div>
      </div>
    );
  }
}

function Detail() {
  useSession({ redirectTo: goLoginPage });

  const [t] = useTranslateLoader(prefixPN('detail_page'));
  const { t: tCommonHeader } = useCommonTranslate('page_header');
  const { t: tCommonForm } = useCommonTranslate('forms');

  const router = useRouter();

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

  const [removeModal, toggleRemoveModal] = useModal({
    animated: true,
    title: t('remove_modal.title'),
    message: t('remove_modal.message'),
    cancelLabel: t('remove_modal.cancel'),
    actionLabel: t('remove_modal.action'),
    onAction: () => deleteFamily(),
  });

  const permissions = useMemo(() => {
    const response = {
      basicInfo: { view: false, update: false },
      customInfo: { view: false, update: false },
      guardiansInfo: { view: false, update: false },
      studentsInfo: { view: false, update: false },
    };
    const permissionsByName = _.keyBy(_permissions, 'permissionName');
    _.forIn(response, (value, key) => {
      const info = permissionsByName[constants.permissions[key]];
      if (info) {
        if (info.actionNames.indexOf('view') >= 0) value.view = true;
        if (info.actionNames.indexOf('update') >= 0) value.update = true;
      }
    });
    return response;
  }, [_permissions]);

  const [modal, toggleModal] = useModal({
    animated: true,
    title: t(`assign_${addType}_to_family`),
  });

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
      if (router.isReady) {
        let family = null;
        if (_.isArray(router.query.id)) {
          family = await detailFamilyRequest(router.query.id[0]);
          family = family.family;
        }
        let familyDatasetForm = null;
        try {
          const { jsonSchema, jsonUI } = await getDatasetFormRequest();
          jsonUI['ui:className'] = 'grid grid-cols-3 gap-6';
          familyDatasetForm = { jsonSchema, jsonUI };
        } catch (e) {}
        const [{ permissions }, phoneNumbersInstalled] = await Promise.all([
          getPermissionsWithActionsIfIHaveRequest([
            constants.permissions.basicInfo,
            constants.permissions.customInfo,
            constants.permissions.guardiansInfo,
            constants.permissions.studentsInfo,
          ]),
          PackageManagerService.isPluginInstalled('leemons-plugin-families-emergency-numbers'),
        ]);

        return { family, familyDatasetForm, permissions, phoneNumbersInstalled };
      }
    },
    [router]
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
        ? dynamicImport('families-emergency-numbers/components/phoneNumbers')
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
      await router.push(`/families/private/detail/${response.family.id}`);
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
      await router.push(`/families/private/list`);
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
    if (family?.id) {
      setIsEditMode(false);
    } else {
      router.push('/families/private/list');
    }
  };

  const onDeleteButton = () => {
    toggleRemoveModal();
  };

  const onAddGuardian = () => {
    setAddType('guardian');
    toggleModal();
  };

  const onAddStudent = () => {
    setAddType('student');
    toggleModal();
  };

  const addMember = (member) => {
    let value = getValues(addType);
    value = value || [];
    setValue(addType, [...value, member]);
    toggleModal();
  };

  const removeMember = (type, memberId) => {
    let value = getValues(type);
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
          <Modal {...removeModal} />
          <Modal {...modal} className="max-w-xl">
            <SearchUsersModal
              t={t}
              type={addType}
              alreadyExistingMembers={members}
              onAdd={addMember}
            />
          </Modal>
          <form onSubmit={handleSubmit(onSubmit)}>
            <PageHeader
              registerFormTitle={
                isEditMode
                  ? permissions.basicInfo.update
                    ? register('name', { required: tCommonForm('required') })
                    : null
                  : null
              }
              registerFormTitleErrors={errors.name}
              titlePlaceholder={t('title_placeholder')}
              title={watch('name')}
              saveButton={isEditMode ? tCommonHeader('save') : null}
              saveButtonLoading={saveLoading}
              onSaveButton={() => (formActions.isLoaded() ? formActions.submit() : null)}
              cancelButton={
                isEditMode ? tCommonHeader('cancel') : family?.id ? tCommonHeader('delete') : null
              }
              onCancelButton={(e) => (isEditMode ? onCancelButton(e) : onDeleteButton(e))}
              editButton={isEditMode ? null : tCommonHeader('edit')}
              onEditButton={onEditButton}
            />
            <div className="bg-primary-content">
              <PageContainer>
                <div className="flex flex-row gap-6">
                  {/* Guardians section */}
                  {permissions.guardiansInfo.view ? (
                    <div className="w-full">
                      <div className="flex flex-row justify-between items-center">
                        <div>{t('guardians')}</div>
                        {isEditMode && guardians.length < 2 && permissions.guardiansInfo.update ? (
                          <Button type="button" color="secondary" onClick={onAddGuardian}>
                            <PlusIcon className="w-6 h-6 mr-1" />
                            {t('add_guardian')}
                          </Button>
                        ) : null}
                      </div>
                      {/* Guardians list */}
                      <div className="flex flex-row">
                        {guardians.map((guardian) => (
                          <div key={guardian.id} className="flex flex-row items-center p-4">
                            <div>
                              <UserImage user={guardian} />
                            </div>
                            <div className="ml-2">
                              {guardian.name} {guardian.surname || ''}
                              <div>
                                {t(
                                  guardian.memberType.replace('plugins.families.detail_page.', '')
                                )}
                              </div>
                            </div>
                            {isEditMode && permissions.guardiansInfo.update ? (
                              <TrashIcon
                                className="w-5 ml-2 cursor-pointer"
                                onClick={() => removeMember('guardian', guardian.id)}
                              />
                            ) : null}
                          </div>
                        ))}
                      </div>
                      {/* Guardians marital status */}
                      {guardians.length >= 2 && permissions.guardiansInfo.view ? (
                        <div className="flex">
                          <FormControl
                            label={t('guardian_relation')}
                            formError={errors.maritalStatus}
                          >
                            <Select
                              {...register('maritalStatus')}
                              outlined={true}
                              disabled={!permissions.guardiansInfo.update}
                            >
                              <option value="..." disabled={true}>
                                {t('maritalStatus.select_marital_status')}
                              </option>
                              <option value={t('maritalStatus.married', undefined, true)}>
                                {t('maritalStatus.married')}
                              </option>
                              <option value={t('maritalStatus.divorced', undefined, true)}>
                                {t('maritalStatus.divorced')}
                              </option>
                              <option value={t('maritalStatus.domestic_partners', undefined, true)}>
                                {t('maritalStatus.domestic_partners')}
                              </option>
                              <option value={t('maritalStatus.cohabitants', undefined, true)}>
                                {t('maritalStatus.cohabitants')}
                              </option>
                              <option value={t('maritalStatus.separated', undefined, true)}>
                                {t('maritalStatus.separated')}
                              </option>
                            </Select>
                          </FormControl>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Students section */}
                  {permissions.studentsInfo.view ? (
                    <div className="w-full">
                      <div className="flex flex-row justify-between items-center">
                        <div>{t('students')}</div>
                        {isEditMode && permissions.studentsInfo.update ? (
                          <Button type="button" color="secondary" onClick={onAddStudent}>
                            <PlusIcon className="w-6 h-6 mr-1" />
                            {t('add_student')}
                          </Button>
                        ) : null}
                      </div>
                      {/* Students list */}
                      <div className="flex flex-row">
                        {students.map((student) => (
                          <div key={student.id} className="flex flex-row items-center p-4">
                            <div>
                              <UserImage user={student} />
                            </div>
                            <div className="ml-2">
                              {student.name} {student.surname || ''}
                            </div>
                            {isEditMode && permissions.studentsInfo.update ? (
                              <TrashIcon
                                className="w-5 ml-2 cursor-pointer"
                                onClick={() => removeMember('student', student.id)}
                              />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </PageContainer>
            </div>
          </form>

          {permissions.customInfo.view ? (
            <div className="bg-primary-content">
              <PageContainer>
                <div>{t('other_information')}</div>
                {/* Dataset form */}
                {form}
              </PageContainer>
            </div>
          ) : null}

          <EmergencyNumbers
            editMode={isEditMode}
            onChangePhoneNumbers={onChangePhoneNumbers}
            phoneNumbers={watch('emergencyPhoneNumbers')}
          />
        </>
      ) : (
        <ErrorAlert />
      )}
    </>
  );
}

export default withLayout(Detail);
