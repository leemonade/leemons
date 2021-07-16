import { useEffect, useState } from 'react';
import { Button } from 'leemons-ui';
import useTranslate from '@multilanguage/useTranslate';
import prefixPN from '../../helpers/prefixPN';
import { getIfKnowHowToUseRequest, setKnowHowToUseRequest } from '../../request';

export default function MainMenuInfo() {
  const [knowHowToUse, setKnowHowToUse] = useState(false);
  const [showKnowHowToUse, setShowKnowHowToUse] = useState(false);
  const [translations] = useTranslate({ keysStartsWith: prefixPN('menu.menu_constructor') });

  const t = (key) => {
    const tKey = `plugins.menu-builder.menu.menu_constructor.${key}`;
    if (
      translations &&
      translations.items &&
      Object.prototype.hasOwnProperty.call(translations.items, tKey)
    ) {
      return translations.items[tKey];
    }
    return null;
  };

  const checkIfKnowHowToUse = async () => {
    const { knowHowToUse: know } = await getIfKnowHowToUseRequest();
    setKnowHowToUse(know);
    if (know) setShowKnowHowToUse(know);
  };

  const markAsKnowHowToUse = async () => {
    await setKnowHowToUseRequest();
    setShowKnowHowToUse(true);
  };

  // TODO: Traducir los textos

  useEffect(() => {
    checkIfKnowHowToUse();
  }, []);

  return (
    <>
      <div className="relative">
        <div
          className={`absolute ${
            knowHowToUse ? 'bottom-full' : 'bottom-0'
          } transform w-full bg-secondary-600 transition p-4 ${
            showKnowHowToUse ? 'translate-y-full' : ''
          }`}
        >
          <div className="mb-8">
            <span className="text-base text-secondary-content">{t('title')}</span>{' '}
            <span className="text-base text-primary">{t('is_active')}</span>
          </div>
          <div
            className="text-secondary-content text-xs"
            dangerouslySetInnerHTML={{
              __html: t('description'),
            }}
          />
          {!knowHowToUse && (
            <Button
              color="primary"
              rounded={true}
              className="btn-sm mt-8"
              onClick={markAsKnowHowToUse}
            >
              {t('got_it_btn')}
            </Button>
          )}
        </div>
        <div className="flex flex-row text-sm text-center text-neutral py-8 bg-secondary-focus relative z-10">
          <div className="flex-1 hover:text-primary">Edit</div>
          <div
            className="flex-1 hover:text-primary"
            onClick={() => setShowKnowHowToUse(!showKnowHowToUse)}
          >
            Help
          </div>
        </div>
      </div>
    </>
  );
}

MainMenuInfo.propTypes = {};
