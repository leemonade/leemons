import React from 'react';
import { Button, Text } from '@bubbles-ui/components';

export function renderAction({ t, classes, cx, replacers, replacer }) {
  const { action, value: cta } = replacer;
  return (
    <Button
      variant="link"
      onClick={action}
      className={cx(classes.text, classes.cta)}
      style={{ padding: 0 }}
    >
      <Text color="primary" className={cx(classes.text, classes.cta)}>
        {replacer.type === 'actionT' ? t(cta, replacers) : cta}
      </Text>
    </Button>
  );
}

export default renderAction;
