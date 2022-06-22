import React from 'react';
import { Box, Button, createStyles, DrawerPush, Text } from '@bubbles-ui/components';

const useStyles = createStyles((theme, { collapsed = false } = {}) => {
  const sidebarWidth = 369;

  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
    },
    sidebar: {
      background: 'red',
      width: sidebarWidth,
      height: '100vh',
      position: 'fixed',
      top: 0,
      // transition: 'width 0.3s ease-in-out',
    },
    content: {
      background: 'blue',
      height: '400vh',

      width: '100%',
      // marginLeft: sidebarWidth,
    },
  };
});

export default function ScoresPage() {
  const [collapsed, setCollapsed] = React.useState(false);

  const { classes } = useStyles({ collapsed });
  return (
    <Box className={classes.root}>
      <DrawerPush opened={!collapsed} size={369}>
        <Box className={classes.sidebar}>
          <Text>Sidebar</Text>
        </Box>
      </DrawerPush>

      <Box className={classes.content}>
        <Button onClick={() => setCollapsed((c) => !c)}>Collapse</Button>
        <Text>Content</Text>
      </Box>
    </Box>
  );
}
