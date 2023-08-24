import React from 'react';
import PropTypes from 'prop-types';
// import { Button, Modal, PageContainer, Table, useModal } from 'leemons--ui';

/*
import { Button } from '@bubbles-ui/components';
import { useAsync } from '@common/useAsync';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import * as _ from 'lodash';
import { prefixPN } from '../helpers';
import { constants } from '../constants';

 */

function PhoneNumbers({ editMode, phoneNumbers = [], onChangePhoneNumbers = () => {} }) {
  return 'Hay que cambiar a bubbles-ui';

  /*

  const [loading, setLoading] = useState(true);
  const [_permissions, setPermissions] = useState([]);
  const [tRelations] = useTranslateLoader('plugins.families.detail_page.relations');
  const [t] = useTranslateLoader(prefixPN('phone_numbers'));
  const [phones, setPhones] = useState(phoneNumbers || []);
  const [item, setItem] = useState(null);
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();

  const permissions = useMemo(() => {
    const response = {
      phoneNumbersInfo: { view: false, update: false },
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
    title: item ? t('update_phone_number') : t('new_phone_number'),
  });

  useEffect(() => {
    onChangePhoneNumbers(
      _.map(phones, ({ tmpID, family, created_at, updated_at, ...data }) => ({
        ...data,
      }))
    );
  }, [phones]);

  const load = useMemo(
    () => async () => {
      setLoading(true);
      const [{ permissions }] = await Promise.all([
        getPermissionsWithActionsIfIHaveRequest([constants.permissions.phoneNumbersInfo]),
      ]);

      return { permissions };
    },
    []
  );

  const onSuccess = useMemo(
    () =>
      ({ permissions }) => {
        setPermissions(permissions);
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

  const tableHeaders = useMemo(() => {
    const response = [
      {
        Header: t('name'),
        accessor: 'name',
        className: 'text-left',
      },
      {
        Header: t('phone'),
        accessor: 'phone',
        className: 'text-left',
      },
      {
        Header: t('relation'),
        accessor: ({ relation }) => tRelations(_.last(relation.split('.'))),
        className: 'text-left',
      },
    ];

    if (editMode && permissions.phoneNumbersInfo.update) {
      response.push({
        Header: t('actions'),
        accessor: (field, index) => (
          <div className="text-center">
            <Button color="primary" text onClick={() => editPhone(field)}>
              {t('edit')}
            </Button>
            <Button color="primary" text onClick={() => removePhone(index)}>
              {t('delete')}
            </Button>
          </div>
        ),
        className: 'text-center',
      });
    }

    return response;
  }, [t, permissions, editMode]);

  const addPhone = () => {
    setItem(null);
    toggleModal();
  };

  const editPhone = (phone) => {
    setItem(phone);
    toggleModal();
  };

  const removePhone = (index) => {
    phones.splice(index, 1);
    setPhones([...phones]);
  };

  const onSave = ({ id, tmpID, ...rest }) => {
    if (id) {
      const index = _.findIndex(phones, { id });
      phones[index] = { ...phones[index], ...rest };
    } else if (tmpID) {
      const index = _.findIndex(phones, { tmpID });
      phones[index] = { ...phones[index], ...rest };
    } else {
      phones.push({ ...rest, tmpID: new Date().getTime() });
    }
    setPhones([...phones]);
    toggleModal();
  };

  if (loading) return null;
  if (!permissions.phoneNumbersInfo.view && !permissions.phoneNumbersInfo.update) return null;
*/
  /*
  return (
    <>
      {error ? (
        <ErrorAlert />
      ) : (
        <>
          {editMode && permissions.phoneNumbersInfo.update ? (
            <Modal {...modal}>
              <PhoneNumbersModal t={t} item={item} onSave={onSave} />
            </Modal>
          ) : null}

          <div className="bg-primary-content">
            <PageContainer>
              <div className="flex flex-row justify-between items-center mb-4">
                <div>{t('title')}</div>
                {editMode && permissions.phoneNumbersInfo.update ? (
                  <Button color="secondary" onClick={addPhone}>
                    <PlusIcon className="w-6 h-6 mr-1" />
                    {t('add_number')}
                  </Button>
                ) : null}
              </div>
              <Table columns={tableHeaders} data={phones} />
            </PageContainer>
          </div>
        </>
      )}
    </>
  );

   */
}

PhoneNumbers.propTypes = {
  editMode: PropTypes.bool,
  phoneNumbers: PropTypes.any,
  onChangePhoneNumbers: PropTypes.func,
};

export default PhoneNumbers;
