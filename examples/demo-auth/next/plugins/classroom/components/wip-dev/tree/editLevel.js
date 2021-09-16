import React from 'react';
import { Button, FormControl, Tabs, Tab, TabList, TabPanel, Input, Checkbox } from 'leemons-ui';
import { InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';

export default function EditLevel() {
  return (
    <>
      <div className="flex-1 my-2 mb-2 bg-primary-content py-6 pl-12 pr-6">
        <FormControl>
          <div className="flex space-x-2 mb-4">
            <Input outlined className="inpu w-full" name="levelName" placeholder="Level name" />
            <button className="btn  btn-primary">Save level and continue</button>
          </div>
        </FormControl>
        <FormControl
          className="mb-12 px-4"
          label={
            <>
              Class Level{' '}
              <span className="fc_legend">
                <InformationCircleIcon className={`w-5 h-5 inline mx-2 text-gray-30`} />
                Minimum level of student assignment
              </span>
            </>
          }
          labelPosition="right"
        >
          <Checkbox color="primary" />
        </FormControl>
        <div>
          <Button color="primary" link className="pr-1 -ml-5">
            Translations
          </Button>
          <span className="fc_legend">
            <ExclamationCircleIcon className={`w-3 h-3 inline mr-2 text-error`} />
            Untranslated content will appear in the default language
          </span>
        </div>
        <Tabs>
          <TabList>
            <Tab tabIndex="0" id="Tab1" panelId="Panel1">
              Extra data
            </Tab>
            <Tab tabIndex="0" id="Tab2" panelId="Panel2">
              Permissions
            </Tab>
          </TabList>
          <TabPanel id="Panel1" tabId="Tab1" className="p-4">
            <h2>Any content 1</h2>
          </TabPanel>
          <TabPanel id="Panel2" tabId="Tab2" className="p-4">
            <h2>Any content 2</h2>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
