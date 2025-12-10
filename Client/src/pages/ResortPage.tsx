import React from 'react';
import { useParams } from 'react-router-dom';
import ResortPageView from '../jsx/pages/ResortPageView';

type ResortRouteParams = {
  resortSlug?: string;
};

export default function ResortPage(): React.ReactElement {
  const { resortSlug = '' } = useParams<ResortRouteParams>();
  return <ResortPageView resortSlug={resortSlug} />;
}
