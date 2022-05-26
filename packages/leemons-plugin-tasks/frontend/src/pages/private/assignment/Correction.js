import useAssignation from '@assignables/hooks/assignations/useAssignation';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Loader, Text } from '@bubbles-ui/components';
import Correction from '../../../components/Correction';

export default function CorrectionPage() {
  const { instance, student } = useParams();
  const [assignation, error, loading] = useAssignation(instance, student);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  return <Correction assignation={assignation} />;
}
