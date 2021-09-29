import React from 'react';
import { FormControl, Input, PageContainer, PageHeader, Badge, Button, Table } from '../../../src/components/ui';
import { XIcon, SearchIcon } from '@heroicons/react/outline';


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
            <div className="bg-secondary-content w-full h-screen overflow-auto">
                <PageHeader
                    separator={false}
                    title="Families list"
                    description="Families make it easy to manage the organization of parent and student groups"
                    importFamiliesButton={true}
                    newButton={true}
                />
                <div className="bg-primary-content w-full">
                    <div className="max-w-screen-xl w-full mx-auto p-6">
                        <h2 className="resultcount flex items-center" aria-live='polite'> <Badge outlined>250</Badge> <span className="text-xl font-medium">Families</span></h2>
                    </div>
                </div>

                <PageContainer>
                    <FormControl>

                        <div className="relative">
                            <Button className='btn-search'>
                                <SearchIcon
                                    className={`w-5 h-5 transition color-base-300 `}
                                />
                            </Button>

                            <Input
                                ghost={true}
                                placeholder="Find a family"
                                className="bg-transparent input-search"
                            />
                            {/* si he realizado búsqueda botón para limpiar */}
                            <Button className='btn-circle btn-xs ml-8 bg-transparent border-0'>
                                <XIcon className='inline-block w-4 h-4 stroke-current' />
                            </Button>
                        </div>
                    </FormControl>
                    <div class="p-4 mt-10">
                        <h3 className="" aria-live='polite'>Found <strong className="text-secondary">2 families</strong> with the name Pérez López</h3>
                        <div className="bg-primary-content mt-4">
                            <table role="table" class="w-full">
                                <thead>
                                    <tr role="row" class="border-b border-base-300">
                                        <th colspan="1" role="columnheader" class="text-xs weigth-semibold py-3 px-4 text-secondary text-left">Familia</th>
                                        <th colspan="1" role="columnheader" class="text-xs weigth-semibold py-3 px-4 text-secondary text-left">Número</th>
                                        <th colspan="1" role="columnheader" class="text-xs weigth-semibold py-3 px-4 text-secondary text-left">Teléfono</th>
                                        <th colspan="1" role="columnheader" class="text-xs weigth-semibold py-3 px-4 text-secondary text-left">Email contacto</th>
                                        <th colspan="1" role="columnheader" class="text-xs weigth-semibold py-3 px-4 text-secondary text-left">Tutor 1</th>
                                        <th colspan="1" role="columnheader" class="text-xs weigth-semibold py-3 px-4 text-secondary text-left">Tutor 2</th>
                                        <th colspan="1" role="columnheader" class="text-xs weigth-semibold py-3 px-4 text-secondary text-left">Estudiantes</th>
                                    </tr>
                                </thead>
                                <tbody role="rowgroup">
                                    <tr role="row" class="border-b border-base-300">
                                        <td role="cell" class="m-0 p-0">
                                            <div class="text-sm py-3 px-4">Perez Lopez</div>
                                        </td>
                                        <td role="cell" class="m-0 p-0">
                                            <div class="text-sm py-3 px-4">66635366</div>
                                        </td>
                                        <td role="cell" class="m-0 p-0">
                                            <div class="text-sm py-3 px-4">+34678890765</div>
                                        </td>
                                        <td role="cell" class="m-0 p-0">
                                            <div class="text-sm py-3 px-4">
                                                <a class="text-sm text-primary" href="#">debbie.baker@example.com</a>
                                            </div>
                                        </td>
                                        <td role="cell" class="m-0 p-0">
                                            <div class="text-sm py-3 px-4">Pedro Perez</div>
                                        </td>
                                        <td role="cell" class="m-0 p-0">
                                            <div class="text-sm py-3 px-4">Ana López</div>
                                        </td>
                                        <td role="cell" class="m-0 p-0">
                                            <div class="text-sm py-3 px-4">2</div>
                                        </td>
                                    </tr>

                                    <tr role="row" class="border-b border-base-300">
                                        <td role="cell" class="m-0 p-0">
                                            <div class="text-sm py-3 px-4">Perez Lopez</div>
                                        </td>
                                        <td role="cell" class="m-0 p-0">
                                            <div class="text-sm py-3 px-4">45635368</div>
                                        </td>
                                        <td role="cell" class="m-0 p-0">
                                            <div class="text-sm py-3 px-4">+34655890565</div>
                                        </td>
                                        <td role="cell" class="m-0 p-0">
                                            <div class="text-sm py-3 px-4">
                                                <a class="text-sm text-primary" href="#">debbie@example.com</a>
                                            </div>
                                        </td>
                                        <td role="cell" class="m-0 p-0">
                                            <div class="text-sm py-3 px-4">Jaime Perez</div>
                                        </td>
                                        <td role="cell" class="m-0 p-0">
                                            <div class="text-sm py-3 px-4">María López</div>
                                        </td>
                                        <td role="cell" class="m-0 p-0">
                                            <div class="text-sm py-3 px-4">3</div>
                                        </td>
                                    </tr>


                                </tbody>
                            </table>
                        </div>
                    </div>
                </PageContainer>
            </div>
        </ >
    );
}

export default PageHeaderPage;
