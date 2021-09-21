import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { FormControl, Radio, Input, Button } from 'leemons-ui';
import { XIcon } from '@heroicons/react/solid';
import { PlusIcon, RefreshIcon } from '@heroicons/react/outline';
import Autosuggest from 'react-autosuggest';

export default function EditLevelStudents() {
  const [translate] = useTranslate({
    keysStartsWith: 'plugins.classroom.edit_level_page.students',
  });
  const t = tLoader('plugins.classroom.edit_level_page.students', translate);
  console.log(translate);

  return (
    <>
      <fielset className="edit-section border-t border-base-200 pt-8 flex gap-10">
        <div className=" w-3/12">
          <legend className="edit-section-title text-xl text-secondary">{t('title')}</legend>
          <p className="edit-section-description font-inter text-sm text-secondary-300">
            {t('description')}
          </p>
        </div>
        <div className=" w-9/12">
          <div className="flex flex-nowrap justify-between mb-3">
            <FormControl label={t('option01')} labelPosition="right">
              <Radio name="opt" />
            </FormControl>
            <FormControl label={t('option02')} labelPosition="right">
              <Radio name="opt" />
            </FormControl>
            <FormControl label={t('option03')} labelPosition="right">
              <Radio name="opt" />
            </FormControl>
          </div>
          <FormControl label={t('label')} className="read-only-label">
            <Input placeholder={t('placeholder')} outlined={true}></Input>
          </FormControl>
        </div>
      </fielset>
    </>
  );
}
