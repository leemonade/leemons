import * as _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import MainMenuCloseSubmenuBtn from './mainMenuCloseSubmenuBtn';
import MainMenuSubmenuItem from './mainMenuSubmenuItem';
import SimpleBar from 'simplebar-react';
import update from 'immutability-helper';
import DndSortItem from '../dnd/dndSortItem';
import DndDropZone from '../dnd/dndDropZone';
import { addMenuItemRequest, reOrderCustomUserItemsRequest } from '../../request';
import hooks from 'leemons-hooks';
import { registerDndLayer } from '../dnd/dndLayer';

export default function MainMenuSubmenu({ item, onClose, activeItem }) {
  const [customChildrens, setCustomChildrens] = useState(item ? item.customChildrens : []);

  const find = useCallback(
    (id) => {
      const dragItem = _.find(customChildrens, { id });
      return { dragItem, index: customChildrens.indexOf(dragItem) };
    },
    [customChildrens]
  );

  const move = useCallback(
    (id, atIndex) => {
      const { dragItem, index } = find(id);
      setCustomChildrens(
        update(customChildrens, {
          $splice: [
            [index, 1],
            [atIndex, 0, dragItem],
          ],
        })
      );
    },
    [customChildrens, setCustomChildrens]
  );

  const endMove = useCallback(
    async (dragItem, atIndex) => {
      move(dragItem, atIndex);
      const response = await reOrderCustomUserItemsRequest(
        'plugins.menu-builder.main',
        item.key,
        _.map(customChildrens, 'id')
      );
      console.log(response);
    },
    [move]
  );

  const onDrop = async (droppedItem) => {
    const { menuItem } = await addMenuItemRequest({ ...droppedItem, parentKey: item.key });
    await hooks.fireEvent('menu-builder:user:addCustomItem', menuItem);
  };

  const [, drop] = useDrop(() => ({ accept: 'menu-item-sort' }));

  useEffect(() => {
    registerDndLayer('menu-item-sort', ({ item: _item }) => (
      <MainMenuSubmenuItem item={find(_item.id).dragItem} isLayer={true} />
    ));
  }, [find]);

  useEffect(() => {
    if (item) setCustomChildrens(item.customChildrens);
  }, [item]);

  return (
    <>
      {item && (
        <div className="w-full h-screen bg-gray-300 flex flex-col justify-between">
          {/* Header submenu */}
          <div className={'flex flex-row justify-between items-center mb-8 pt-3'}>
            <div className={'w-full pl-6 font-lexend text-base'}>Users</div>
            {/* Close submenu */}
            <div className={'px-2'}>
              <MainMenuCloseSubmenuBtn onClick={onClose} />
            </div>
          </div>
          {/* Items submenu */}
          <SimpleBar className="flex-grow h-px">
            <DndDropZone type={'menu-item'} onDrop={onDrop} className="h-full">
              {() => (
                <>
                  {item.childrens.map((child) => (
                    <MainMenuSubmenuItem
                      key={child.id}
                      item={child}
                      active={activeItem?.id === child.id}
                    />
                  ))}

                  <div ref={drop}>
                    <>
                      {customChildrens.map((child) => (
                        <DndSortItem
                          key={child.id}
                          id={child.id}
                          find={find}
                          move={move}
                          endMove={endMove}
                          type={'menu-item-sort'}
                        >
                          {({ isDragging }) => (
                            <MainMenuSubmenuItem
                              item={child}
                              isDragging={isDragging}
                              active={activeItem?.id === child.id}
                            />
                          )}
                        </DndSortItem>
                      ))}
                    </>
                  </div>
                </>
              )}
            </DndDropZone>
          </SimpleBar>
        </div>
      )}
    </>
  );
}

MainMenuSubmenu.propTypes = {
  item: PropTypes.object,
  onClose: PropTypes.func,
  activeItem: PropTypes.object,
};
