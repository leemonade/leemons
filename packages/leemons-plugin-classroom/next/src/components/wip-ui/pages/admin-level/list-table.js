import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { Avatar, Button } from 'leemons-ui';
import { PencilIcon } from '@heroicons/react/solid';

export default function Listtable() {
  const [translate] = useTranslate({
    keysStartsWith: 'plugins.classroom.class_list.class_table',
  });
  const t = tLoader('plugins.classroom.class_list.class_table', translate);
  console.log(translate);

  return (
    <>
      {/* Dummy tabla listado */}
      <table role="table" class="table table-list table-fixed">
        <thead>
          <tr role="row" className="">
            {/*  .unseen oculta sólo visualmente el contenido  */}
            <th colspan="1" role="columnheader" className="th unseen w-2/6">
              Education level 3
            </th>
            <th colspan="1" role="columnheader" className="th ">
              {t('th_tutor')}
            </th>
            <th colspan="1" role="columnheader" className="th ">
              {t('th_students')}
            </th>
            <th colspan="1" role="columnheader" className="th unseen">
              {t('th_actions')}
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          <tr role="row" className="">
            <td role="cell" className="td">
              <div className="">Group A</div>
            </td>
            <td role="cell" className="td">
              <div className="inline-flex items-center">
                <Avatar circle={true} className="mr-3">
                  <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" alt="" />
                </Avatar>
                Benoit Lafalletye
              </div>
            </td>
            <td role="cell" className="td">
              <div className="">26</div>
            </td>
            <td role="cell" className="td text-right">
              <div className="">
                <Button color="ghost" className="btn-icon">
                  <div className="w-5 h-5 text-secondary-100 stroke-current">
                    {/* TODO NUEVO ICONO  */}
                    <svg
                      viewBox="0 0 24 24"
                      alt={t('btn_expand')}
                      width="20"
                      height="20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip01)">
                        <path
                          d="M9.75 14.248L0.75 23.248"
                          stroke="current"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M23.25 7.49805V0.748047H16.5"
                          stroke="current"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M0.75 16.498V23.248H7.5"
                          stroke="current"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M23.25 0.748047L14.25 9.74805"
                          stroke="current"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip01">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </Button>
                <Button color="ghost" className="btn-icon">
                  <PencilIcon
                    alt={t('btn_edit')}
                    className="w-5 h-5 text-secondary-100 stroke-current"
                  />
                </Button>
              </div>
            </td>
          </tr>
          <tr role="row" className="">
            <td role="cell" className="td">
              <div className="">Group A</div>
            </td>
            <td role="cell" className="td">
              <div className="inline-flex items-center">
                <Avatar circle={true} className="mr-3">
                  <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
                </Avatar>
                Benoit Lafalletye
              </div>
            </td>
            <td role="cell" className="td">
              <div className="">26</div>
            </td>
            <td role="cell" className="td text-right">
              <div className="">
                <Button color="ghost" className="btn-icon">
                  <div className="w-4 h-4 text-secondary-100 stroke-current">
                    {/* TODO NUEVO ICONO  */}
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip02)">
                        <path
                          d="M9.75 14.248L0.75 23.248"
                          stroke="current"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M23.25 7.49805V0.748047H16.5"
                          stroke="current"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M0.75 16.498V23.248H7.5"
                          stroke="current"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M23.25 0.748047L14.25 9.74805"
                          stroke="current"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip02">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </Button>
                <Button color="ghost" className="btn-icon">
                  <PencilIcon className="w-5 h-5 text-secondary-100 stroke-current" />
                </Button>
              </div>
            </td>
          </tr>
          <tr role="row" className="">
            <td role="cell" className="td">
              <div className="">Group A</div>
            </td>
            <td role="cell" className="td">
              <div className="inline-flex items-center">
                <Avatar circle={true} className="mr-3">
                  <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
                </Avatar>
                Benoit Lafalletye
              </div>
            </td>
            <td role="cell" className="td">
              <div className="">26</div>
            </td>
            <td role="cell" className="td text-right">
              <div className="">
                <Button color="ghost" className="btn-icon">
                  <div className="w-5 h-5 text-secondary-100 stroke-current">
                    {/* TODO NUEVO ICONO  */}
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip03)">
                        <path
                          d="M9.75 14.248L0.75 23.248"
                          stroke="current"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M23.25 7.49805V0.748047H16.5"
                          stroke="current"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M0.75 16.498V23.248H7.5"
                          stroke="current"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M23.25 0.748047L14.25 9.74805"
                          stroke="current"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip03">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </Button>
                <Button color="ghost" className="btn-icon">
                  <PencilIcon className="w-5 h-5 text-secondary-100 stroke-current" />
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      {/* Fin Dummy tabla */}
    </>
  );
}
