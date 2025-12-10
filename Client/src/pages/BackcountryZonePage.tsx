import React from 'react';
import { useParams } from 'react-router-dom';
import BackcountryZonePageView from '../jsx/pages/BackcountryZonePageView';

type BackcountryRouteParams = {
  zoneId?: string;
};

export default function BackcountryZonePage(): React.ReactElement {
  const { zoneId = '' } = useParams<BackcountryRouteParams>();
  return <BackcountryZonePageView zoneId={zoneId} />;
}
