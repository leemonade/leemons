import * as _ from 'lodash';
import { useSession } from '@users/session';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { getProfileRequest } from '@users/request';
import { withLayout } from '@layout/hoc';
import { goLoginPage } from '@users/navigate';
import {
  Button,
  FormControl,
  Input,
  Label,
  Modal,
  PageContainer,
  PageHeader,
  Radio,
  Table,
  useModal,
} from 'leemons-ui';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@families/helpers/prefixPN';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert } from '@layout/alert';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';
import { getDatasetFormRequest, searchUsersRequest } from '@families/request';
import moment from 'moment';
import { UserImage } from '@common/userImage';
import { useAsync } from '@common/useAsync';
import formWithTheme from '@common/formWithTheme';

function SearchUsersModal({ t, type, alreadyExistingMembers, onAdd = () => {} }) {
  const { t: tCommonForm } = useCommonTranslate('forms');
  const [selectedFilter, setSelectedFilter] = useState('name');
  const [loading, setLoading] = useState(false);
  const [error, setError, ErrorAlert] = useRequestErrorMessage();
  const [users, setUsers] = useState();
  const [inputValue, setInputValue] = useState('');
  const [inputValueRequired, setInputValueRequired] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

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
    if (selectedUser) {
      onAdd(selectedUser);
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
  if (!users) {
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
        <Table columns={tableHeaders} data={users} />
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
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();

  const [modal, toggleModal] = useModal({
    animated: true,
    title: t(`assign_${addType}_to_family`),
  });

  const [form, formActions] = formWithTheme(datasetConfig?.jsonSchema, datasetConfig?.jsonUI);

  const guardians = watch('guardian') || [];
  const students = watch('student') || [];
  const members = guardians.concat(students);

  const load = useMemo(
    () => async () => {
      setLoading(true);
      let family = null;
      if (_.isArray(router.query.id)) {
        family = await getProfileRequest(router.query.id[0]);
        family = family.family;
      }
      const { jsonSchema, jsonUI } = await getDatasetFormRequest();
      _.forIn(jsonUI, (value) => {
        value['ui:className'] = 'w-4/12';
      });
      jsonUI['ui:className'] = 'gap-6';
      return { family, familyDatasetForm: { jsonSchema, jsonUI } };
    },
    []
  );

  const onSuccess = useMemo(
    () => ({ family, familyDatasetForm }) => {
      if (family) {
        setValue('name', family.name);
        setFamily(family);
        setIsEditMode(false);
      } else {
        setIsEditMode(true);
      }
      setDatasetConfig(familyDatasetForm);
      setLoading(false);
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

  async function save(data) {
    try {
      setSaveLoading(true);

      console.log(data);
      /*;
      let response;
      if (family && family.id) {
        response = await updateProfileRequest({
          ...data,
          id: family.id,
        });
        addSuccessAlert(t('update_done'));
      } else {
        response = await addProfileRequest(data);
        addSuccessAlert(t('save_done'));
      }

      setSaveLoading(false);
      goDetailProfilePage(response.family.uri);

       */
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
      setSaveLoading(false);
    }
  }

  const onSubmit = async (data) => {
    formActions.submit();
    console.log(formActions.getErrors());
    if (!formActions.getErrors().length) {
      await save({ ...data, datasetValues: formActions.getValues() });
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

  return (
    <>
      {!error && !loading ? (
        <>
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
                isEditMode ? register('name', { required: tCommonForm('required') }) : null
              }
              registerFormTitleErrors={errors.name}
              titlePlaceholder={t('title_placeholder')}
              title={watch('name')}
              saveButton={isEditMode ? tCommonHeader('save') : null}
              saveButtonLoading={saveLoading}
              onSaveButton={() => formActions.submit()}
              cancelButton={isEditMode ? tCommonHeader('cancel') : null}
              onCancelButton={onCancelButton}
              editButton={isEditMode ? null : tCommonHeader('edit')}
              onEditButton={onEditButton}
            />

            <div className="bg-primary-content">
              <PageContainer>
                <div className="flex flex-row gap-6">
                  {/* Guardians section */}
                  <div className="w-full">
                    <div className="flex flex-row justify-between items-center">
                      <div>{t('guardians')}</div>
                      {guardians.length < 2 ? (
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
                          </div>
                          <TrashIcon
                            className="w-5 ml-2 cursor-pointer"
                            onClick={() => removeMember('guardian', guardian.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Students section */}
                  <div className="w-full">
                    <div className="flex flex-row justify-between items-center">
                      <div>{t('students')}</div>
                      <Button type="button" color="secondary" onClick={onAddStudent}>
                        <PlusIcon className="w-6 h-6 mr-1" />
                        {t('add_student')}
                      </Button>
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
                          <TrashIcon
                            className="w-5 ml-2 cursor-pointer"
                            onClick={() => removeMember('student', student.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PageContainer>
            </div>
          </form>

          <div className="bg-primary-content">
            <PageContainer>
              {/* Dataset form */}
              {form}
            </PageContainer>
          </div>
        </>
      ) : (
        <ErrorAlert />
      )}
    </>
  );
}

export default withLayout(Detail);
