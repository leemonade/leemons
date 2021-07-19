import { useState } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import LeemonsImage from '../leemonsImage';

export default function MainMenuSubmenuItem({
  item,
  active,
  isDragging,
  isLayer,
  editMode,
  editItemMode,
  changeToEditItem,
  remove,
}) {
  const [newLabel, setNewLabel] = useState(item.label);

  const styles = {
    color: 'text-secondary-content hover:text-secondary-content',
    border: '',
    backgroundColor: 'hover:bg-primary',
    paddingLeft: 'pl-7',
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

  if (editItemMode) {
    styles.paddingLeft = 'pl-4';
    styles.border = 'border-2 border-primary border-solid';
  }

  const finalStyle = `${styles.color} ${styles.border} ${styles.backgroundColor} ${styles.paddingLeft}`;

  const onClick = () => {
    if (!editMode && !editItemMode) {
      Router.push(item.url);
    } else {
      changeToEditItem(item);
    }
  };

  const onNewLabelChange = (event) => {
    setNewLabel(event.target.value);
  };

  return (
    <div
      className={`relative w-full py-3 pr-8 font-lexend text-sm cursor-pointer truncate ${finalStyle}`}
      style={isLayer ? { width: '190px' } : {}}
      onClick={onClick}
    >
      {editMode && (
        <div
          className="absolute left-2 top-2/4 transform -translate-y-1/2"
          style={{ width: '10px', height: '5px' }}
        >
          <LeemonsImage className="stroke-current" src={'/menu-builder/svgs/re-order.svg'} />
        </div>
      )}
      {editItemMode ? (
        <input
          className="h-full w-full bg-transparent focus-visible:border-transparent"
          type="text"
          value={newLabel}
          onChange={onNewLabelChange}
        />
      ) : (
        <span className={`${isDragging ? '' : ''}`}>{item.label}</span>
      )}

      {editMode && (
        <div
          onClick={() => remove(item)}
          className="absolute right-3 top-2/4 transform -translate-y-1/2"
          style={{ width: '12px', height: '12px' }}
        >
          <LeemonsImage className="stroke-current" src={'/menu-builder/svgs/remove.svg'} />
        </div>
      )}
    </div>
  );
}

MainMenuSubmenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  active: PropTypes.bool,
  isDragging: PropTypes.bool,
  isLayer: PropTypes.bool,
  editMode: PropTypes.bool,
  editItemMode: PropTypes.bool,
  remove: PropTypes.func,
  changeToEditItem: PropTypes.func,
};
