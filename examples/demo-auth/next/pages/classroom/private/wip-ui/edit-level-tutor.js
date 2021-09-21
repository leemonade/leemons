import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { Avatar, Button } from 'leemons-ui';
import Autosuggest from 'react-autosuggest';

export default function EditLevelTutor() {
  const [translate] = useTranslate({
    keysStartsWith: 'edit_level_page.tutor',
  });
  const t = tLoader('edit_level_page.tutor', translate);
  console.log(translate);

  return (
    <>
      <fielset className="edit-section border-t border-base-200 pt-8 flex gap-10">
        <div className=" w-4/12">
          <legend className="edit-section-title text-xl text-secondary">{t('tutor.title')}</legend>
          <p className="edit-section-description font-inter text-sm text-secondary-300">
            {t('description')}
          </p>
        </div>
        <div className=" w-8/12">
          {/* autsuggest dummy example */}

          <div data-reactroot="" className="block relative border border-base-300 z-10 open">
            <input
              type="text"
              value="A"
              autocomplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-owns="react-autowhatever-1"
              aria-expanded="true"
              aria-haspopup="true"
              className="input input-bordered w-full rounded-none"
              placeholder="Search"
            />
            <div id="react-autowhatever-1" className="relative">
              <ul role="listbox" className="react-autosuggest__suggestions-list">
                <li
                  role="option"
                  id="react-autowhatever-1--item-0"
                  className="p-1 border-b border-base-300"
                  data-suggestion-index="0"
                >
                  <div className="suggestion-content">
                    <div className="user-card minimal">
                      <Avatar circle={true} size={8} className="">
                        <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
                      </Avatar>
                      <span>Antonia Hidalgo</span>
                    </div>
                  </div>
                </li>
                <li
                  role="option"
                  id="react-autowhatever-1--item-1"
                  className="p-1 border-b border-base-300"
                  data-suggestion-index="1"
                >
                  <div className="user-card minimal">
                    <Avatar circle={true} size={8} className="">
                      <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
                    </Avatar>
                    <span>Antonia Hidalgo</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {/* End autsuggest dummy example */}
        </div>
      </fielset>

      {/* Fin Dummy tabla */}
    </>
  );
}
