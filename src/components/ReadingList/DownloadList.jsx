import React from 'react';
import { translate } from 'react-polyglot';

import Link from '../Link';
import SvgIcon from '../SvgIcon';
import AuthDropdown from '../AuthDropdown';

import { links } from '../../lib/constants';

const DownloadList = ({ isLoggedIn, t, slug, openAuthModal, onClick }) => {
  
  if (!isLoggedIn) {
    return (
            <AuthDropdown
              t={t}
              openAuthModal={openAuthModal}
              toggleEl = {<Link><SvgIcon name="download" size="m" pushRight/>{t('global.download', 1)}</Link>}
              loginText = {t('DownloadsDropdown.please-log-in')}
            />
          );
  } else {
    return (
      <Link 
        href={links.downloadList(slug)}
        shouldOpenNewPage 
        onClick={onClick}>
        <SvgIcon name="download" size="m" pushRight/>{t('global.download', 1)}
      </Link>
    );
  }

}

export default translate()(DownloadList);
