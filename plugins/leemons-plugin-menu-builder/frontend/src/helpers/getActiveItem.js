import { forEach } from 'lodash';

export const getActiveItem = (menuData) => {
  let activeItem = null;
  let activeSubItem = null;

  if (window && window.location) {
    const url = window.location.pathname;

    forEach(menuData, (item) => {
      if (item.url === url) {
        activeItem = item;
      }

      forEach(item.children, (subItem) => {
        if (subItem.url === url) {
          activeItem = item;
          activeSubItem = subItem;
          return false;
        }
      });

      if (activeItem) {
        return false;
      }
    });

    // Check if parent root is found in their children
    if (!activeItem) {
      forEach(menuData, (item) => {
        if (item.url) {
          const itemUrl = item.url.replace(/([\/][^\/]+$)/g, '');
          const match = url.indexOf(item.url);

          if (match > -1 && match < 4) {
            activeItem = item;
            return false;
          }
        }

        forEach(item.children, (subItem) => {
          if (subItem.url) {
            const subItemUrl = subItem.url.replace(/([\/][^\/]+$)/g, '');
            const matchUrl = url.indexOf(subItem.url);
            if (matchUrl > -1 && matchUrl < 4) {
              activeItem = item;
              activeSubItem = subItem;
              return false;
            }
          }
        });

        if (activeItem) {
          return false;
        }
      });
    }
  }

  return { activeItem, activeSubItem };
};
