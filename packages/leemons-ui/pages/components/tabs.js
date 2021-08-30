import React from 'react';
import { XIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import {
  Badge,
  Button,
  Divider,
  Tab,
  TabPanel,
  Tabs,
  TabList,
  useTabs,
} from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

function TabsPage() {
  const data = {
    showType: true,
    components: [],
    utilities: [],
  };
  const router = useRouter();
  const myTabs = useTabs();

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Tabs</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper
          className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
          title="Tabs simple"
        >
          <div className="p-4 bg-base-200 rounded-lg w-full">
            <Tabs>
              <TabList>
                <Tab tabIndex="0" id="Tab1" panelId="Panel1">
                  Title 1
                </Tab>
                <Tab tabIndex="0" id="Tab2" panelId="Panel2">
                  Title 2
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
        </Wrapper>

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

        <div></div>

        <Wrapper
          className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
          title="Tabs controlled"
        >
          <div className="p-4 bg-base-200 rounded-lg w-full">
            <Tabs {...myTabs}>
              <TabList>
                <Tab tabIndex="0" id="englishTab" panelId="englishPanel">
                  English
                </Tab>
                <Tab tabIndex="0" id="spanishTab" panelId="spanishPanel">
                  Español
                </Tab>
              </TabList>

              <TabPanel id="englishPanel" tabId="englishTab" className="p-4">
                <h2>I'm the Panel Content</h2>
              </TabPanel>
              <TabPanel id="spanishPanel" tabId="spanishTab" className="p-4">
                <h2>Aquí va el contenido en Español</h2>
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

export default TabsPage;
