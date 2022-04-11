/*
import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { Button, ImageLoader } from 'leemons--ui';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import prefixPN from '../../helpers/prefixPN';
import { getIfKnowHowToUseRequest, setKnowHowToUseRequest } from '../../request';

export default function MainMenuInfo({ editMode, toggleEditMode, state, setState }) {
  const setKnowHowToUse = (knowHowToUse) => {
    setState({ knowHowToUse });
  };
  const setShowKnowHowToUse = (showKnowHowToUse) => {
    setState({ showKnowHowToUse });
  };

  const [translations] = useTranslate({ keysStartsWith: prefixPN('menu.menu_constructor') });
  const t = tLoader(prefixPN('menu.menu_constructor'), translations);

  const checkIfKnowHowToUse = async () => {
    const { knowHowToUse: know } = await getIfKnowHowToUseRequest();
    setKnowHowToUse(know);
    setShowKnowHowToUse(know);
  };

  const markAsKnowHowToUse = async () => {
    await setKnowHowToUseRequest();
    setShowKnowHowToUse(true);
    setKnowHowToUse(true);
  };

  useEffect(() => {
    checkIfKnowHowToUse();
  }, []);

  return (
    <>
      <div className="relative">
        <div
          className={`absolute ${
            state.knowHowToUse ? 'bottom-full' : 'bottom-0'
          } transform w-full bg-secondary-600 transition p-4 ${
            state.showKnowHowToUse ? 'translate-y-full' : ''
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
          {!state.knowHowToUse && (
            <Button color="primary" rounded className="btn-sm mt-8" onClick={markAsKnowHowToUse}>
              {t('got_it_btn')}
            </Button>
          )}
        </div>
        <div
          className={`flex flex-row text-sm text-center items-center text-neutral transition ${
            state.knowHowToUse ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } ${editMode ? 'py-4' : 'py-8'} bg-secondary-focus relative z-10`}
        >
          {!editMode ? (
            <div className="flex-1 hover:text-primary cursor-pointer" onClick={toggleEditMode}>
              <div
                className={`relative inline-block align-middle mr-2`}
                style={{ width: '12px', height: '12px' }}
              >
                <ImageLoader className="fill-current" src={'/public/assets/svgs/edit.svg'} />
              </div>
              {t('edit')}
            </div>
          ) : (
            <div className="pl-4">
              <Button
                color="primary"
                className="whitespace-nowrap overflow-ellipsis cursor-pointer"
                onClick={toggleEditMode}
              >
                {t('finish_edit')}
              </Button>
            </div>
          )}

          <div
            className={`flex-1 hover:text-primary cursor-pointer ${editMode ? 'text-center' : ''}`}
            onClick={() => setShowKnowHowToUse(!state.showKnowHowToUse)}
          >
            <div
              className={`relative inline-block align-middle ${editMode ? '' : 'mr-2'}`}
              style={{ width: '12px', height: '12px' }}
            >
              <ImageLoader className="fill-current" src={'/public/assets/svgs/info.svg'} />
            </div>

            {!editMode ? t('help') : ''}
          </div>
        </div>
      </div>
    </>
  );
}

MainMenuInfo.propTypes = {
  editMode: PropTypes.bool,
  toggleEditMode: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
};
*/
