import React from 'react';
import { PencilIcon, XIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { Avatar, Divider, Button, Badge } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';
function DetailsPage() {
  const data = {
    showType: true,
    components: [{ class: 'details', desc: 'Container element' }],
    utilities: [
      { class: 'details', desc: 'default style' },
      { class: 'summary', desc: 'Title of the dropdown' },
    ],
  };

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Details</span>
      </h2>
      <div className="flex-grow p-4">
        <Wrapper className="" title="details">
          <details className="details">
            <summary className="summary">
              Faculty of Medicine <span className="summary-counter">6 programs</span>
            </summary>
            <details className="details">
              <summary className="summary">
                Faculty of Medicine level 2 <span className="summary-counter">2 programs</span>
              </summary>
            </details>
            <details className="details">
              <summary className="summary">
                Faculty of Medicine level 2 <span className="summary-counter">2 programs</span>
              </summary>
            </details>
          </details>
          <details className="details">
            <summary className="summary">
              Education <span className="summary-counter">2 programs</span>
            </summary>
            <details className="details">
              <summary className="summary">
                Education level 2 <span className="summary-counter">2 programs</span>
              </summary>
              <details className="details details-table">
                <summary className="summary">
                  Education level 3 <span className="summary-counter"> 2 programs</span>
                </summary>
                <table role="table" class="table table-list table-fixed">
                  <thead>
                    <tr role="row" className="">
                      <th colspan="1" role="columnheader" className="th unseen w-2/6">
                        Education level 3
                      </th>
                      <th colspan="1" role="columnheader" className="th ">
                        Tutor
                      </th>
                      <th colspan="1" role="columnheader" className="th ">
                        Estudiantes
                      </th>
                      <th colspan="1" role="columnheader" className="th unseen">
                        Actions
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
              </details>
            </details>
          </details>
        </Wrapper>

        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default DetailsPage;
