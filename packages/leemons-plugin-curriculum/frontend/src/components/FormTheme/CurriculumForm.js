import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Box, TabPanel, Tabs } from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';
import CurriculumTextInput from '@curriculum/components/FormTheme/CurriculumTextInput';
import CurriculumWysiwyg from '@curriculum/components/FormTheme/CurriculumWysiwyg';
import CurriculumList from '@curriculum/components/FormTheme/CurriculumList';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

function CurriculumForm({ id, schema, curriculum, onSave, defaultValues }) {
  const [t] = useTranslateLoader('plugins.multilanguage.formWithTheme');
  const form = useForm({ defaultValues });

  function _onSave(e) {
    return onSave(form.getValues(), e);
  }

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
