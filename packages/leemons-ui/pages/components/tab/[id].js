import React from 'react';
import { useRouter } from 'next/router';
import { Divider, Tab, TabPanel, Tabs, TabList } from '../../../src/components/ui';
import ClassTable from '../../../src/components/ClassTable';
import Wrapper from '../../../src/components/Wrapper';

function DynamicTabPage() {
  const data = {
    showType: true,
    components: [],
    utilities: [],
  };
  const router = useRouter();

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Tabs</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper
          className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
          title="Tabs with router"
        >
          <div className="p-4 bg-base-200 rounded-lg w-full">
            <Tabs router={router} saveHistory>
              <TabList>
                <Tab tabIndex="0" id="TabA" panelId="PanelA">
                  Title A
                </Tab>
                <Tab tabIndex="0" id="TabB" panelId="PanelB">
                  Title B
                </Tab>
              </TabList>

              <TabPanel id="PanelA" tabId="TabA" className="p-4">
                <h2>Any content A</h2>
              </TabPanel>
              <TabPanel id="PanelB" tabId="TabB" className="p-4">
                <h2>Any content B</h2>
              </TabPanel>
            </Tabs>
          </div>
        </Wrapper>

        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default DynamicTabPage;
