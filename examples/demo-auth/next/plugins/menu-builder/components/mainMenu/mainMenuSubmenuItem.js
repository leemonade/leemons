import PropTypes from 'prop-types';
import Router from 'next/router';

export default function MainMenuSubmenuItem({ item, active, isDragging, isLayer }) {
  let styles = {
    color: 'text-secondary-content hover:text-secondary-content',
    border: '',
    backgroundColor: 'hover:bg-primary',
  };

  if (active) {
    styles.backgroundColor = `bg-secondary-300 ${styles.backgroundColor}`;
  }

  if (isDragging) {
    styles.border = 'border-2 border-secondary-content border-dashed';
  }

  if (isLayer) {
    styles.color = 'text-secondary';
    styles.border = 'border-2 border-primary border-dashed';
    styles.backgroundColor = 'bg-secondary-content';
  }

  const finalStyle = `${styles.color} ${styles.border} ${styles.backgroundColor}`;

  return (
    <div
      className={`w-full py-3 pl-6 pr-2 font-lexend text-sm cursor-pointer truncate ${finalStyle}`}
      style={isLayer ? { width: '190px' } : {}}
      onClick={() => Router.push(item.url)}
    >
      <span className={`${isDragging ? '' : ''}`}>{item.label}</span>
    </div>
  );
}

MainMenuSubmenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  active: PropTypes.bool,
  isDragging: PropTypes.bool,
  isLayer: PropTypes.bool,
};
