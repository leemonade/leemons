import PropTypes from 'prop-types';
import Router from 'next/router';

export default function MainMenuSubmenuItem({ item, active, isDragging, isLayer }) {
  return (
    <div
      className={`
      w-full py-3 pl-6 pr-2 font-lexend text-sm cursor-pointer truncate hover:bg-red-300 hover:text-white
      ${active ? 'bg-gray-500' : ''}
      ${isDragging ? 'border-2 border-white border-dashed' : ''}
      ${isLayer ? 'bg-gray-500 border-2 border-white border-dashed' : ''}
      `}
      style={isLayer ? { width: '190px' } : {}}
      onClick={() => Router.push(item.url)}
    >
      <span className={`${isDragging ? 'opacity-0' : ''}`}>{item.label}</span>
    </div>
  );
}

MainMenuSubmenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  active: PropTypes.bool,
  isDragging: PropTypes.bool,
  isLayer: PropTypes.bool,
};
