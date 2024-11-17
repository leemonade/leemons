import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { HeaderDropdown } from '@bubbles-ui/leemons';

import { useStore } from '@common';
import _, { find, isNil, map, noop, sortBy } from 'lodash';
import { getCentersWithToken, getSessionConfig, updateSessionConfig } from '@users/session';
import { getUserProgramsRequest, listProgramsRequest } from '@academic-portfolio/request';
import { useProgramBarSelectorStyles } from './ProgramBarSelector.styles';

function prepareImageUrl(url) {
  if (!url) {
    return null;
  }
  if (url.startsWith('http')) {
    return url;
  }
  return `${leemons.apiUrl}${url}`;
}

export function ProgramBarSelector({
  onChange = noop,
  isAdmin,
  children,
  clear,
  hideIcon = false,
  ...props
}) {
  const { classes } = useProgramBarSelectorStyles({}, { name: 'ProgramBarSelector' });
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
    let _programs = [];
    if (isAdmin) {
      const centers = getCentersWithToken();
      const response = await listProgramsRequest({ page: 0, size: 9999, center: centers[0]?.id });
      _programs = response.data?.items || [];
    } else {
      const { programs } = await getUserProgramsRequest();
      _programs = programs;
    }

    store.programs = _.map(_programs, (program) => ({
      ...program,
      imageUrl: prepareImageUrl(program.imageUrl),
    }));

    store.programsSelect = map(store.programs, (program) => ({
      id: program.id,
      color: program.color,
      image: !isNil(program.image?.cover) ? program.imageUrl : undefined,
      label: program.name,
      icon: program.icon,
      createdAt: program.createdAt,
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
  const programsSortedByCreation = sortBy(store.programsSelect, 'createdAt');

  React.useEffect(() => {
    init();
  }, []);

  if (clear) {
    return (
      <HeaderDropdown
        value={store.selectedProgram}
        data={store.programsSelect}
        withSearchInput={false}
        readOnly={store.programsSelect?.length <= 1}
        onChange={selectProgram}
        hideIcon={hideIcon}
        chevronSize={props.chevronSize}
        itemSelectedFontSize={props.itemSelectedFontSize}
        itemSelectedFontWeight={props.itemSelectedFontWeight}
      />
    );
  }

  return (
    <Box className={classes.root}>
      <Box style={{ maxWidth: 320, flex: 'none' }}>
        <HeaderDropdown
          value={store.selectedProgram}
          data={programsSortedByCreation}
          withSearchInput={false}
          readOnly={store.programsSelect?.length <= 1}
          onChange={selectProgram}
          hideIcon={hideIcon}
          chevronSize={props.chevronSize}
          itemSelectedFontSize={props.itemSelectedFontSize}
          itemSelectedFontWeight={props.itemSelectedFontWeight}
        />
      </Box>
      {children}
    </Box>
  );
}

ProgramBarSelector.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
  isAdmin: PropTypes.bool,
  clear: PropTypes.bool,
  hideIcon: PropTypes.bool,
  chevronSize: PropTypes.number,
  itemSelectedFontSize: PropTypes.number,
  itemSelectedFontWeight: PropTypes.number,
};

export default ProgramBarSelector;
