import React from 'react';
import { translate } from 'react-polyglot';

import Link from '../Link';
import Dropdown from '../Dropdown';
import SvgIcon from '../SvgIcon';
import List from '../List';
import Loader from '../Loader';
import LoginDropdown from '../LoginDropdown';

const DownloadsDropdown = ({
  downloadLinks,
  isLoggedIn,
  isFetchingIllustrationDownloadLimit,
  t,
  openAuthModal,
  userEmail,
  slug,
  recordIllustrationDownload,
  onOpenModal,
  downloadLimitReached,
  onIllustrationDownload,
  baseClassName }) => {
  let listEl = null;
  
  if (!isLoggedIn) {
    listEl = (
      <LoginDropdown
        LoginText={t('illustrationDownloadsDropdown.please-log-in')} onClickLogin={ openAuthModal }
      />
    );
  }
  else {
    const items = downloadLinks.map((downloadLink, i) => {
      return (
        (<Link fullWidth
          key={`download-link.${i}`}
          onClick={() => {
            recordIllustrationDownload({slug, userEmail, resolution: downloadLink.type})
            onIllustrationDownload(downloadLink.href)
          }} >
          {downloadLink.type}
        </Link>)
      );
    });
    
    listEl = <List nowrap>{items}</List>;
  }

  const linkEl =  <Link>
                    {
                      isFetchingIllustrationDownloadLimit
                      ?
                      <Loader size="m" parentClassName={`${baseClassName}__loader-icon`}/>
                      : 
                      <SvgIcon name={"download"} size="m" pushRight/>
                    }
                    {t('global.download', 1)}
                  </Link>

  return (
    <Dropdown
      toggleEl = { linkEl }
    >
      {listEl}
    </Dropdown>
  );
};

export default translate()(DownloadsDropdown);
