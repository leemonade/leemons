import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Text,
  Alert,
  Drawer,
  Switch,
  Button,
  Select,
  Divider,
  Checkbox,
  TextInput,
  TimeInput,
  RadioGroup,
  MultiSelect,
  ActionButton,
} from '@bubbles-ui/components';
import { CloudUploadIcon } from '@bubbles-ui/icons/outline';
import { AlertInformationCircleIcon } from '@bubbles-ui/icons/solid';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker, TextEditorInput } from '@common';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { listSessionClassesRequest, listProgramsRequest } from '@academic-portfolio/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { saveRequest } from '@board-messages/request';
import isArray from 'lodash/isArray';
import { getUserPrograms } from '@academic-portfolio/request/programs';
import { AssetListDrawer } from '@leebrary/components';
import isString from 'lodash/isString';
import { DETAIL_DRAWER_DEFAULT_PROPS, DETAIL_DRAWER_PROP_TYPES } from './DetailDrawer.constants';
import { DetailDrawerStyles } from './DetailDrawer.styles';
import modal from '../../../public/modal.svg';
import dashboard from '../../../public/dashboard.svg';
import { SelectItem } from './components/SelectItem';
import { getOverlapsRequest } from '../../request';

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
    // asset: '',
    url: '',
    textUrl: '',
    zone: isTeacher ? 'class-dashboard' : 'modal',
    publicationType: 'immediately',
    startDate: new Date(),
    endDate: null,
    isUnpublished: currentMessage.status === 'unpublished',
    ...currentMessage,
  };
  const [programs, setPrograms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [overWriteMessages, setOverWriteMessages] = useState(false);
  const [overlaps, setOverlaps] = useState([]);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues });
  const publicationType = watch('publicationType');
  const centersValue = watch('centers');
  const programsValue = watch('programs');
  const profilesValue = watch('profiles');
  const startDateValue = watch('startDate');
  const endDateValue = watch('endDate');
  const urlValue = watch('url');
  const assetValue = watch('asset');
  const textUrlValue = watch('textUrl');
  const zoneValue = watch('zone');
  const formValues = getValues();
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
    const message = {
      ...values,
      centers: isArray(values.centers) ? values.centers : [values.centers],
      status:
        values.isUnpublished || (overlaps.length > 0 && !overWriteMessages)
          ? 'unpublished'
          : 'published',
      unpublishConflicts: overWriteMessages,
    };
    delete message.isUnpublished;
    delete message.totalClicks;
    delete message.totalViews;
    delete message.owner;
    delete message.userOwner;
    if (!message.url) message.url = null;
    if (!message.textUrl) message.textUrl = null;
    if (!isNew) {
      delete message.updated_at;
      delete message.created_at;
      delete message.deleted_at;
      delete message.deleted;
    }
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

  const isValidUrl = (urlString) => {
    let url;
    try {
      url = new URL(urlString);
    } catch (_) {
      return labels?.form?.urlValidError;
    }
    const isValid = url.protocol === 'http:' || url.protocol === 'https:';
    return isValid ? true : labels?.form?.urlValidError;
  };

  const handleOnCloseAssetDrawer = () => {
    setShowAssetDrawer(false);
  };

  const handleOnSelectAsset = (item) => {
    setValue('asset', isString(item.cover) ? item.original : item);
    setShowAssetDrawer(false);
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

  const { classes: styles } = DetailDrawerStyles({}, { name: 'DetailDrawer' });
  return (
    <Drawer opened={open} onClose={onClose} size={720}>
      <form onSubmit={handleSubmit(saveMessageConfig)}>
        <Box className={styles.root}>
          <Box className={styles.header}>
            <Text className={styles.title}>{isNew ? labels.new : labels.edit}</Text>
            {!isNew && (
              <Controller
                control={control}
                name="isUnpublished"
                render={({ field: { value, ...field } }) => (
                  <Switch label={labels.unpublish} checked={value} {...field} />
                )}
              />
            )}
          </Box>
          <Box>
            <Controller
              control={control}
              name="internalName"
              rules={{ required: labels?.form?.internalNameError }}
              render={({ field }) => (
                <TextInput
                  label={labels.internalName}
                  placeholder={labels.internalNamePlaceholder}
                  {...field}
                  required
                  error={errors.internalName}
                />
              )}
            />
          </Box>
          <Divider />
          <Box>
            <Text className={styles.subtitle}>{labels.toWho}</Text>
          </Box>
          <Box className={styles.inputRow} style={{ width: isTeacher && 'calc(50% - 10px)' }}>
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
                  style={{
                    flex: 1,
                    visibility: isTeacher && 'hidden',
                    position: isTeacher && 'absolute',
                  }}
                  error={errors.centers}
                  clearable={labels.clear}
                  autoSelectOneOption
                />
              )}
            />
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
                  style={{ flex: 1 }}
                />
              )}
            />
          </Box>
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
                  style={{ width: 'calc(50% - 10px)' }}
                />
              )}
            />
          </Box>
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
                    style={{ width: 'calc(50% - 10px)' }}
                    valueComponent={(item) => (
                      <SelectItem {...item} isValueComponent subject={item.subject} />
                    )}
                    itemComponent={(item) => <SelectItem {...item} subject={item.subject} />}
                  />
                )}
              />
            </Box>
          )}
          <Divider />
          <Box>
            <Text className={styles.subtitle}>{labels.what}</Text>
          </Box>
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
            <Box sx={(theme) => ({ display: 'flex', gap: theme.spacing[2] })}>
              <TextInput
                style={{ width: '100%' }}
                value={assetValue?.name}
                readonly
                onClick={() => setShowAssetDrawer(true)}
              />
              <ActionButton
                color="primary"
                size="md"
                icon={<CloudUploadIcon />}
                onClick={() => setShowAssetDrawer(true)}
                label={labels.uploadImage}
              />
            </Box>
          </Box>
          <Box className={styles.inputRow}>
            <Controller
              control={control}
              name="url"
              rules={{
                required: textUrlValue && labels?.form?.urlError,
                validate: urlValue && ((value) => isValidUrl(value)),
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
          </Box>
          <Divider />
          <Box>
            <Text className={styles.subtitle}>{labels.how}</Text>
          </Box>
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
          <Divider />
          <Box>
            <Text className={styles.subtitle}>{labels.when}</Text>
          </Box>
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
                    required: publicationType !== 'immediately' && labels?.form?.endDateError,
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
            <Alert title={labels.existingMessageTitle}>
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
          <Box className={styles.buttonRow}>
            <Button variant="outline" onClick={onClose}>
              {labels.cancel}
            </Button>
            <Button type="submit">
              {isNew ? (overlaps.length ? labels.save : labels.create) : labels.update}
            </Button>
          </Box>
        </Box>
      </form>
      <AssetListDrawer
        opened={showAssetDrawer}
        onClose={handleOnCloseAssetDrawer}
        size={720}
        shadow
        onSelect={handleOnSelectAsset}
        creatable
        onlyCreateImages
      />
    </Drawer>
  );
};

DetailDrawer.defaultProps = DETAIL_DRAWER_DEFAULT_PROPS;
DetailDrawer.propTypes = DETAIL_DRAWER_PROP_TYPES;

// eslint-disable-next-line import/prefer-default-export
export { DetailDrawer };
