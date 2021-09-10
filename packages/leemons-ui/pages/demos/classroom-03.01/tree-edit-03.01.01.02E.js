import React from 'react';
import { PageHeader, Select, Button } from '../../../src/components/ui';
import { PlusCircleIcon, CheckIcon } from '@heroicons/react/outline';


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
                    <div className="tree_editWrapper flex-1 my-2 mb-2 relative">
                        <Button color='primary' className="absolute top-6 right-6 z-10"><CheckIcon className='inline-block w-6 h-6 mr-2 stroke-current' />Finish editing</Button>

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

                    </div>
                </div>
            </div>
        </>
    );
}

export default PageHeaderPage;
