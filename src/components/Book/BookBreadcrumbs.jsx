import React from 'react';
import Breadcrumb from '../Breadcrumb';
import { links } from '../../lib/constants';


export default ({ offline, t }) => {
  let breadcrumbPath = [{
    title: t('global.home'),
    href: links.home(),
    isInternal: true
  }, {
    title: t('global.story', 2),
    href: links.allBooks(),
    isInternal: true
  }];

  if (offline) {
    breadcrumbPath = [{
      title: t('global.offline-library'),
      href: links.offlineBooks(),
      isInternal: true
    }];
  }

  return <Breadcrumb paths={breadcrumbPath} />
};
