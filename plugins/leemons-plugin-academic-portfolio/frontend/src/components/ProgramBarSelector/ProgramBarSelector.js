import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { HeaderDropdown } from '@bubbles-ui/leemons';

import { useStore } from '@common';
import _, { find, isNil, map, noop } from 'lodash';
import { getSessionConfig, updateSessionConfig } from '@users/session';
import { getUserProgramsRequest } from '@academic-portfolio/request';
import { useProgramBarSelectorStyles } from './ProgramBarSelector.styles';

export function ProgramBarSelector({ onChange = noop, children }) {
  const { classes } = useProgramBarSelectorStyles();
  const [store, render] = useStore({
    loading: true,
  });

  async function selectProgram(program) {
    store.selectedProgram = find(store.programs, { id: program.id });
    if (isNil(store.selectedProgram)) {
      [store.selectedProgram] = store.programs;
    }
    await updateSessionConfig({ program: store.selectedProgram.id });
    onChange(store.selectedProgram);
    render();
  }

  // ·································································
  // FIRST LOAD

  async function init() {
    const { programs } = await getUserProgramsRequest();
    store.programs = _.map(programs, (program) => ({
      ...program,
      imageUrl: leemons.apiUrl + program.imageUrl,
    }));

    store.programsSelect = map(store.programs, (program) => ({
      id: program.id,
      color: program.color,
      image: !isNil(program.image?.cover) ? program.imageUrl : undefined,
      label: program.name,
      icon: program.icon,
    }));

    try {
      if (store.programs.length > 0) {
        const sessionConfig = getSessionConfig();
        if (sessionConfig.program) {
          await selectProgram({ id: sessionConfig.program });
        } else {
          await selectProgram(store.programs[0]);
        }
      }
    } catch (e) {
      //
    }

    store.loading = false;
    render();
  }

  React.useEffect(() => {
    init();
  }, []);

  return (
    <Box className={classes.root}>
      <Box style={{ maxWidth: 320, flex: 'none' }}>
        <HeaderDropdown
          value={store.selectedProgram}
          data={store.programsSelect}
          withSearchInput={false}
          readOnly={store.programsSelect?.length <= 1}
          onChange={selectProgram}
        />
      </Box>
      {children}
    </Box>
  );
}

ProgramBarSelector.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
};

export default ProgramBarSelector;
