import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useStore } from '@common';
import { Box, Loader, TabPanel, Tabs } from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';
import CurriculumTextInput from '@curriculum/components/FormTheme/CurriculumTextInput';
import CurriculumWysiwyg from '@curriculum/components/FormTheme/CurriculumWysiwyg';
import CurriculumList from '@curriculum/components/FormTheme/CurriculumList';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import CurriculumGroup from '@curriculum/components/FormTheme/CurriculumGroup';

function CurriculumForm({ id, schema, curriculum, onSave, defaultValues }) {
  const [store, render] = useStore({ loading: true });
  const [t] = useTranslateLoader('plugins.multilanguage.formWithTheme');
  const form = useForm({ defaultValues });

  React.useEffect(() => {
    store.loading = true;
    render();
    form.reset(defaultValues || {});
    setTimeout(() => {
      store.loading = false;
      render();
    }, 250);
  }, [defaultValues]);

  function _onSave(e) {
    return onSave(form.getValues(), e);
  }

  if (store.loading)
    return (
      <Box sx={(theme) => ({ marginTop: theme.spacing[12] })}>
        <Loader />
      </Box>
    );

  return (
    <Tabs {...(schema.tabProps || {})}>
      {_.map(schema.properties, (value, key) => {
        const { blockData } = value.frontConfig;
        return (
          <TabPanel key={key} label={value.tabTitle || value.title}>
            <Box sx={(theme) => ({ paddingTop: theme.spacing[4] })}>
              <Controller
                control={form.control}
                name={key}
                key={id}
                id={id}
                render={({ field }) => {
                  if (blockData.type === 'field') {
                    return <CurriculumTextInput {...field} schema={value} onSave={_onSave} t={t} />;
                  }
                  if (blockData.type === 'textarea') {
                    return <CurriculumWysiwyg {...field} schema={value} onSave={_onSave} t={t} />;
                  }
                  if (blockData.type === 'list') {
                    return (
                      <CurriculumList
                        {...field}
                        curriculum={curriculum}
                        blockData={blockData}
                        schema={value}
                        onSave={_onSave}
                        id={id}
                        t={t}
                      />
                    );
                  }
                  if (blockData.type === 'group') {
                    return (
                      <CurriculumGroup
                        {...field}
                        curriculum={curriculum}
                        blockData={blockData}
                        schema={value}
                        onSave={_onSave}
                        id={id}
                        t={t}
                      />
                    );
                  }
                }}
              />
            </Box>
          </TabPanel>
        );
      })}
    </Tabs>
  );
}

CurriculumForm.defaultProps = {
  onSave: () => {},
};

CurriculumForm.propTypes = {
  schema: PropTypes.any,
  defaultValues: PropTypes.any,
  curriculum: PropTypes.any,
  id: PropTypes.string,
  onSave: PropTypes.func,
};

export default CurriculumForm;
