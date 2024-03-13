import React, { useEffect, useMemo, useState } from 'react';
import { omit, isArray } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  ActionButton,
  Box,
  Stack,
  Button,
  Checkbox,
  ContextContainer,
  Drawer,
  MultiSelect,
  RadioGroup,
  Select,
  Switch,
  Title,
  TextInput,
  TimeInput,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import ImagePicker from '@leebrary/components/ImagePicker';
import { AlertInformationCircleIcon } from '@bubbles-ui/icons/solid';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import { DatePicker } from '@common';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { listProgramsRequest, listSessionClassesRequest } from '@academic-portfolio/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { saveRequest } from '@board-messages/request';
import { getUserPrograms } from '@academic-portfolio/request/programs';
import {
  DETAIL_DRAWER_DEFAULT_PROPS,
  DETAIL_DRAWER_PROP_TYPES,
  MESSAGE_ZONES,
} from './DetailDrawer.constants';
import { DetailDrawerStyles } from './DetailDrawer.styles';
import modal from '../../../public/modal.svg';
import dashboard from '../../../public/dashboard.svg';
import { SelectItem } from './components/SelectItem';
import { getOverlapsRequest } from '../../request';

const DRAWER_WIDTH = 576;
const HALF_WIDTH = 'calc(50% - 10px)';

const ValueComponent = (props) => <SelectItem {...props} isValueComponent />;

const DetailDrawer = ({
  open,
  labels,
  isNew,
  currentMessage,
  onClose,
  centers,
  profiles,
  reloadMessages,
}) => {
  const isTeacher = useIsTeacher();
  const defaultValues = {
    internalName: '',
    centers: '',
    programs: [],
    profiles: [],
    message: '',
    url: '',
    textUrl: '',
    zone: isTeacher ? MESSAGE_ZONES.CLASSROOM_DASHBOARD : MESSAGE_ZONES.MODAL,
    publicationType: 'immediately',
    startDate: new Date(),
    endDate: null,
    isUnpublished: currentMessage.status === 'unpublished',
    ...currentMessage,
  };

  const [programs, setPrograms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [overWriteMessages, setOverWriteMessages] = useState(false);
  const [overlaps, setOverlaps] = useState([]);
  const scrollRef = React.useRef(null);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const publicationType = watch('publicationType');
  const centersValue = watch('centers');
  const programsValue = watch('programs');
  const profilesValue = watch('profiles');
  const startDateValue = watch('startDate');
  const endDateValue = watch('endDate');
  const urlValue = watch('url');
  const textUrlValue = watch('textUrl');
  const zoneValue = watch('zone');
  const formValues = watch();

  const formatData = useMemo(() => {
    let data = [];
    if (!isTeacher) {
      data = [
        { label: labels.modal, value: 'modal', image: modal },
        { label: labels.dashboard, value: 'dashboard', image: dashboard },
      ];
    } else data = [{ label: labels.classDashboard, value: 'class-dashboard', image: dashboard }];
    return data;
  }, [isTeacher, labels]);

  const saveMessageConfig = async (values) => {
    const fieldsToOmit = ['isUnpublished', 'totalClicks', 'totalViews', 'owner', 'userOwner'];
    if (!isNew) {
      fieldsToOmit.push(
        '__v',
        '_id',
        'updated_at',
        'created_at',
        'deleted_at',
        'updatedAt',
        'createdAt',
        'deletedAt',
        'deleted',
        'isDeleted',
        'deploymentID'
      );
    }

    const payload = {
      ...values,
      centers: isArray(values.centers) ? values.centers : [values.centers],
      status:
        values.isUnpublished || (overlaps.length > 0 && !overWriteMessages)
          ? 'unpublished'
          : 'published',
      unpublishConflicts: overWriteMessages,
    };

    const message = omit(payload, fieldsToOmit);
    message.asset =
      message.asset?.original?.cover?.id ??
      message.asset?.cover?.id ??
      message.asset?.cover ??
      message.asset;

    if (!message.url) message.url = null;
    if (!message.textUrl) message.textUrl = null;

    try {
      await saveRequest(message);
      addSuccessAlert(isNew ? labels.success : labels.updateSuccess);
      onClose();
      reloadMessages();
    } catch (error) {
      addErrorAlert(error);
    }
  };

  const getAllPrograms = async () => {
    try {
      let allPrograms = [];
      if (isTeacher) {
        const { programs: results } = await getUserPrograms();
        allPrograms = results;
      } else {
        const {
          data: { items: listResult },
        } = await listProgramsRequest({ page: 0, size: 9999, center: centersValue });
        allPrograms = listResult;
      }
      if (allPrograms.length > 0) {
        setPrograms(allPrograms.map((program) => ({ label: program.name, value: program.id })));
      }
    } catch (error) {
      addErrorAlert(error);
    }
  };

  const getAllClasses = async () => {
    try {
      const results = await Promise.all(
        programsValue.map((program) => listSessionClassesRequest({ program }))
      );
      const allClasses = results.reduce((prev, current) => [...prev, ...current.classes], []);
      setClasses(
        allClasses.map((klass) => ({
          label: klass.subject.name,
          value: klass.id,
          subject: { ...klass.subject, color: klass.color },
        }))
      );
    } catch (error) {
      addErrorAlert(error);
    }
  };

  const handleTimeChange = (type, value) => {
    const valueToChange = type === 'startDate' ? startDateValue : endDateValue;
    valueToChange.setMinutes(value.getMinutes());
    valueToChange.setHours(value.getHours());
    setValue(type, valueToChange);
  };

  const getOverlaps = async () => {
    const message = {
      ...formValues,
      centers: isArray(formValues.centers) ? formValues.centers : [formValues.centers],
      status: formValues.isUnpublished ? 'unpublished' : 'published',
    };
    const { messages } = await getOverlapsRequest(message);
    setOverlaps(messages);
  };

  useEffect(() => {
    if (!centersValue) {
      setPrograms([]);
      return;
    }
    if (isNew) setValue('programs', []);
    else if (
      (isArray(centersValue) &&
        !defaultValues.centers.every((center) => centersValue.includes(center))) ||
      (!isArray(centersValue) && defaultValues.centers[0] !== centersValue)
    ) {
      setValue('programs', []);
    }
    getAllPrograms();
  }, [centersValue]);

  useEffect(() => {
    if (isTeacher) {
      getAllClasses();
    }
    if (programsValue.length === 0) {
      setValue('classes', []);
    }
  }, [programsValue, isTeacher]);

  useEffect(() => {
    if (isNew && publicationType === 'immediately') {
      setValue('startDate', new Date());
      setValue('endDate', null);
    }
    if (isNew) setValue('startDate', new Date());
  }, [publicationType]);

  useEffect(() => {
    reset(defaultValues);
  }, [currentMessage]);

  useEffect(() => {
    getOverlaps();
  }, [
    startDateValue,
    endDateValue,
    centersValue,
    programsValue,
    profilesValue,
    zoneValue,
    publicationType,
  ]);

  const buttonLabel = React.useMemo(() => {
    if (isNew) {
      return overlaps.length ? labels.save : labels.create;
    }
    return labels.update;
  }, [isNew, overlaps.length, labels]);

  const { classes: styles } = DetailDrawerStyles({}, { name: 'DetailDrawer' });
  return (
    <Drawer empty withOverlay close={false} opened={open} onClose={onClose} size={DRAWER_WIDTH}>
      <form onSubmit={handleSubmit(saveMessageConfig)}>
        <TotalLayoutContainer
          clean
          scrollRef={scrollRef}
          Header={
            <Stack
              fullWidth
              justifyContent="space-between"
              alignItems="center"
              style={{
                padding: `0 16px 0 24px`,
                height: 70,
              }}
            >
              <Title order={3}>{isNew ? labels.new : labels.edit}</Title>
              <Stack>
                {!isNew && (
                  <Controller
                    control={control}
                    name="isUnpublished"
                    render={({ field: { value, ...field } }) => (
                      <Switch label={labels.unpublish} checked={value} {...field} />
                    )}
                  />
                )}
                <ActionButton icon={<RemoveIcon />} onClick={onClose} />
              </Stack>
            </Stack>
          }
        >
          <Stack ref={scrollRef} fullWidth fullHeight style={{ overflow: 'auto' }}>
            <TotalLayoutStepContainer
              clean
              Footer={
                <TotalLayoutFooterContainer
                  fixed
                  scrollRef={scrollRef}
                  width={DRAWER_WIDTH}
                  style={{ right: 0, zIndex: 99 }}
                  leftZone={
                    <Button variant="outline" onClick={onClose}>
                      {labels.cancel}
                    </Button>
                  }
                  rightZone={<Button type="submit">{buttonLabel}</Button>}
                />
              }
            >
              <Box>
                <ContextContainer padded>
                  <ContextContainer>
                    <Controller
                      control={control}
                      name="internalName"
                      rules={{ required: labels?.form?.internalNameError }}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          label={labels.internalName}
                          placeholder={labels.internalNamePlaceholder}
                          required
                          error={errors.internalName}
                        />
                      )}
                    />
                  </ContextContainer>
                  <ContextContainer title={labels.toWho}>
                    <ContextContainer direction="row">
                      <Box
                        sx={{
                          visibility: isTeacher && 'hidden',
                          position: isTeacher && 'absolute',
                        }}
                      >
                        <Controller
                          control={control}
                          name="centers"
                          rules={{ required: labels?.form?.centerError }}
                          render={({ field }) => (
                            <Select
                              data={centers}
                              label={labels.center}
                              placeholder={labels.centerPlaceholder}
                              {...field}
                              error={errors.centers}
                              clearable={labels.clear}
                              autoSelectOneOption
                            />
                          )}
                        />
                      </Box>
                      <Box>
                        <Controller
                          control={control}
                          name="programs"
                          render={({ field }) => (
                            <MultiSelect
                              disabled={!centersValue || !programs.length}
                              data={programs}
                              label={labels.program}
                              placeholder={labels.programPlaceholder}
                              {...field}
                            />
                          )}
                        />
                      </Box>
                    </ContextContainer>
                    <ContextContainer direction="row">
                      <Box>
                        <Controller
                          control={control}
                          name="profiles"
                          render={({ field }) => (
                            <MultiSelect
                              data={profiles}
                              label={labels.profile}
                              placeholder={labels.profilePlaceholder}
                              {...field}
                            />
                          )}
                        />
                      </Box>
                      <Box />
                    </ContextContainer>
                    {isTeacher && (
                      <Box>
                        <Controller
                          control={control}
                          name="classes"
                          render={({ field }) => (
                            <MultiSelect
                              data={classes}
                              disabled={!classes.length}
                              label={labels.subjects}
                              placeholder={labels.subjectsPlaceholder}
                              {...field}
                              style={{ width: HALF_WIDTH }}
                              valueComponent={ValueComponent}
                              itemComponent={SelectItem}
                            />
                          )}
                        />
                      </Box>
                    )}
                  </ContextContainer>
                  <ContextContainer title={labels.what}>
                    <Box>
                      <Controller
                        control={control}
                        name="message"
                        rules={{ required: labels?.form?.messageError }}
                        render={({ field: { ref, ...field } }) => (
                          <TextEditorInput
                            label={labels.message}
                            placeholder={labels.messagePlaceholder}
                            toolbars={{
                              style: true,
                              heading: false,
                              align: true,
                              list: true,
                              history: true,
                              color: true,
                              formulation: false,
                              link: false,
                              library: false,
                            }}
                            {...field}
                            required
                            error={errors.message}
                          />
                        )}
                      />
                    </Box>
                    <Box>
                      <Controller
                        control={control}
                        name="asset"
                        render={({ field }) => <ImagePicker {...field} />}
                      />
                    </Box>
                    <ContextContainer direction="row">
                      <Controller
                        control={control}
                        name="url"
                        rules={{
                          required: textUrlValue && labels?.form?.urlError,
                        }}
                        render={({ field }) => (
                          <TextInput
                            label={labels.urlToResource}
                            placeholder={labels.urlToResourcePlaceholder}
                            {...field}
                            style={{ flex: 1 }}
                            error={errors.url}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="textUrl"
                        rules={{ required: urlValue && labels?.form?.textUrlError }}
                        render={({ field }) => (
                          <TextInput
                            label={labels.textOfLink}
                            placeholder={labels.textOfLinkPlaceholder}
                            {...field}
                            style={{ flex: 1 }}
                            error={errors.textUrl}
                          />
                        )}
                      />
                    </ContextContainer>
                  </ContextContainer>
                  <ContextContainer title={labels.how}>
                    <Box>
                      <Controller
                        control={control}
                        name="zone"
                        render={({ field }) => (
                          <RadioGroup
                            defaultValue={isTeacher ? 'class-dashboard' : 'modal'}
                            data={formatData}
                            variant="image"
                            direction="column"
                            {...field}
                          />
                        )}
                      />
                    </Box>
                  </ContextContainer>
                  <ContextContainer title={labels.when}>
                    <Controller
                      control={control}
                      name="publicationType"
                      render={({ field }) => (
                        <RadioGroup
                          defaultValue="immediately"
                          data={[
                            { label: labels.immediately, value: 'immediately' },
                            { label: labels.programmed, value: 'programmed' },
                          ]}
                          {...field}
                        />
                      )}
                    />
                    {publicationType !== 'immediately' && (
                      <Box className={styles.datesRow}>
                        <Controller
                          control={control}
                          name="startDate"
                          rules={{ required: labels?.form?.startDateError }}
                          render={({ field }) => (
                            <DatePicker
                              label={labels.startDate}
                              placeholder={labels.startDatePlaceholder}
                              {...field}
                              style={{ flex: 1 }}
                              error={errors.startDate}
                            />
                          )}
                        />
                        <TimeInput
                          value={startDateValue}
                          label={labels.startHour}
                          placeholder={labels.startHourPlaceholder}
                          style={{ flex: 1 }}
                          onChange={(value) => handleTimeChange('startDate', value)}
                        />

                        <React.Fragment>
                          <Controller
                            control={control}
                            name="endDate"
                            rules={{
                              required:
                                publicationType !== 'immediately' && labels?.form?.endDateError,
                            }}
                            render={({ field }) => (
                              <DatePicker
                                label={labels.endDate}
                                placeholder={labels.endDatePlaceholder}
                                {...field}
                                style={{ flex: 1 }}
                                error={errors.endDate}
                              />
                            )}
                          />
                          <TimeInput
                            value={endDateValue}
                            label={labels.endHour}
                            placeholder={labels.endHourPlaceholder}
                            style={{ flex: 1 }}
                            onChange={(value) => handleTimeChange('endDate', value)}
                          />
                        </React.Fragment>
                      </Box>
                    )}
                    {overlaps.length > 0 && !overWriteMessages && (
                      <Alert title={labels.existingMessageTitle} closeable={false}>
                        {overlaps.length === 1
                          ? labels.existingMessageInfoSingular
                          : labels.existingMessageInfo?.replace('{nMessages}', overlaps.length)}
                      </Alert>
                    )}
                    {overlaps.length > 0 && (
                      <Box className={styles.overlapsWrapper}>
                        <Checkbox
                          checked={overWriteMessages}
                          onChange={setOverWriteMessages}
                          label={labels.overlapsCheck}
                        />
                        <Box className={styles.checkboxHelp}>
                          <AlertInformationCircleIcon height={16} width={16} />
                          {labels.checkboxHelp}
                        </Box>
                        <Box className={styles.overlaps}>
                          {overlaps.map((overlap) => (
                            <Box
                              key={overlap.id}
                              className={styles.overlap}
                            >{`-${overlap.internalName}`}</Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </ContextContainer>
                </ContextContainer>
              </Box>
            </TotalLayoutStepContainer>
          </Stack>
        </TotalLayoutContainer>
      </form>
    </Drawer>
  );
};

DetailDrawer.defaultProps = DETAIL_DRAWER_DEFAULT_PROPS;
DetailDrawer.propTypes = DETAIL_DRAWER_PROP_TYPES;

// eslint-disable-next-line import/prefer-default-export
export { DetailDrawer };
