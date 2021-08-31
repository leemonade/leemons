import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PageHeader, Input, Button, Tabs, TabList, Tab, TabPanel } from 'leemons-ui';
import LevelSchemaTree from '@classroom/components/levelSchema/tree';

export default function Add({ levelSchemas, parentId }) {
  const [parent, setParent] = useState(null);
  useEffect(() => {
    setParent(levelSchemas.find(({ id }) => parentId));
  }, [levelSchemas, parentId]);

  const router = useRouter();
  return (
    <div>
      <PageHeader
        title="Organization"
        titlePlaceholder="This is your organization. Star by creating your first program, then you will be able to add courses and classes."
        canEditTitle={true}
        saveButton={true}
        cancelButton={true}
      />
      <>
        <LevelSchemaTree
          levelSchemas={levelSchemas}
          showButtons={false}
          initialSelected={parentId}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input outlined={true} placeholder="Level name" />
          <Button color="primary">Save</Button>
        </form>

        <Tabs router={router} saveHistory={true}>
          <TabList>
            <Tab id="dataset" panelId="dataset">
              Extra Data
            </Tab>
            <Tab id="assignableProfiles" panelId="assignableProfiles">
              Assignable Profiles
            </Tab>
          </TabList>
          <TabPanel id="dataset">
            <p>Extra Data</p>
          </TabPanel>
          <TabPanel id="assignableProfiles">
            <p>Assignable Profiles</p>
          </TabPanel>
        </Tabs>
      </>
    </div>
  );
}
