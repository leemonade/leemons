import React from 'react';
import { PageHeader, Select, FormControl, Alert, ClassTable, Table, Tabs, Tab, TabList, TabPanel, Textarea, Input, Button, columns } from '../../../src/components/ui';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';


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
            <div className="bg-secondary-content post-mode w-full h-screen overflow-auto grid">
                <div className="bg-primary-content w-full">
                    <PageHeader
                        separator={false}
                        title="Organization"
                        className="pb-2"
                    >
                    </PageHeader>
                    <p className="page-description text-secondary pb-12 max-w-screen-xl w-full mx-auto px-6">
                        This is your organization. Star by creating your first program, then you will be able to add courses and classes.
                    </p>
                </div>
                <div className="flex gap-4 max-w-screen-xl w-full mx-auto px-6">
                    {/* Dummy tree */}
                    <div className=" my-2 mb-2">
                        <ul className="tree" role="list">
                            <li className="" role="listitem" draggable="true">
                                <div className="tree-node relative flex items-center h-8 rounded group bg-white hover:bg-gray-10 cursor-pointer pr-2">
                                    <div className="flex items-center justify-center group cursor-pointer transition-transform transform ease-linear h-6 w-8 rotate-0">
                                        <svg className="text-gray-300 group-hover:text-secondary" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <div className="flex-1 my-2 mb-2 bg-primary-content py-6 pl-12 pr-6 max-w-screen-md">
                        <FormControl>
                            <div className="flex space-x-2 mb-4">
                                <div>
                                    <Input outlined className="inpu w-full max-w-md" name="levelName" placeholder="First grade" />
                                    <Alert className="fc-alert w-full max-w-md bg-gray-10 my-2">
                                        <div className='flex-1'>
                                            <InformationCircleIcon className='w-3 h-3 mx-2 text-gray-50' />
                                            <label className=" font-inter text-xs">
                                                Important: This is a class level, you can assign students later in Classes Admin

                                            </label>
                                        </div>
                                    </Alert>
                                </div>
                                <button className="btn  btn-primary">Save</button>
                            </div>
                        </FormControl>
                        <FormControl >
                            <Textarea className='h-24 max-w-md  mb-6 textarea-bordered'
                                placeholder='Level description'
                                maxLength={140}
                            />
                        </FormControl>


                        <div>
                            <Button color="primary" link className="btn-link">Translations</Button>
                            <span className="fc_legend"><ExclamationCircleIcon className={`w-3 h-3 inline mr-2 text-error`} />Untranslated content will appear in the default language
                            </span>
                        </div>
                        <Tabs activeIndex={1}>
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
                                className='py-4 prose'>
                                <h3 className="text-secondary">
                                    Any content 1
                                </h3>
                            </TabPanel>
                            <TabPanel id='Panel2'
                                tabId='Tab2'
                                className='py-4'>
                                <h3 className=" text-secondary-600 text-xl font-semibold">Permissions</h3>
                                {/* Dummy tabla */}
                                <table role="table" class="table table-admin table-fixed">
                                    <thead>
                                        <tr role="row" className="">
                                            <th colspan="1" role="columnheader" className="th">Level permissions</th>
                                            <th colspan="1" role="columnheader" className="th text-center">View</th>
                                            <th colspan="1" role="columnheader" className="th text-center">Edit</th>
                                            <th colspan="1" role="columnheader" className="th text-center">Assign</th>
                                        </tr>
                                    </thead>
                                    <tbody role="rowgroup">
                                        <tr role="row" className="">
                                            <td role="cell" className="td">
                                                <div className="">Admin</div>
                                            </td>
                                            <td role="cell" className="selected">
                                                <div className="center">
                                                    <input type="checkbox" className="checkbox checkbox-primary" checked /><span class="checkbox-mark"></span>
                                                </div>
                                            </td>
                                            <td role="cell">
                                                <div className="center">
                                                    <input type="checkbox" className="checkbox checkbox" /><span class="checkbox-mark"></span>
                                                </div>
                                            </td>
                                            <td role="cell" >
                                                <div className="center">
                                                    <input type="checkbox" className="checkbox checkboxy" /><span class="checkbox-mark"></span>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr role="row" className="">
                                            <td role="cell" className="td">
                                                <div className="">Tutors</div>
                                            </td>
                                            <td role="cell" className="selected">
                                                <div className="center">
                                                    <input type="checkbox" className="checkbox checkbox-primary" checked /><span class="checkbox-mark"></span>
                                                </div>
                                            </td>
                                            <td role="cell">
                                                <div className="center">
                                                    <input type="checkbox" className="checkbox" /><span class="checkbox-mark"></span>
                                                </div>
                                            </td>
                                            <td role="cell" className="selected">
                                                <div className="center">
                                                    <input type="checkbox" className="checkbox checkbox-primary" checked /><span class="checkbox-mark"></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr role="row" className="">
                                            <td role="cell" className="td">
                                                <div className="">Teachers</div>
                                            </td>
                                            <td role="cell" className="selected">
                                                <div className="center">
                                                    <input type="checkbox" className="checkbox checkbox-primary" checked /><span class="checkbox-mark"></span>
                                                </div>
                                            </td>
                                            <td role="cell" className="selected">
                                                <div className="center">
                                                    <input type="checkbox" className="checkbox checkbox-primary" checked /><span class="checkbox-mark"></span>
                                                </div>
                                            </td>
                                            <td role="cell" className="selected">
                                                <div className="center">
                                                    <input type="checkbox" className="checkbox checkbox-primary" checked /><span class="checkbox-mark"></span>
                                                </div>
                                            </td>
                                        </tr>


                                    </tbody>
                                </table>
                                {/* Fin Dummy tabla */}
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>

            </div>
        </>
    );
}

export default PageHeaderPage;
