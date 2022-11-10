/* eslint-disable no-nested-ternary */
import React from 'react';
import { forEach, isNil, map, remove } from 'lodash';
import { Controller } from 'react-hook-form';
import {
  Box,
  Button,
  ContextContainer,
  createStyles,
  InputWrapper,
  NumberInput,
  Select,
  Stack,
  TableInput,
  TAGIFY_TAG_REGEX,
  TagifyInput,
  Text,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { EditWriteIcon } from '@bubbles-ui/icons/solid';
import BranchBlockListCustomOrder from '@curriculum/bubbles-components/BranchBlockListCustomOrder';

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const useStyle = createStyles((theme) => ({
  container: {
    borderTop: `1px solid ${theme.colors.ui01}`,
    paddingTop: theme.spacing[4],
  },
  card: {
    border: `1px solid ${theme.colors.ui01}`,
    borderRadius: '8px',
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: theme.colors.uiBackground04,
    padding: `${theme.spacing[4]}px ${theme.spacing[5]}px`,
    position: 'relative',
  },
  edit: {
    position: 'absolute',
    right: 80,
    top: '50%',
    transform: 'translateY(-50%)',
  },
}));

function BranchBlockGroup2({ ...props }) {
  const { classes } = useStyle();
  const {
    messages,
    errorMessages,
    selectData,
    setCustomRightButton,
    form: {
      setValue,
      getValues,
      control,
      watch,
      unregister,
      formState: { errors },
    },
  } = props;

  const showAs = watch('showAs');
  const firstStepDone = watch('firstStepDone');
  const groupListOrdered = watch('groupListOrdered');
  const groupTypeOfContents = watch('groupTypeOfContents');

  const showAsText = React.useMemo(() => {
    let finalText = showAs;
    let array;
    while ((array = TAGIFY_TAG_REGEX.exec(showAs)) !== null) {
      const json = JSON.parse(array[0])[0][0];
      finalText = finalText.replace(array[0], json.value);
    }
    return finalText;
  }, [showAs]);

  const columnsConfig = React.useMemo(
    () => ({
      resetOnAdd: true,
      editable: true,
      removable: true,
      sortable: false,
      labels: {
        add: messages.tableAdd,
        remove: messages.tableRemove,
        edit: messages.tableEdit,
        accept: messages.tableAccept,
        cancel: messages.tableCancel,
      },
      columns: [
        {
          Header: `${messages.fieldName} *`,
          accessor: 'name',
          input: {
            node: <TextInput />,
            rules: { required: errorMessages.fieldNameRequired },
          },
        },
        {
          Header: messages.fieldMaxLabel,
          accessor: 'max',
          input: {
            node: <NumberInput min={0} />,
          },
        },
      ],
      onChange: (e) => {
        setValue(
          'columns',
          map(e, (item) => ({
            ...item,
            type: 'field',
            id: item.id || makeid(32),
          }))
        );
      },
    }),
    []
  );

  async function isFirstStepDone() {
    const fieldsToRemove = ['name', 'curricularContent', 'type'];
    const fieldsToTrigger = [...props.form.control._names.mount];
    remove(fieldsToTrigger, (n) => fieldsToRemove.includes(n));
    return props.form.trigger(fieldsToTrigger);
  }

  async function tryContinue(e) {
    e.stopPropagation();
    e.preventDefault();
    if (await isFirstStepDone()) {
      setCustomRightButton(null);
      setValue('firstStepDone', true);
    }
  }

  const rightButton = (
    <Button type="button" variant="outline" onClick={tryContinue}>
      {messages.continueButtonLabel}
    </Button>
  );

  React.useEffect(() => {
    if (!firstStepDone) {
      setCustomRightButton(rightButton);
    } else {
      setCustomRightButton(null);
    }
    return () => {
      setCustomRightButton(null);
    };
  }, [firstStepDone]);

  const listTypeController = (
    <Controller
      name="groupListType"
      control={control}
      rules={{
        required: errorMessages.listTypeRequired,
      }}
      render={({ field }) => (
        <Select
          label={messages.subTypeLabel}
          placeholder={messages.listTypePlaceholder}
          required
          error={errors.groupListType}
          data={selectData.listType || []}
          {...field}
        />
      )}
    />
  );
  const maxController = (
    <Controller
      name="groupMax"
      control={control}
      render={({ field }) => (
        <NumberInput
          min={0}
          label={messages.fieldMaxLabel}
          placeholder={messages.fieldMaxPlaceholder}
          error={errors.groupMax?.message}
          {...field}
        />
      )}
    />
  );

  const listOrderedController = (
    <Controller
      name="groupListOrdered"
      control={control}
      render={({ field }) => (
        <Select
          label={messages.numerationLabel}
          placeholder={messages.listOrderedPlaceholder}
          error={errors.groupListOrdered}
          data={selectData.listOrdered || []}
          {...field}
        />
      )}
    />
  );

  const elementsColumnsConfig = React.useMemo(() => {
    const formColumns = getValues('columns');
    const columns = [];
    forEach(formColumns, (col) => {
      const rules = {
        required: messages.fieldRequired,
      };
      let { name } = col;
      if (!isNil(col.max)) {
        name += ` (${col.max})`;
        rules.maxLength = {
          value: col.max,
          message: messages.maxLength.replace('{max}', col.max),
        };
      }
      columns.push({
        Header: `${name} *`,
        accessor: col.id,
        input: {
          node: <TextInput />,
          rules,
        },
      });
    });
    return {
      resetOnAdd: true,
      editable: true,
      removable: true,
      sortable: false,
      labels: {
        add: messages.tableAdd,
        remove: messages.tableRemove,
        edit: messages.tableEdit,
        accept: messages.tableAccept,
        cancel: messages.tableCancel,
      },
      columns,
      onChange: (e) => {
        setValue(
          'elements',
          map(e, (item) => ({
            ...item,
            id: item.id || makeid(32),
          }))
        );
      },
    };
  }, [watch('columns')]);

  const whitelist = React.useMemo(
    () =>
      (getValues('columns') || []).map((item) => ({
        ...item,
        value: item.name,
      })),
    [watch('columns')]
  );

  if (firstStepDone) {
    return (
      <ContextContainer>
        <Box className={classes.card}>
          <Box className={classes.cardHeader}>
            <Box>
              <Text role="productive" size="md" color="primary" stronger>
                {messages.subBlock}
              </Text>
            </Box>
            <Box>
              <Text role="productive" color="primary">
                {showAsText}
              </Text>
            </Box>
            <Box className={classes.edit}>
              <Button
                variant="link"
                leftIcon={<EditWriteIcon />}
                onClick={() => {
                  setValue('firstStepDone', false);
                }}
              >
                {messages.tableEdit}
              </Button>
            </Box>
          </Box>
        </Box>
        <Controller
          key="elements"
          name="elements"
          control={control}
          rules={{
            required: errorMessages.groupShowAsRequired,
          }}
          render={({ field }) => (
            <InputWrapper error={errors.elements}>
              <TableInput data={field.value || []} {...elementsColumnsConfig} />
            </InputWrapper>
          )}
        />
      </ContextContainer>
    );
  }

  return (
    <ContextContainer className={classes.container}>
      <Box>
        <Title order={5} weight={500}>
          {messages.subBlockTitle}
        </Title>
        <Controller
          name="columns"
          control={control}
          rules={{
            required: errorMessages.groupShowAsRequired,
          }}
          render={({ field }) => (
            <InputWrapper error={errors.columns}>
              <TableInput {...field} data={field.value} {...columnsConfig} />
            </InputWrapper>
          )}
        />
      </Box>
      <Controller
        name="showAs"
        control={control}
        rules={{
          required: errorMessages.groupShowAsRequired,
        }}
        render={({ field }) => (
          <TagifyInput
            value={field.value}
            onChange={(e) => field.onChange(e.detail.value)}
            settings={{
              mode: 'mix',
              pattern: /@/,
              editTags: false,
              whitelist,
            }}
            withSuggestions={true}
            whitelist={whitelist}
            error={errors.showAs}
            label={messages.groupShowAs}
            required
          />
        )}
      />
      <Box>
        <Title order={5} weight={500}>
          {messages.subBlockContent}
        </Title>
        <Stack fullWidth spacing={2} sx={(theme) => ({ marginTop: theme.spacing[2] })}>
          <Box>
            <Controller
              name="groupTypeOfContents"
              control={control}
              rules={{
                required: errorMessages.groupOrderedRequired,
              }}
              render={({ field }) => (
                <Select
                  label={messages.groupTypeOfContentLabel}
                  placeholder={messages.groupTypeOfContentPLaceholder}
                  required
                  error={errors.groupTypeOfContents}
                  data={selectData.groupTypeOfContents || []}
                  {...field}
                />
              )}
            />
          </Box>
          <Box>
            {groupTypeOfContents === 'list'
              ? listTypeController
              : groupTypeOfContents
              ? maxController
              : null}
          </Box>
          <Box>{groupTypeOfContents === 'list' ? maxController : null}</Box>
          <Box>{groupTypeOfContents === 'list' ? listOrderedController : null}</Box>
        </Stack>
        {groupListOrdered === 'custom' ? (
          <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
            <BranchBlockListCustomOrder
              messages={messages}
              errorMessages={errorMessages}
              isLoading={false}
              selectData={selectData}
              form={props.form}
              withPrevious={false}
              tagifyProps={{
                withSuggestions: true,
                whitelist,
                settings: {
                  mode: 'mix',
                  pattern: /@/,
                  editTags: false,
                  whitelist,
                },
              }}
            />
          </Box>
        ) : null}
      </Box>
    </ContextContainer>
  );
}

export default BranchBlockGroup2;
