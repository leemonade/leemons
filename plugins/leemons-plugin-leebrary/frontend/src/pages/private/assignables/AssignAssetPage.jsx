import AssignAsset from '@leebrary/components/AssignAsset/AssignAsset';
import React from 'react';
import { useParams } from 'react-router-dom';

export default function AssignAssetPage() {
  const { id } = useParams();
  return <AssignAsset id={id} />;
}
