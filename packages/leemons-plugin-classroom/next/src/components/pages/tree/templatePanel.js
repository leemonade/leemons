import { Card, Button, Select } from 'leemons-ui';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import prefixPN from '@classroom/helpers/prefixPN';

export default function TemplatePanel({ locale }) {
  const [translations] = useTranslate({
    keysStartsWith: prefixPN(''),
    locale: locale === 'default' ? undefined : locale,
  });
  const t = tLoader(prefixPN('tree_page'), translations);
  const tc = tLoader(prefixPN('common'), translations);
  return (
    <div className="w-72">
      <Card className="bg-white p-8">
        <div className="text-secondary-400 text-xl py-2 leading-tight">
          {t('from_template_info.title')}
        </div>
        <div className="page-description py-2">{t('from_template_info.description')}</div>
        <div className="py-2">
          <Select outlined className="w-full">
            <option>Spain</option>
          </Select>
        </div>
        <div>
          <Select outlined className="w-full" defaultValue="none">
            <option disabled value="none">
              {tc('select_template')}
            </option>
          </Select>
        </div>
        <div className="my-4">
          <Button color="primary" rounded className="btn-sm w-full">
            {t('from_template_info.btn')}
          </Button>
        </div>
        <div className="page-description">{t('from_template_info.hide_info.description')}</div>
        <div>
          <Button color="primary" link className="btn-sm px-0">
            {t('from_template_info.hide_info.btn')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
