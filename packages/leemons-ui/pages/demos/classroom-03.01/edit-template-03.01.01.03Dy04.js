import React from 'react';
import { PageHeader, Divider, FormControl, Input, Button, Checkbox, Modal, Tab, Tabs, TabList, TabPanel, useModal } from '../../../src/components/ui';
import { ChevronRightIcon } from '@heroicons/react/outline';
import { ExclamationIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/solid';




function PageHeaderPage() {

    const [modal, toggleModal] = useModal({
        animated: true,
        title: 'Close without saving?',
        buttons: [
            <Button color="primary" className="btn-link">
                Yes, exit and discard changes
            </Button>,
            <Button color="primary">
                No, return to edition
            </Button>,
        ],
    });
    return (
        <>
            <div className="bg-secondary-content edit-mode w-full h-screen overflow-auto grid">
                <div className="bg-base-200 w-full out-focus">
                    <PageHeader
                        separator={false}
                        title="Tree"
                        className="bg-base-200"
                    >
                    </PageHeader>
                    <div className="page-description text-secondary pb-12 max-w-screen-xl w-full mx-auto px-6">
                        <div className='flex flex-row w-full'>
                            <div className="flex-1">
                                <p className="mb-10">This is your center tree, press edit in the top right-hand corner to add new levels. <strong>Continue to Organisation to start creating Programs and courses.</strong></p>
                                <Button color='secondary' rounded={true}>Go to Organisation <ChevronRightIcon className='inline-block w-8 h-8 ml-2 -mr-2 stroke-current' /></Button>
                            </div>
                            <Divider vertical={true} className="opacity-20" />
                            <div className="w-3/6">
                                <ExclamationIcon className="w-4 h-4 text-gray-200"></ExclamationIcon>
                                <p className="w-3/6 font-inter text-sm"> Please, note that you will not be able to delete levels or change the class level once the organisation has been created and users assigned in the nexts steps.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex max-w-screen-xl w-full mx-auto px-6">
                    {/* Dummy tree */}
                    <div className="tree_editWrapper flex-1 my-2 mb-2">
                        <div className="bg-white p-2 mb-4 flex justify-between items-center">
                            {/*TO DO LIBRERIA ICONOS PROPIA - No existe similar a este en HeroIcons */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
                                <g clip-path="url(#clip0)">
                                    <path d="M0.75 0.747986H5.25V5.24799H0.75V0.747986Z" stroke="#8E97A3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M0.75 18.748H5.25V23.248H0.75V18.748Z" stroke="#8E97A3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M17.25 0.747986H21.75V5.24799H17.25V0.747986Z" stroke="#8E97A3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M17.25 18.748H21.75V23.248H17.25V18.748Z" stroke="#8E97A3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M5.25 2.24799H17.25" stroke="#8E97A3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M20.25 5.24799V18.748" stroke="#8E97A3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M17.25 21.748H5.25" stroke="#8E97A3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M2.25 18.748V5.24799" stroke="#8E97A3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M6.75 8.99999C6.74974 8.70434 6.80774 8.41155 6.9207 8.13833C7.03365 7.86512 7.19935 7.61685 7.4083 7.4077C7.61726 7.19856 7.86539 7.03265 8.1385 6.91945C8.41161 6.80625 8.70436 6.74799 9 6.74799H13.5C13.7956 6.74799 14.0884 6.80625 14.3615 6.91945C14.6346 7.03265 14.8827 7.19856 15.0917 7.4077C15.3007 7.61685 15.4663 7.86512 15.5793 8.13833C15.6923 8.41155 15.7503 8.70434 15.75 8.99999" stroke="#8E97A3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M11.25 6.74799V17.248" stroke="#8E97A3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M8.21899 17.248H14.219" stroke="#8E97A3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect width="32" height="32" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <div className=" text-gray-300">
                                <strong>K12 template</strong> <span className=" font-inter text-xs mx-2">Press over the levels to customize the dataset</span>
                            </div>
                            <Button color='primary' className="inline-block" onClick={() => toggleModal()} >Finish editing</Button>

                        </div>
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
                    <div className="flex-1 my-2 mb-2 bg-primary-content py-6 pl-12 pr-6">
                        <FormControl>
                            <div className="flex space-x-2 mb-4">
                                <Input outlined className="inpu w-full" name="levelName" placeholder="Level name" />
                                <button className="btn  btn-primary">Save level and continue</button>
                            </div>
                        </FormControl>
                        <FormControl className="mb-12 px-4"
                            label={
                                <>
                                    Class Level {' '}
                                    <span className="fc_legend"><InformationCircleIcon className={`w-5 h-5 inline mx-2 text-gray-30`} />Minimum level of student assignment
                                    </span>
                                </>
                            }
                            labelPosition="right"
                        >
                            <Checkbox color="primary" />
                        </FormControl>
                        <div>
                            <Button color="primary" link className="pr-1 btn-link" >Translations</Button>
                            <span className="fc_legend"><ExclamationCircleIcon className={`w-3 h-3 inline mr-2 text-error`} />Untranslated content will appear in the default language
                            </span>
                        </div>

                        <Tabs>
                            <TabList>
                                <Tab tabIndex='0'
                                    id='Tab1'
                                    panelId='Panel1'>
                                    Extra data
                                </Tab>
                                <Tab tabIndex='0'
                                    id='Tab2'
                                    panelId='Panel2'>
                                    Permissions
                                </Tab>
                            </TabList>
                            <TabPanel id='Panel1'
                                tabId='Tab1'
                                className='p-4'>
                                <h2>
                                    Any content 1
                                </h2>
                            </TabPanel>
                            <TabPanel id='Panel2'
                                tabId='Tab2'
                                className='p-4'>
                                <h2>
                                    Any content 2
                                </h2>
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>

            </div>

            <Modal {...modal}>
                <p>If you leave the tree edition now you will lose the modifications made in this level.</p>
                <p> Do you want to exit without saving?</p>
            </Modal>
        </>
    );
}

export default PageHeaderPage;
