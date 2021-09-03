import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Input,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Toggle,
  Textarea,
  FormControl,
} from 'leemons-ui';
import { useForm } from 'react-hook-form';

import addLevelSchema from '../../services/levelSchemas/addLevelSchema';
import addLevel from '../../services/levels/addLevel';
import DatasetExample from '../dataset/datasetAdmin';

export default function Add({
  entities,
  schemas = null,
  schemaId = null,
  entityId = null,
  parentId,
  onClose = () => {},
}) {
  console.log('Schema', schemaId, 'parent', parentId);
  const isClass = useRef(false);
  const { register, handleSubmit } = useForm();
  const [parent, setParent] = useState(null);

  const useSchema = schemas !== null;

  useEffect(() => {
    setParent(entities.find(({ id }) => parentId));
  }, [entities, parentId]);

  const onSubmit = async (data) => {
    if (!data.levelName) {
      console.error('The name must be filled');
      return;
    }
    if (useSchema && !data.description) {
      console.error('The description must be filled');
    }

    if (useSchema) {
      let level = {
        parent: parentId,
        schema: schemaId,
        name: data.levelName,
        names: { en: data.levelName },
        descriptions: { en: data.description },
      };
      console.log(level);
      try {
        level = await addLevel(level);
        // TODO Provide the new LevelSchema
        onClose(level);
      } catch (e) {
        console.error(e);
      }
    } else {
      let levelSchema = {
        parent: parentId,
        name: data.levelName,
        names: { en: data.levelName },
        isClass: isClass.current,
      };
      try {
        levelSchema = await addLevelSchema(levelSchema);
        console.log(levelSchema);
        // TODO Provide the new LevelSchema
        onClose(levelSchema);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const router = useRouter();
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input outlined={true} {...register('levelName')} placeholder="Level name" />
        {!useSchema && (
          <FormControl label="Class Level" labelPosition="right">
            <Toggle
              onChange={(e) => {
                isClass.current = e.target.checked;
              }}
            />
          </FormControl>
        )}
        {useSchema && <Textarea {...register('description')} placeholder="Level description" />}
        <Button color="primary">Save</Button>
      </form>

      {useSchema ? (
        <Tabs router={router} saveHistory={true}>
          <TabList>
            <Tab id="dataset" panelId="dataset">
              Extra Data
            </Tab>
            <Tab id="permissions" panelId="permissions">
              Permissions
            </Tab>
          </TabList>

          <TabPanel id="dataset">
            <p>Extra Data</p>
          </TabPanel>
          <TabPanel id="permissions">
            <p>Permissions</p>
          </TabPanel>
        </Tabs>
      ) : (
        <Tabs router={router} saveHistory={true}>
          <TabList>
            <Tab id="dataset" panelId="dataset">
              Dataset
            </Tab>
            <Tab id="assignableProfiles" panelId="assignableProfiles">
              Assignable Profiles
            </Tab>
          </TabList>
          <TabPanel id="dataset">
            <p>Extra Data</p>
            <DatasetExample />
          </TabPanel>
          <TabPanel id="assignableProfiles">
            <p>Assignable Profiles</p>
          </TabPanel>
        </Tabs>
      )}
    </div>
  );
}
