import React from 'react';
import { FormControl, Input, PageContainer, PageHeader, Badge, Button, Table } from '../../../src/components/ui';
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
        <main>
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

            <div className='w-full bg-secondary-content edit-mode h-screen overflow-y-auto'>

            </div>
        </main >
    );
}

export default PageHeaderPage;
