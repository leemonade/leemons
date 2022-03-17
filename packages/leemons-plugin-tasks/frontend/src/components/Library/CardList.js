import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Loader, Text } from '@bubbles-ui/components';
import Card from './Card';

export default function CardList({ data, loading, refresh }) {
  if (loading && !data?.length) {
    return <Loader />;
  }

  if (!data.length) {
    return <Text>No tasks were found</Text>;
  }
  return (
    <Stack spacing={3} wrap="wrap">
      {data?.map((item) => (
        <Card key={item.id} {...item} refresh={refresh} />
      ))}
    </Stack>
  );
}

CardList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      cover: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      tagline: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
    })
  ),
  loading: PropTypes.bool.isRequired,
  refresh: PropTypes.func.isRequired,
};
