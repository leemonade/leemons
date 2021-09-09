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
import updateLevelSchema from '../../services/levelSchemas/updateLevelSchema';
import addLevel from '../../services/levels/addLevel';
import updateLevel from '../../services/levels/updateLevel';
import DatasetExample from '../dataset/example';
import DatasetAdmin from '../dataset/datasetAdmin';

export default function Add({
  entities,
  schemas = null,
  schemaId = null,
  entityId = null,
  parentId,
  onClose = () => {},
}) {
  console.log('Schema', schemaId, 'parent', parentId);
  const [isClass, setIsClass] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  const [entity, setEntity] = useState(null);

  const useSchema = schemas !== null;

  useEffect(() => {
    let entity = entities.find(({ id }) => entityId === id);
    // If editing an entity, set the entity values
    if (entity) {
      if (useSchema) {
        schemaId = entity.schema;
        setValue('description', entity.description);
      } else {
        setIsClass(entity.isClass);
      }
      setValue('levelName', entity.name);
      setEntity(entity);
      // If creating a new entity, set the values to default
    } else {
      setValue('description', '');
      setIsClass(false);
      setValue('levelName', '');
      setEntity(null);
    }
  }, [entityId, entities]);

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
      if (entityId) {
        level.id = entityId;
        console.log(level);
        try {
          level = await updateLevel(level);
          // TODO Provide the new LevelSchema
          onClose(level);
        } catch (e) {
          console.error(e);
        }
      } else {
        console.log(level);
        try {
          level = await addLevel(level);
          // TODO Provide the new LevelSchema
          onClose(level);
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      let levelSchema = {
        parent: parentId,
        name: data.levelName,
        names: { en: data.levelName },
        isClass,
      };
      if (entityId) {
        levelSchema.id = entityId;
        try {
          levelSchema = await updateLevelSchema(levelSchema);
          console.log(levelSchema);
          // TODO Provide the new LevelSchema
          onClose(levelSchema);
        } catch (e) {
          console.error(e);
        }
      } else {
        try {
          levelSchema = await addLevelSchema(levelSchema);
          console.log(levelSchema);
          // TODO Provide the new LevelSchema
          onClose(levelSchema);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const router = useRouter();
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          outlined={true}
          {...register('levelName')}
          // defaultValue={entity ? entity.name : ''}
          placeholder="Level name"
        />
        {!useSchema && (
          <FormControl label="Class Level" labelPosition="right">
            <Toggle
              checked={isClass}
              onChange={(e) => {
                setIsClass(!isClass);
              }}
            />
          </FormControl>
        )}
        {useSchema && (
          <Textarea
            {...register('description')}
            defaultValue={entity ? entity.description : ''}
            placeholder="Level description"
          />
        )}
        <Button
          color="neutral"
          onClick={(e) => {
            e.preventDefault();
            onClose(null);
          }}
        >
          Cancel
        </Button>
        <Button color="primary">Save</Button>
      </form>

      {useSchema ? (
        // Levels Tabs
        <Tabs router={router} saveHistory={true}>
          <TabList>
            {/* <Tab id="dataset" panelId="dataset">
              Extra Data
            </Tab> */}
            <Tab id="permissions" panelId="permissions">
              Permissions
            </Tab>
          </TabList>

          {/* <TabPanel id="dataset">
            <p>Extra Data</p>
          </TabPanel> */}
          <TabPanel id="permissions">
            <p>Permissions</p>
          </TabPanel>
        </Tabs>
      ) : (
        // LevelSchemas Tabs
        <Tabs router={router} saveHistory={true}>
          <TabList>
            {/* <Tab id="dataset" panelId="dataset">
              Dataset
            </Tab> */}
            <Tab id="assignableProfiles" panelId="assignableProfiles">
              Assignable Profiles
            </Tab>
          </TabList>
          {/* <TabPanel id="dataset">
            <DatasetAdmin />
          </TabPanel> */}
          <TabPanel id="assignableProfiles">
            <p>Assignable Profiles</p>
          </TabPanel>
        </Tabs>
      )}
    </div>
  );
}
