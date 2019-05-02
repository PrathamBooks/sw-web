import React from 'react';
import { translate } from 'react-polyglot';

import Link from '../Link';
import Dropdown from '../Dropdown';
import SvgIcon from '../SvgIcon';
import List from '../List';
import Loader from '../Loader';
import LoginDropdown from '../LoginDropdown';


const DownloadsDropdown = ({
  slug,
  level,
  language,
  userEmail,
  downloadLinks,
  isFetchingBookDownloadLimit,
  isLoggedIn,
  onOpenModal,
  t,
  openAuthModal,
  recordBookDownload,
  onBookDownload,
  baseClassName }) => {

  let listEl = null;
  
  if (!isLoggedIn) {
    listEl = <LoginDropdown LoginText={t('DownloadsDropdown.please-log-in')} 
                onClickLogin={() => openAuthModal()}
                />
  } else {
    const items = downloadLinks.map((downloadLink, i) => {
      if (downloadLink.href)
      {
        return (
          <Link fullWidth
            key={`download-link.${i}`}
            onClick={() => {
              recordBookDownload({slug, userEmail, level, language})
              onBookDownload(downloadLink.href)
            }}
          >
            {downloadLink.type}
          </Link>
          );
      }
      return null;
    });

    listEl = <List nowrap>{items}</List>;
  }

  const linkEl =  <Link>
                    {
                      isFetchingBookDownloadLimit
                      ?
                      <Loader size="m" parentClassName={`${baseClassName}__loader-icon`}/>
                      : 
                      <SvgIcon name={"download"} size="m" pushRight/>
                    }
                    {t('global.download', 1)}
                  </Link>

  return (
    <Dropdown
      toggleEl = {linkEl}
    >
      {listEl}
    </Dropdown>
  );
};

export default translate()(DownloadsDropdown);
