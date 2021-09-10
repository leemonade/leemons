import React from 'react';
import { PageHeader, Select, Button } from '../../../src/components/ui';
import { PlusCircleIcon } from '@heroicons/react/outline';


const data = {
    showType: true,
    components: [{ class: 'alert', desc: 'Container element' }],
    utilities: [
        { class: 'alert-info', desc: 'Alert with `info` color' },
        { class: 'alert-success', desc: 'Alert with `success` color' },
        { class: 'alert-warning', desc: 'Alert with `warning` color' },
        { class: 'alert-error', desc: 'Alert with `error` color' },
    ],
};

function PageHeaderPage() {
    return (
        <>
            <div className="bg-secondary-content  edit-mode w-full h-screen overflow-auto grid">
                <div className="bg-primary-content w-full">
                    <PageHeader
                        separator={false}
                        title="Tree"
                        className="pb-0"
                    >
                    </PageHeader>
                    <p class="page-description text-secondary pb-12 max-w-screen-xl w-full mx-auto px-6">
                        Use the button <PlusCircleIcon alt="add button"
                            className={`w-5 h-5 inline text-primary `}
                        /> to create a new level, the use the config area to configure the data set for the level
                    </p>
                </div>
                <div className="flex max-w-screen-xl w-full mx-auto px-6">
                    {/* Dummy tree */}
                    <div className="tree_editWrapper flex-1 my-2 mb-2">
                        <ul className="tree" role="list">
                            <li className="" role="listitem" draggable="true">
                                <div className="tree-node relative flex items-center h-8 rounded group bg-white hover:bg-gray-10 cursor-pointer pr-2">
                                    <div className="flex items-center justify-center group cursor-pointer transition-transform transform ease-linear h-6 w-8 rotate-0">
                                        <svg class="text-gray-300 group-hover:text-secondary" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.2805 5.43C4.29449 5.44755 4.30952 5.46425 4.32551 5.48C4.50458 5.65892 4.74736 5.75943 5.00051 5.75943C5.25365 5.75943 5.49643 5.65892 5.67551 5.48C5.69149 5.46425 5.70652 5.44755 5.72051 5.43L9.2 0.7615C9.25274 0.690532 9.28471 0.606304 9.29235 0.51822C9.29999 0.430135 9.283 0.34166 9.24327 0.262672C9.20355 0.183685 9.14265 0.117293 9.06737 0.0709094C8.9921 0.0245258 8.90542 -2.42472e-05 8.81701 1.79704e-08H1.18551C1.09709 -2.42472e-05 1.01041 0.0245258 0.935135 0.0709094C0.859863 0.117293 0.798964 0.183685 0.759237 0.262672C0.71951 0.34166 0.702518 0.430135 0.710159 0.51822C0.717799 0.606304 0.749771 0.690532 0.802505 0.7615L4.2805 5.43Z" fill="currentColor"></path>
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-sm text-gray-300 group-hover:text-secondary">
                                        <span>Organization/center</span>
                                    </div>
                                </div>

                                <ul className="" role="list">
                                    <li className="" role="listitem" draggable="true">
                                        <div className="tree-node relative flex items-center h-8 rounded group transition-all ease-out transform opacity-100">
                                            <div className="flex-1 pr-1">
                                                <button className="btn  btn-primary btn-sm w-full mb-1  btn-text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary w-4 h-4 mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    <div className="flex-1 text-left">Add level (to organization)</div>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    {/* End Dummy tree */}
                    <div className="flex-1 m2">
                        <aside className="help-wizard">
                            {/*TO DO LIBRERIA ICONOS PROPIA - No existe similar a este en HeroIcons */}
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="help-wizard_ico">
                                <g clip-path="url(#clip0)">
                                    <path d="M0.75 0.747986H5.25V5.24799H0.75V0.747986Z" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M0.75 18.748H5.25V23.248H0.75V18.748Z" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M17.25 0.747986H21.75V5.24799H17.25V0.747986Z" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M17.25 18.748H21.75V23.248H17.25V18.748Z" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M5.25 2.24799H17.25" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M20.25 5.24799V18.748" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M17.25 21.748H5.25" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M2.25 18.748V5.24799" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M6.75 8.99999C6.74974 8.70434 6.80774 8.41155 6.9207 8.13833C7.03365 7.86512 7.19935 7.61685 7.4083 7.4077C7.61726 7.19856 7.86539 7.03265 8.1385 6.91945C8.41161 6.80625 8.70436 6.74799 9 6.74799H13.5C13.7956 6.74799 14.0884 6.80625 14.3615 6.91945C14.6346 7.03265 14.8827 7.19856 15.0917 7.4077C15.3007 7.61685 15.4663 7.86512 15.5793 8.13833C15.6923 8.41155 15.7503 8.70434 15.75 8.99999" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M11.25 6.74799V17.248" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M8.21899 17.248H14.219" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect width="32" height="32" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <h2 className="help-wizard_name">Do you want to pre-load a template to save time?</h2>
                            <p className="help-wizard_description">Choose the type of template and click on load tree, later you can modify the dataset of each level according to the needs of your organisation.</p>
                            <Select outlined={true}
                                multiple={false}
                                className='w-full max-w-xs'>
                                <option disabled={false}
                                    selected={true}>
                                    Spain
                                </option>
                                <option value='TELECO'>
                                    telekinesis
                                </option>
                                <option>
                                    time travel
                                </option>
                                <option>
                                    invisibility
                                </option>
                            </Select>
                            <Select outlined={true}
                                className='w-full max-w-xs text-secondary-300'>
                                <option value="placeholder">
                                    Select template
                                </option>
                                <option value='TELECO'>
                                    telekinesis
                                </option>
                                <option>
                                    time travel
                                </option>
                                <option>
                                    invisibility
                                </option>
                            </Select>
                            <Button disabled={true} rounded={true} color='primary'>
                                Preview template
                            </Button>
                            <div className="help-wizard_legend">I prefer to do it manually <Button color="primary" link className=" btn-link">Do not show any more.</Button></div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PageHeaderPage;
