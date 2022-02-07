import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Loader } from '@bubbles-ui/components';
import Card from './Card';

export default function CardList({ data, loading }) {
  if (loading) {
    return <Loader />;
  }
  return (
    <Stack spacing={3} wrap="wrap">
      {data.map((item) => (
        <Card key={item.id} {...item} />
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
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};
