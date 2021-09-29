import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { useEffect, useState } from 'react';
import { Button, Checkbox, FormControl, Input, Select, Textarea } from 'leemons-ui';
import prefixPN from '@calendar/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { listKanbanColumnsRequest } from '@calendar/request';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import tKeys from '@multilanguage/helpers/tKeys';

export default function Task({ isEditing, event, form, data, allFormData, tCommon }) {
  const [t] = useTranslateLoader(prefixPN('task_mode_event_type'));
  const [columns, setColumns] = useState([]);
  const [columnsT, setColumnsT] = useState([]);

  const getKanbanColumns = async () => {
    const { columns: _columns } = await listKanbanColumnsRequest();
    setColumns(_.orderBy(_columns, ['order'], ['asc']));
  };

  const getTranslationColumns = async () => {
    const keys = _.map(columns, 'nameKey');
    const { items } = await getLocalizationsByArrayOfItems(keys);
    setColumnsT(items);
  };

  const getColumnName = (name) => tKeys(name, columnsT);

  useEffect(() => {
    if (event) {
      if (_.isObject(event.data)) {
        _.forIn(event.data, (value, key) => {
          form.setValue(key, value);
        });
      }
    }
    getKanbanColumns();
  }, []);

  useEffect(() => {
    getTranslationColumns();
  }, [columns]);

  const addSubTask = () => {
    let subtask = form.getValues('subtask');
    if (!subtask) subtask = [];
    subtask.push({
      checked: false,
      title: '',
    });
    form.setValue('subtask', subtask);
  };

  const onInputCheckboxChange = (e, index) => {
    const subtask = form.getValues('subtask');
    subtask[index].title = e.target.value;
    form.setValue('subtask', subtask);
  };
  const onCheckedChange = (e, index) => {
    const subtask = form.getValues('subtask');
    subtask[index].checked = e.target.checked;
    form.setValue('subtask', subtask);
  };
  const removeSubtask = (index) => {
    const subtask = form.getValues('subtask');
    subtask.splice(index, 1);
    form.setValue('subtask', subtask);
  };

  const subtasks = form.watch('subtask');

  return (
    <div>
      <FormControl
        label={t('description')}
        className="w-full"
        formError={_.get(form.formState.errors, `description`)}
      >
        <Textarea className="w-full" outlined={true} {...form.register(`description`)} />
      </FormControl>
      <div>
        <FormControl
          label={t('subtask')}
          className="w-full"
          formError={_.get(form.formState.errors, `subtask`)}
        />
        {subtasks ? (
          <>
            {subtasks.map((subtask, index) => (
              <div key={index} className="relative">
                <FormControl
                  label={
                    <Input
                      outlined={true}
                      value={subtask.title}
                      onChange={(e) => onInputCheckboxChange(e, index)}
                    />
                  }
                  labelPosition="right"
                >
                  <Checkbox checked={subtask.checked} onChange={(e) => onCheckedChange(e, index)} />
                  <Button
                    className="absolute right-1 top-1"
                    type="button"
                    color="error"
                    onClick={() => removeSubtask(index)}
                  >
                    Borrar
                  </Button>
                </FormControl>
              </div>
            ))}
          </>
        ) : null}
        <Button type="button" color="primary" onClick={addSubTask}>
          {t('add_subtask')}
        </Button>
      </div>
      {columns && columns.length ? (
        <Select
          outlined
          {...form.register(`column`, {
            required: tCommon('required'),
          })}
        >
          {columns.map((column) => (
            <option key={column.id} value={column.id}>
              {getColumnName(column.nameKey)}
            </option>
          ))}
        </Select>
      ) : null}
    </div>
  );
}

Task.propTypes = {
  isEditing: PropTypes.bool,
  event: PropTypes.object,
  form: PropTypes.object,
  data: PropTypes.object,
  allFormData: PropTypes.object,
  tCommon: PropTypes.func,
};
