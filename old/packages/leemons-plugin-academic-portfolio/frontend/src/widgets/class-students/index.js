/* eslint-disable no-nested-ternary */
import { Box, Title, UserDisplayItem } from '@bubbles-ui/components';
import { getLocalizations } from '@multilanguage/useTranslate';
import UserDetailModal from '@users/components/UserDetailModal';
import { getZoneRequest, ZoneWidgets } from '@widgets';
import PropTypes from 'prop-types';
import React from 'react';

const zoneKey = 'plugins.academic-portfolio.class.students';
function ClassStudentsWidget({ classe, session, label: _label, widgetsLength }) {
  const [openedStudent, setOpenedStudent] = React.useState();
  const [label, setLabel] = React.useState();
  const [zone, setZone] = React.useState();

  function openStudent(student) {
    setOpenedStudent(student);
  }

  function closeStudent() {
    setOpenedStudent(null);
  }

  async function getLabel() {
    const { items } = await getLocalizations({ keys: [_label] });
    setLabel(items[_label]);
  }

  async function load() {
    const data = await getZoneRequest(zoneKey);
    setZone(data.zone);
  }

  const widgets = React.useCallback(
    ({ Component, key, properties }) => (
      <Component {...properties} key={key} classe={classe} session={session} />
    ),
    [classe, session]
  );

  React.useEffect(() => {
    load();
  }, []);

  React.useEffect(() => {
    if (_label) getLabel();
  }, [_label]);

  return (
    <>
      {widgetsLength === 1 && label ? (
        <Box
          sx={(theme) => ({
            display: 'flex',
            paddingBottom: theme.spacing[4],
            alignItems: 'center',
            justifyContent: 'space-between',
          })}
        >
          <Title order={4}>{label}</Title>
          {zone?.widgetItems.length === 1 ? (
            <ZoneWidgets zone={zoneKey}>{widgets}</ZoneWidgets>
          ) : null}
        </Box>
      ) : null}
      {zone?.widgetItems.length > 1 || widgetsLength > 1 ? (
        <ZoneWidgets zone={zoneKey}>{widgets}</ZoneWidgets>
      ) : null}
      <UserDetailModal
        opened={!!openedStudent}
        userAgent={openedStudent?.id}
        onClose={closeStudent}
      />
      {classe?.students.map((student) => (
        <UserDisplayItem
          style={{ cursor: 'pointer' }}
          onClick={() => openStudent(student)}
          key={student.id}
          {...student.user}
          variant="inline"
          noBreak={true}
        />
      ))}
    </>
  );
}

ClassStudentsWidget.propTypes = {
  classe: PropTypes.object.isRequired,
  label: PropTypes.string,
  widgetsLength: PropTypes.number,
  session: PropTypes.any,
};

export default ClassStudentsWidget;
