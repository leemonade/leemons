import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { Avatar, Button, Badge } from 'leemons-ui';
import { PencilIcon, XIcon, ChevronDownIcon } from '@heroicons/react/solid';
import Directoryt from './directory-table';

export default function Infolayer() {
  const [translate] = useTranslate({
    keysStartsWith: 'plugins.classroom.class_list.view_panel.summary',
  });
  const t = tLoader('plugins.classroom.class_list.view_panel.summary', translate);
  console.log(translate);

  return (
    <>
      {/* Hay que vitaminar el Drawer.js para que se pinte sin fondo modal clickable y abra esta capa */}

      <div className="info-container">
        <article className="info-content">
          <div className="info-summary">
            <header className="info-header">
              <h1 className="info-title">Group C</h1>
              <ul className="info-actions flex gap-2">
                <li>
                  <Button color="primary" className="btn-link btn-xs stroke-current">
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1"
                    >
                      <g clip-path="url(#clip03)">
                        <path
                          d="M9.75 14.248L0.75 23.248"
                          stroke="current"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M23.25 7.49805V0.748047H16.5"
                          stroke="current"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M0.75 16.498V23.248H7.5"
                          stroke="current"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M23.25 0.748047L14.25 9.74805"
                          stroke="current"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip03">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>{' '}
                    {t('btn_expand')}
                  </Button>
                </li>
                <li>
                  <Button color="primary" className="btn-link btn-xs stroke-current font-inter">
                    <PencilIcon className="w-3 h-3 mr-1" />
                    {t('btn_edit')}
                  </Button>
                </li>
                <li>
                  <Button color="secondary" className="ml-8 btn-link font-inter btn-xs">
                    <XIcon className="inline-block w-4 h-4 stroke-current" />
                  </Button>
                </li>
              </ul>
            </header>
            <footer className="info-footer text-center w-auto mx-auto pt-6">
              <dl class="card-contact inline-flex flex-col">
                <dt className="read-only">Avatar</dt>
                <dd className="block justify-center">
                  <Avatar circle={true} size={14} className="stroke border-secondary-50">
                    <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
                  </Avatar>
                </dd>
                <dt className="read-only">Cargo</dt>
                <dd>
                  <Badge color="ghost" className="badge-sm mx-0 mt-2 mb-4 font-inter">
                    Tutor
                  </Badge>
                </dd>
                <dt className="read-only">Nombre</dt>
                <dd>Benoit Lafalletye</dd>
                <dt className="read-only">Teléfono</dt>
                <dd>
                  <a href="tel:123-456-7890">123-456-7890</a>
                </dd>
                <dt className="read-only">Correo electrónico</dt>
                <dd>
                  <Button color="primary" className="btn-link font-inter">
                    {/* TODO HACER ICONO */}
                    <svg
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1"
                    >
                      <g clip-path="url(#clip0)">
                        <path
                          d="M8.49968 2C7.43324 2.00012 6.3861 2.28447 5.46608 2.82379C4.54606 3.3631 3.7864 4.13788 3.26533 5.06835C2.74426 5.99882 2.4806 7.05136 2.5015 8.1176C2.5224 9.18384 2.82711 10.2252 3.38425 11.1346L2.52711 13.4214C2.50289 13.4862 2.49473 13.5559 2.50331 13.6246C2.51189 13.6932 2.53696 13.7588 2.57637 13.8156C2.61579 13.8725 2.66838 13.9189 2.72966 13.951C2.79093 13.9832 2.85907 13.9999 2.92825 14C2.95413 14.0002 2.97996 13.9979 3.00539 13.9931L5.99939 13.448C6.78252 13.8124 7.63594 14.0008 8.49968 14C10.091 14 11.6171 13.3679 12.7423 12.2426C13.8675 11.1174 14.4997 9.5913 14.4997 8C14.4997 6.4087 13.8675 4.88258 12.7423 3.75736C11.6171 2.63214 10.091 2 8.49968 2ZM6.35682 8.04457C6.34539 8.26409 6.25006 8.47082 6.09054 8.62205C5.93102 8.77328 5.71949 8.85744 5.49968 8.85714H5.45425C5.28511 8.84795 5.12249 8.78885 4.98691 8.6873C4.85134 8.58575 4.74889 8.4463 4.69251 8.28657C4.63613 8.12684 4.62833 7.95399 4.67012 7.78983C4.7119 7.62568 4.80139 7.47758 4.92727 7.36424C5.05316 7.25091 5.20981 7.17741 5.37744 7.15304C5.54506 7.12867 5.71616 7.15451 5.86911 7.2273C6.02206 7.30009 6.15002 7.41657 6.23682 7.56202C6.32362 7.70748 6.36538 7.8754 6.35682 8.04457ZM9.35682 8.04457C9.34539 8.26409 9.25006 8.47082 9.09054 8.62205C8.93102 8.77328 8.71949 8.85744 8.49968 8.85714H8.45425C8.34156 8.85134 8.23112 8.82333 8.12928 8.77475C8.02744 8.72616 7.93619 8.65794 7.86078 8.574C7.78536 8.49006 7.72726 8.39206 7.68981 8.28562C7.65236 8.17917 7.63629 8.06638 7.64254 7.95371C7.65165 7.78451 7.71072 7.6218 7.81227 7.48614C7.91382 7.35049 8.0533 7.24798 8.21309 7.19157C8.37288 7.13516 8.5458 7.12738 8.71001 7.1692C8.87422 7.21103 9.02235 7.30059 9.13568 7.42657C9.21173 7.50974 9.27045 7.60722 9.30842 7.71332C9.34639 7.81943 9.36284 7.93204 9.35682 8.04457ZM12.3568 8.04457C12.3454 8.26409 12.2501 8.47082 12.0905 8.62205C11.931 8.77328 11.7195 8.85744 11.4997 8.85714H11.4534C11.3408 8.85123 11.2304 8.82315 11.1287 8.77451C11.0269 8.72587 10.9358 8.65764 10.8605 8.57371C10.7851 8.48978 10.7271 8.39182 10.6897 8.28543C10.6523 8.17904 10.6363 8.06631 10.6425 7.95371C10.6565 7.72716 10.7589 7.51516 10.9278 7.36346C11.0966 7.21176 11.3184 7.13253 11.5451 7.14286C11.6576 7.14867 11.7679 7.17662 11.8697 7.2251C11.9714 7.27358 12.0626 7.34164 12.1379 7.42539C12.2133 7.50915 12.2715 7.60694 12.309 7.71319C12.3466 7.81944 12.3628 7.93204 12.3568 8.04457Z"
                          fill="#82B4FF"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width="12" height="12" fill="white" transform="translate(2.5 2)" />
                        </clipPath>
                      </defs>
                    </svg>
                    lafalletye.benoit@example.com
                  </Button>
                </dd>
              </dl>
            </footer>
            <h2 className="info-title-counter p-3 uppercase text-sm font-semibold text-secondary-300">
              {t('counter')}
              <span className="counter font-normal border border-solid ml-3 border-gray-30 rounded-full py-1 px-2">
                26
              </span>
            </h2>
          </div>
          <div className="info-body">
            <Directoryt></Directoryt>
          </div>
        </article>
      </div>
    </>
  );
}
