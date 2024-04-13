import React from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'lodash';
import { ContextContainer, Stack, Badge } from '@bubbles-ui/components';
import { getUserAgentDetailForPageRequest } from '@users/request';

function UserAgentsTags({ title, userAgentIds }) {
  const [tags, setTags] = React.useState([]);

  // ····················································
  // INIT DATA LOADING

  async function init() {
    if (!userAgentIds?.length) return;

    const results = await Promise.all(
      userAgentIds.map((userAgentId) => getUserAgentDetailForPageRequest(userAgentId))
    );

    setTags(uniq(results.map((result) => result.data.tags).flat()));
  }

  React.useEffect(() => {
    init();
  }, [userAgentIds]);

  // ····················································
  // RENDER

  if (!tags.length) return null;

  return (
    <ContextContainer title={title}>
      <Stack spacing={3}>
        {tags.map((tag) => (
          <Badge key={tag} label={tag} radius="default" closable={false} />
        ))}
      </Stack>
    </ContextContainer>
  );
}

UserAgentsTags.propTypes = {
  title: PropTypes.string,
  userAgentIds: PropTypes.arrayOf(PropTypes.string),
};

export { UserAgentsTags };
