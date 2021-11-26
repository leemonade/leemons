import { useCallback, useState } from 'react';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { useRouter } from 'next/router';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@calendar/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { PageContainer, PageHeader } from 'leemons-ui';
import { useAsync } from '@common/useAsync';
import * as _ from 'lodash';
import listLevels from '@classroom/services/levels/listLevels';
import listLevelSchemas from '@classroom/services/levelSchemas/listLevelSchemas';
import LevelSchemaSelect from '@calendar/components/level-schema-select';
import { addClassroomLevelRequest } from '@calendar/request';
import { addErrorAlert } from '@layout/alert';

function ClassroomAdd() {
  const session = useSession({ redirectTo: goLoginPage });

  const [t] = useTranslateLoader(prefixPN('classroom_detail'));
  const { t: tCommonHeader } = useCommonTranslate('page_header');
  const { t: tCommonForm } = useCommonTranslate('forms');

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [data, setData] = useState(null);
  const [levelSchemas, setLevelSchemas] = useState(null);

  const [values, setValues] = useState([]);
  const [needOneValueError, setNeedOneValueError] = useState(null);
  const [trySend, setTrySend] = useState(false);

  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();

  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    if (session && router.isReady && router.query && _.isArray(router.query.id)) {
      const id = router.query.id[0];
      let _config = null;

      const _levels = await listLevels(session.locale);
      const _levelSchemas = await listLevelSchemas(session.locale);

      return { _config, _levels, _levelSchemas };
    }
    return null;
  }, [router, session]);

  const onSuccess = useCallback((_data) => {
    if (_data) {
      const { _config, _levels, _levelSchemas } = _data;

      // Process levels
      const levelsBySchema = _.groupBy(_levels, 'schema');
      _.forEach(_levelSchemas, (levelSchema) => {
        levelSchema.levels = levelsBySchema[levelSchema.id] || [];
      });

      const orderedSchemas = (parent = null) => {
        const schemas = _.filter(_levelSchemas, { parent });
        _.forEach(schemas, (schema) => {
          schema.childSchemas = orderedSchemas(schema.id);
        });
        return schemas;
      };

      // Config
      if (_config) {
      } else {
      }

      setLevelSchemas(orderedSchemas());
      setLoading(false);
    }
  }, []);

  const onError = useCallback((e) => {
    // ES: 4001 codigo de que aun no existe schema, como es posible ignoramos el error
    if (e.code !== 4001) {
      setError(e);
    }
    setLoading(false);
  }, []);

  useAsync(load, onSuccess, onError, [router]);

  const onSubmit = async () => {
    try {
      setSaveLoading(true);
      setTrySend(true);
      const error = getError(values);
      setNeedOneValueError(error);
      if (!error) {
        const { config: _config } = await addClassroomLevelRequest({
          level: values[values.length - 1].id,
        });
        await router.push(`/calendar/config/classroom/calendars/${_config.id}`);
      }
      setSaveLoading(false);
    } catch (e) {
      // e.code === 5001
      addErrorAlert(getErrorMessage(e));
      setSaveLoading(false);
    }
  };

  const getError = (v) => {
    let error = null;
    const centerLevel = _.find(v, { properties: { isCenter: true } });
    if (!centerLevel) error = 'min_select_center';
    return error;
  };

  const onDeleteButton = async () => {};

  const onLevelSchemaChange = (ev) => {
    setValues(ev);
    if (trySend) {
      setNeedOneValueError(getError(ev));
    }
  };

  return (
    <>
      {!error && !loading ? (
        <>
          <PageHeader
            title={t('title')}
            onSaveButton={onSubmit}
            saveButton={tCommonHeader('save')}
            saveButtonLoading={saveLoading}
            cancelButton={data?.id ? tCommonHeader('delete') : null}
            onCancelButton={onDeleteButton}
          />
          <div className="bg-primary-content">
            <PageContainer>
              <div className="page-description max-w-screen-sm">{t('description')}</div>
              <div>{t('create_school')}</div>
              <div>{t('create_school_description')}</div>

              <LevelSchemaSelect
                levelSchema={levelSchemas[0]}
                values={values}
                onChange={onLevelSchemaChange}
              />

              {trySend ? t(needOneValueError) : null}
            </PageContainer>
          </div>
        </>
      ) : (
        <ErrorAlert />
      )}
    </>
  );
}

export default withLayout(ClassroomAdd);
