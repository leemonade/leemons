import { useEffect, useCallback, useRef } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  ContextContainer,
  Select,
  Stack,
  Switch,
  TotalLayoutContainer,
  TotalLayoutFooterContainer,
  TotalLayoutHeader,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { ZoneWidgets } from '@widgets/ZoneWidgets';
import { isUndefined } from 'lodash';

import { PLUGIN_NAME } from '@emails/config/constants';
import prefixPN from '@emails/helpers/prefixPN';
import { useSaveConfig } from '@emails/hooks/mutations/useSaveConfig';
import { useConfig } from '@emails/hooks/queries/useConfig';

function HeaderIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.93107 0.540679C1.24859 0.613129 0.707938 1.0989 0.563092 1.76977C0.533122 1.90857 0.53125 2.17814 0.53125 6.35425V10.7912L0.571948 10.951C0.69892 11.4494 1.0335 11.8393 1.4999 12.0324C1.79192 12.1533 1.72341 12.1502 4.19002 12.1502C5.79009 12.1502 6.4321 12.1445 6.48093 12.1299C6.59045 12.0971 6.71551 11.9904 6.77354 11.8802C6.82117 11.7897 6.825 11.7689 6.81824 11.6372C6.81228 11.5213 6.80184 11.4792 6.7646 11.4212C6.71468 11.3436 6.64698 11.2772 6.56125 11.222C6.50882 11.1883 6.4415 11.187 4.23925 11.1778C2.65629 11.1712 1.95462 11.1624 1.91621 11.1485C1.76722 11.0949 1.64003 10.9823 1.56364 10.8362L1.52125 10.7552L1.51661 6.49259C1.51288 3.07148 1.51643 2.23261 1.53461 2.24341C1.54706 2.25082 2.73175 3.16018 4.16725 4.26423C5.60275 5.36826 6.84205 6.31517 6.92125 6.36847C7.19301 6.55131 7.49381 6.67902 7.84825 6.762C8.08052 6.8164 8.55551 6.83836 8.82138 6.807C9.30726 6.74971 9.7497 6.5701 10.167 6.26081C10.2593 6.19243 11.4767 5.25801 12.8723 4.18437C14.268 3.1107 15.4135 2.23225 15.4178 2.23225C15.4222 2.23225 15.4279 3.30751 15.4305 4.62175L15.4352 7.01125L15.4742 7.08325C15.5207 7.16905 15.627 7.2736 15.7142 7.31923C15.8131 7.37094 16.0229 7.3657 16.1344 7.30872C16.2363 7.25666 16.3179 7.16979 16.3652 7.06276C16.3978 6.98911 16.3988 6.89576 16.3937 4.37985L16.3885 1.77325L16.3463 1.64725C16.1558 1.07881 15.7528 0.704767 15.177 0.561919C15.0669 0.534631 14.5317 0.532003 8.55925 0.529555C4.98535 0.528079 2.00266 0.533083 1.93107 0.540679ZM2.2329 1.53739C2.28278 1.58497 7.33953 5.46876 7.44797 5.54277C7.59935 5.64609 7.80447 5.73735 8.00811 5.79194C8.15828 5.83219 8.21828 5.83842 8.46025 5.83893C8.68878 5.83939 8.76792 5.83234 8.89778 5.79996C9.11275 5.74637 9.2928 5.66877 9.46199 5.55685C9.58152 5.47777 14.6286 1.60833 14.7056 1.53676C14.7278 1.51608 13.754 1.51225 8.46925 1.51225C3.10795 1.51225 2.21033 1.51586 2.2329 1.53739ZM12.4528 6.94053C12.0137 7.01996 11.5994 7.34475 11.4202 7.74995C11.3966 7.8033 11.2989 8.1044 11.2031 8.4191C11.1074 8.73378 11.0179 9.00822 11.0044 9.02898C10.9734 9.07633 10.9048 9.10825 10.8339 9.10825C10.8039 9.10825 10.5309 9.04973 10.2273 8.9782L9.67525 8.84815L9.40525 8.84833C9.15687 8.84849 9.12371 8.8525 8.99125 8.89849C8.59671 9.03547 8.33682 9.25632 8.14435 9.61813C8.02872 9.8355 7.98849 10.004 7.98887 10.2692C7.98923 10.5194 8.02683 10.6917 8.12615 10.8981C8.20994 11.0724 8.27937 11.1581 8.73043 11.6446C8.94319 11.874 9.12812 12.0875 9.14141 12.1189C9.18819 12.2297 9.15631 12.2777 8.73572 12.73C8.25964 13.242 8.22292 13.2878 8.12484 13.4912C8.02483 13.6987 7.98789 13.8694 7.98851 14.1212C7.99031 14.8521 8.52172 15.4415 9.26575 15.5378C9.46821 15.564 9.59893 15.5448 10.2739 15.3892C10.601 15.3139 10.8527 15.2645 10.8776 15.2707C10.9011 15.2766 10.9419 15.2984 10.9681 15.319C11.0186 15.3587 11.0272 15.3831 11.2676 16.1732C11.3903 16.5763 11.477 16.7705 11.6049 16.9286C11.7962 17.165 12.0867 17.3525 12.3736 17.4245C12.5697 17.4737 12.8836 17.4736 13.0789 17.4243C13.4604 17.3278 13.819 17.0437 13.9937 16.6995C14.033 16.622 14.1337 16.3285 14.2384 15.9863C14.3363 15.6664 14.4296 15.3846 14.4457 15.36C14.4618 15.3354 14.5043 15.303 14.54 15.2881C14.6026 15.2619 14.6256 15.2658 15.2001 15.3999C15.8824 15.5591 16.0389 15.5772 16.2917 15.5261C16.6873 15.4461 17.0088 15.2315 17.2259 14.9025C17.408 14.6266 17.4707 14.392 17.4554 14.043C17.4451 13.8066 17.4139 13.6743 17.3256 13.4912C17.2392 13.3124 17.1747 13.2324 16.7303 12.7536C16.513 12.5195 16.3255 12.3061 16.3136 12.2796C16.2858 12.2176 16.2857 12.1517 16.3134 12.102C16.3254 12.0805 16.5094 11.8749 16.7222 11.6453C17.1631 11.1695 17.2392 11.0753 17.3246 10.8992C17.4291 10.6836 17.4507 10.5739 17.4506 10.2602C17.4505 9.99403 17.448 9.97405 17.3947 9.82413C17.2294 9.35926 16.893 9.0383 16.4163 8.89055C16.3036 8.85565 16.241 8.84865 16.0382 8.84829C15.7976 8.84788 15.7897 8.84919 15.206 8.98668C14.6663 9.11377 14.6111 9.1236 14.5507 9.10335C14.5144 9.0912 14.4697 9.061 14.4515 9.03625C14.4332 9.0115 14.3367 8.72395 14.2371 8.39725C14.0277 7.71082 13.9734 7.59123 13.7758 7.38048C13.4255 7.00691 12.9534 6.84995 12.4528 6.94053ZM12.5372 7.93645C12.4461 7.97875 12.3506 8.07289 12.3164 8.15425C12.3019 8.1889 12.2134 8.46835 12.1198 8.77525C12.0263 9.08215 11.9255 9.38251 11.896 9.44272C11.6943 9.85379 11.207 10.1312 10.7557 10.0918C10.6862 10.0858 10.3669 10.0199 10.0463 9.94552C9.72569 9.87112 9.44048 9.81025 9.41249 9.81025C9.33005 9.81025 9.16949 9.87931 9.10733 9.94152C9.07562 9.97327 9.02941 10.0427 9.00466 10.0959C8.96675 10.1773 8.9611 10.2105 8.96884 10.3069C8.97491 10.3824 8.99249 10.4453 9.02064 10.492C9.04408 10.5309 9.24145 10.7547 9.45925 10.9894C9.8897 11.4532 9.94997 11.5276 10.0287 11.6929C10.1932 12.038 10.1598 12.5059 9.94734 12.8321C9.9047 12.8976 9.68283 13.1525 9.4543 13.3984C9.22579 13.6443 9.02464 13.8751 9.00732 13.9114C8.96666 13.9964 8.95509 14.1373 8.98086 14.2331C9.02916 14.4125 9.22131 14.5622 9.40307 14.5622C9.45444 14.5622 9.75663 14.5021 10.0805 14.4274C10.5894 14.31 10.6875 14.2924 10.837 14.2924C11.0457 14.2922 11.1756 14.3233 11.3751 14.4209C11.5725 14.5176 11.7879 14.7261 11.8839 14.9132C11.9219 14.9874 12.0204 15.2763 12.1233 15.6152C12.2194 15.932 12.3127 16.2196 12.3305 16.2542C12.3963 16.382 12.5259 16.4671 12.6788 16.4827C12.8607 16.5014 13.0378 16.4088 13.1163 16.2541C13.1388 16.2096 13.235 15.9183 13.3299 15.6067C13.4341 15.2647 13.5285 14.9901 13.5681 14.9137C13.6489 14.7578 13.8563 14.5458 14.0222 14.4492C14.2191 14.3346 14.3555 14.301 14.6163 14.3027C14.8306 14.3042 14.8672 14.3104 15.3903 14.4348C15.7018 14.509 15.9791 14.5654 16.0314 14.5653C16.3717 14.565 16.5903 14.2013 16.4301 13.9018C16.4076 13.8598 16.211 13.6338 15.9932 13.3996C15.5833 12.9588 15.5082 12.8677 15.4326 12.72C15.2801 12.4222 15.2818 11.9671 15.4366 11.6616C15.5087 11.5194 15.5709 11.4444 15.9992 10.9838C16.2137 10.753 16.4076 10.5301 16.4301 10.4883C16.5889 10.193 16.3751 9.82706 16.0418 9.82371C15.9737 9.82303 15.7516 9.8674 15.3812 9.95562C14.8408 10.0844 14.8162 10.0885 14.5983 10.0882C14.3986 10.0878 14.3581 10.0822 14.2385 10.0386C14.0442 9.96775 13.9252 9.89145 13.7701 9.73825C13.5771 9.54774 13.5336 9.45298 13.3281 8.77478C13.2322 8.45823 13.139 8.17012 13.121 8.13454C13.0814 8.05599 12.9817 7.9657 12.8944 7.92921C12.8045 7.89163 12.626 7.89525 12.5372 7.93645ZM12.4861 10.6571C11.8412 10.7654 11.3309 11.2547 11.2025 11.8883C11.1627 12.0849 11.1778 12.449 11.2333 12.6272C11.4596 13.3551 12.1374 13.8112 12.8787 13.7343C13.5817 13.6614 14.1499 13.1263 14.2581 12.4352C14.2836 12.2727 14.2683 11.9475 14.2284 11.7992C14.1879 11.6493 14.0743 11.4124 13.9785 11.2781C13.6533 10.8223 13.0349 10.565 12.4861 10.6571ZM12.6309 11.6308C12.4544 11.6567 12.2755 11.7936 12.2012 11.9595C12.1443 12.0867 12.1432 12.3031 12.1989 12.4245C12.2905 12.6243 12.5059 12.7622 12.7262 12.7622C13.0805 12.7622 13.3523 12.4348 13.2844 12.0899C13.2233 11.7791 12.9463 11.5845 12.6309 11.6308Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Preferences() {
  const [t] = useTranslateLoader(prefixPN('preferences'));
  const history = useHistory();
  const scrollRef = useRef();

  // ----------------------------------------------------------------------
  // SETTINGS

  const form = useForm();
  const { watch, reset, control, getValues, setValue } = form;

  const disableEmail = watch('disable-all-activity-emails');
  const newAssignations = watch('new-assignation-email');

  const { data: configs } = useConfig();
  const { mutate: saveConfig, isLoading: isSaving } = useSaveConfig();

  function setConfigValues(configs) {
    if (!configs) return;

    reset(configs);
  }

  useEffect(() => {
    setConfigValues(configs);
  }, [configs]);

  function handleOnSave() {
    const values = getValues();
    saveConfig(values);
  }

  const widgets = useCallback(
    ({ Component, key, properties }) => <Component {...properties} key={key} form={form} />,
    [form]
  );

  return (
    <Box style={{ height: '100vh', overflow: 'hidden' }}>
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader
            title={t('pageTitle')}
            onCancel={() => history.goBack()}
            icon={<HeaderIcon />}
            mainActionLabel={t('cancel')}
          />
        }
      >
        <Stack
          ref={scrollRef}
          justifyContent="center"
          style={{
            overflow: 'auto',
            position: 'relative',
          }}
        >
          <TotalLayoutStepContainer
            Footer={
              <TotalLayoutFooterContainer
                fixed
                scrollRef={scrollRef}
                rightZone={
                  <Button onClick={handleOnSave} loading={isSaving}>
                    {t('savePreferences')}
                  </Button>
                }
              />
            }
          >
            <FormProvider {...form}>
              <Box mb={20}>
                <ContextContainer title={t('assignments')}>
                  <Controller
                    control={control}
                    name="disable-all-activity-emails"
                    render={({ field }) => (
                      <Switch
                        {...field}
                        label={t('disableAllActivityEmails')}
                        checked={field.value}
                        onChange={(e) => {
                          reset({
                            'disable-all-activity-emails': e,
                            'week-resume-email': false,
                            'new-assignation-email': false,
                            'new-assignation-timeout-email': false,
                            'new-assignation-per-day-email': false,
                          });
                        }}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="new-assignation-email"
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        disabled={disableEmail}
                        label={t('newAssignationEmail')}
                        help={t('newAssignationEmailDescription')}
                        helpPosition="bottom"
                        checked={field.value}
                        onChange={(e) => {
                          if (!e) {
                            setValue('new-assignation-per-day-email', false);
                          }
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="week-resume-email"
                    render={({ field }) => (
                      <>
                        <Checkbox
                          {...field}
                          disabled={disableEmail}
                          label={t('weekResumeEmail')}
                          help={t('weekResumeEmailDescription')}
                          helpPosition="bottom"
                          checked={!isUndefined(field.value) && field.value !== false}
                          onChange={(e) => {
                            field.onChange(e ? 1 : false);
                          }}
                        />
                        {field.value ? (
                          <Box
                            sx={(theme) => ({
                              marginLeft: theme.spacing[8],
                              marginTop: -theme.spacing[4],
                              marginBottom: theme.spacing[6],
                              width: 125,
                            })}
                          >
                            <Select
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                              value={field.value}
                              data={[
                                { label: t('sunday'), value: 0 },
                                { label: t('monday'), value: 1 },
                                { label: t('tuesday'), value: 2 },
                                { label: t('wednesday'), value: 3 },
                                { label: t('thursday'), value: 4 },
                                { label: t('friday'), value: 5 },
                                { label: t('saturday'), value: 6 },
                              ]}
                            />
                          </Box>
                        ) : null}
                      </>
                    )}
                  />
                </ContextContainer>
                <ContextContainer title={t('advancedConfig')} level={1}>
                  <Alert closeable={false} severity="warning" title={t('alertTitle')}>
                    {t('alertDescription')}
                  </Alert>
                  <Controller
                    control={control}
                    name="new-assignation-per-day-email"
                    render={({ field }) => (
                      <>
                        <Checkbox
                          {...field}
                          disabled={disableEmail || !newAssignations}
                          label={t('newAssignationDaysEmail')}
                          help={t('newAssignationDaysEmailDescription')}
                          helpPosition="bottom"
                          checked={!isUndefined(field.value) && field.value !== false}
                          onChange={(e) => {
                            field.onChange(e ? 10 : false);
                          }}
                        />
                        {field.value ? (
                          <Box
                            sx={(theme) => ({
                              marginLeft: theme.spacing[8],
                              marginTop: -theme.spacing[4],
                              width: 125,
                            })}
                          >
                            <Select
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                              value={field.value}
                              data={[
                                { label: t('ndays', { n: 10 }), value: 10 },
                                { label: t('ndays', { n: 7 }), value: 7 },
                                { label: t('ndays', { n: 5 }), value: 5 },
                                { label: t('ndays', { n: 2 }), value: 2 },
                              ]}
                            />
                          </Box>
                        ) : null}
                      </>
                    )}
                  />
                  <Controller
                    control={control}
                    name="new-assignation-timeout-email"
                    render={({ field }) => (
                      <>
                        <Checkbox
                          {...field}
                          disabled={disableEmail}
                          label={t('emailLastHour')}
                          help={t('emailLastHourDescription')}
                          helpPosition="bottom"
                          checked={!isUndefined(field.value) && field.value !== false}
                          onChange={(e) => {
                            field.onChange(e ? 72 : false);
                          }}
                        />
                        {field.value ? (
                          <Box
                            sx={(theme) => ({
                              marginLeft: theme.spacing[8],
                              marginTop: -theme.spacing[4],
                              marginBottom: theme.spacing[6],
                              width: 125,
                            })}
                          >
                            <Select
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                              value={field.value}
                              data={[
                                { label: t('nhours', { n: 72 }), value: 72 },
                                { label: t('nhours', { n: 48 }), value: 48 },
                                { label: t('nhours', { n: 24 }), value: 24 },
                              ]}
                            />
                          </Box>
                        ) : null}
                      </>
                    )}
                  />
                </ContextContainer>
              </Box>
              <ZoneWidgets zone={`${PLUGIN_NAME}.preferences`}>{widgets}</ZoneWidgets>
            </FormProvider>
          </TotalLayoutStepContainer>
        </Stack>
      </TotalLayoutContainer>
    </Box>
  );
}
