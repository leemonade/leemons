import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import Listtable from './list-table';

export default function Details() {
  const [translate] = useTranslate({
    keysStartsWith: 'plugins.classroom.class_list.details',
  });
  const t = tLoader('plugins.classroom.class_list.details', translate);
  console.log(translate);

  return (
    <>
      <details className="details">
        <summary className="summary">
          Education <span className="summary-counter">2 {t('type_program')}</span>
        </summary>
        <details className="details">
          <summary className="summary">
            Education level 2 <span className="summary-counter">3 {t('type_courses')}</span>
          </summary>
          <details className="details  details-table">
            <summary className="summary">
              Education level 3 <span className="summary-counter">3 {t('type_courses')}</span>
              <Listtable></Listtable>
            </summary>
          </details>
        </details>
      </details>

      <details className="details">
        <summary className="summary">
          Faculty of Medicine <span className="summary-counter">6 {t('type_program')}</span>
        </summary>
        <details className="details">
          <summary className="summary">
            Faculty of Medicine level 2{' '}
            <span className="summary-counter">3 {t('type_courses')}</span>
          </summary>
        </details>
      </details>
    </>
  );
}
