import React from 'react';
import { useParams } from 'react-router-dom';
import StateOverviewPageView from '../jsx/pages/StateOverviewPageView';

type StateRouteParams = {
  stateCode?: string;
};

export default function StateOverviewPage(): React.ReactElement {
  const { stateCode = 'CO' } = useParams<StateRouteParams>();
  return <StateOverviewPageView stateCode={stateCode} />;
}
