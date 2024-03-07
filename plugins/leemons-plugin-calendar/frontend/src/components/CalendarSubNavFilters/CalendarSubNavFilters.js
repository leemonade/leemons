/* eslint-disable import/prefer-default-export */
import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  ImageLoader,
  ProSwitch,
  SegmentedControl,
  Select,
  Text,
} from '@bubbles-ui/components';
import { SubNav } from '@bubbles-ui/extras';
import { PluginCalendarIcon } from '@bubbles-ui/icons/outline';
import { forEach } from 'lodash';
import {
  CALENDAR_SUB_NAV_FILTERS_DEFAULT_PROPS,
  CALENDAR_SUB_NAV_FILTERS_PROP_TYPES,
} from './CalendarSubNavFilters.constants';
import { CalendarSubNavFiltersStyles } from './CalendarSubNavFilters.styles';

const CalendarSubNavFilters = ({
  messages,
  onClose,
  value,
  onChange,
  pages,
  pageValue,
  pageOnChange,
  centers,
  centerValue,
  centerOnChange,
  showPageControl,
  mainColor,
  drawerColor,
  lightMode,
}) => {
  const { classes } = CalendarSubNavFiltersStyles(
    { mainColor, lightMode },
    { name: 'SubnavFilters' }
  );

  const [, setR] = useState();
  const ref = useRef({});

  function _onChange(sectionIndex, calendarIndex, checked) {
    const newValue = [...value];
    newValue[sectionIndex].calendars[calendarIndex].showEvents = checked;
    onChange(newValue);
  }

  async function checkIcons() {
    if (value) {
      forEach(value, ({ calendars }) => {
        forEach(calendars, (calendar) => {
          if (calendar.icon) {
            fetch(calendar.icon)
              .then((response) => {
                if (response.status >= 400) {
                  throw new Error('Bad response from server');
                }
                ref.current[calendar.icon] = true;
                setR(new Date().getTime() + Math.floor(Math.random() * 10000) + 1);
              })
              .catch(() => {
                ref.current[calendar.icon] = false;
                setR(new Date().getTime() + Math.floor(Math.random() * 10000) + 1);
              });
          }
        });
      });
    }
  }

  useEffect(() => {
    checkIcons();
  }, [JSON.stringify(value)]);

  return (
    <>
      <SubNav
        hideHeaderActions={true}
        item={{ label: '' }}
        style={{ position: 'static', boxShadow: 'none' }}
        className={classes.subNav}
        subItems={[]}
        width={'100%'}
        open={true}
        messages={messages}
        onClose={onClose}
        drawerColor={drawerColor}
        lightMode={lightMode}
      >
        <Box className={classes.titleContainer}>
          <PluginCalendarIcon className={classes.calendarIcon} />
          <Text className={classes.title}>{messages.title}</Text>
        </Box>
        <Box
          sx={(theme) => ({
            margin: theme.spacing[5],
            paddingBottom: '80px',
          })}
        >
          {showPageControl ? (
            <SegmentedControl
              data={pages}
              value={pageValue}
              onChange={pageOnChange}
              orientation={'vertical'}
              classNames={{
                root: classes.segmentRoot,
                label: classes.segmentLabel,
                active: classes.segmentActive,
                labelActive: classes.segmentLabelActive,
                control: classes.segmentControl,
              }}
            />
          ) : null}
          {centers && centers.length > 1 ? (
            <Box
              sx={(theme) => ({
                marginTop: theme.spacing[6],
              })}
            >
              <Text
                strong
                size="xs"
                sx={(theme) => ({ color: lightMode ? theme.colors.text05 : theme.colors.text08 })}
              >
                {messages.centers}
              </Text>
              <Box
                sx={(theme) => ({
                  marginTop: theme.spacing[5],
                })}
              >
                <Select data={centers} value={centerValue} onChange={centerOnChange} />
              </Box>
            </Box>
          ) : null}
          {value.map(({ calendars, sectionName }, sectionIndex) => (
            <Box
              sx={(theme) => ({
                marginTop: theme.spacing[6],
              })}
              key={`${sectionName}-${sectionIndex}`}
            >
              <Box>
                <Text
                  strong
                  size="xs"
                  sx={(theme) => ({ color: lightMode ? theme.colors.text05 : theme.colors.text08 })}
                >
                  {sectionName}
                </Text>
              </Box>
              <Box
                sx={(theme) => ({
                  marginTop: theme.spacing[5],
                })}
              >
                {calendars.map((calendar, calendarIndex) => (
                  <Box
                    sx={(theme) => ({
                      marginTop: theme.spacing[4],
                      marginBottom: theme.spacing[4],
                    })}
                    key={calendarIndex}
                  >
                    <ProSwitch
                      classNames={{
                        label: classes.switchLabel,
                      }}
                      label={calendar.name}
                      color={calendar.bgColor}
                      checked={calendar.showEvents}
                      icon={
                        calendar.icon && ref.current[calendar.icon] ? (
                          <Box className={classes.icon}>
                            <ImageLoader
                              height="12px"
                              imageStyles={{
                                width: 12,
                              }}
                              src={calendar.icon}
                              forceImage
                            />
                          </Box>
                        ) : null
                      }
                      onChange={(event) => _onChange(sectionIndex, calendarIndex, event)}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </SubNav>
    </>
  );
};

CalendarSubNavFilters.defaultProps = CALENDAR_SUB_NAV_FILTERS_DEFAULT_PROPS;
CalendarSubNavFilters.propTypes = CALENDAR_SUB_NAV_FILTERS_PROP_TYPES;

export { CalendarSubNavFilters };
