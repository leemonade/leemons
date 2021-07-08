import * as PropTypes from 'prop-types';
import Router from 'next/router';

export default function MainMenuSubmenuItem({ item, active }) {
  return (
    <div
      className={`w-full py-3 pl-6 pr-2 font-lexend text-sm cursor-pointer hover:bg-red-300 hover:text-white ${
        active ? 'bg-gray-500' : ''
      }`}
      onClick={() => Router.push(item.url)}
    >
      {item.label}
    </div>
  );
}

MainMenuSubmenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  active: PropTypes.bool,
};
