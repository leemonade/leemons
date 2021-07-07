import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getMenu } from '@menu-builder/helpers';
import Image from 'next/image';
import getActiveParentAndChild from '../helpers/getActiveParentAndChild';

export default function MainMenu({ children }) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState({ parent: null, child: null });
  const [menu, setMenu] = useState([]);

  async function loadMenu() {
    const _menu = await getMenu('plugins.menu-builder.main');
    setMenu(_menu);
  }

  const handleRouteChange = async () => {
    setActiveMenu(await getActiveParentAndChild());
  };

  useEffect(() => {
    (async () => {
      await loadMenu();
      await handleRouteChange();
    })();
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <>
      <div className="flex">
        <div className="max-w-xs w-full">
          {/* Aqui empezaria la componente menu */}
          <div className="flex w-full">
            {/* Menu */}
            <div className="w-14 h-screen bg-gray-100">
              <img className="w-8 mb-9 mx-auto" src="/menu-builder/logo.svg" alt="" />

              {menu.map((item) => (
                <div
                  className={`w-full w-14 h-14 text-center cursor-pointer ${
                    activeMenu.parent === item.id ? 'bg-gray-600' : 'bg-gray-200'
                  } `}
                  key={item.id}
                >
                  <div className="w-5 h-full mx-auto relative">
                    <Image layout="fill" src={item.iconSvg} alt={item.iconAlt} />
                  </div>
                </div>
              ))}
            </div>

            {/* Submenu */}
            {activeMenu.parent && (
              <div className="w-full h-screen bg-gray-300">
                <div className="flex">
                  <div>Users</div>
                  <div>C</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>{children}</div>
      </div>
    </>
  );
}
