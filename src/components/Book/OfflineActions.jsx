import React from 'react';

import List from '../List';
import Link from '../Link';
import SvgIcon from '../SvgIcon';
import Dropdown from '../Dropdown'
import Loader from '../Loader';
import LoginDropdown from '../LoginDropdown';

import { links } from '../../lib/constants';

const OfflineActions = ({ availableOffline, isLoggedIn, onClickAddToOffline, onClickRemoveFromOffline, disabled, isSavingOffline, t, openAuthModal }) => {
  if (disabled) {
    return (
      <Dropdown
        toggleEl={<Link><SvgIcon name="offline" size="m" pushRight/>{t('Book.add-to-offline')}</Link>}
        minWidth="l"
        align="left"
      >
        <List nowrap>
          <Link fullWidth legend={t('Book.please-upgrade-browser-add-story-to-offline')} 
            onClick={process.env.REACT_APP_FEATURE_AUTH ? openAuthModal : () => window.location.href = links.login()}>
            <SvgIcon name="user"/> {t('global.upgrade-browser')}
          </Link>
        </List>
      </Dropdown>
    )
  } else {
    if (isLoggedIn) {
      return (
        <List inline>
          <Link
            onClick={availableOffline ? onClickRemoveFromOffline : onClickAddToOffline}
            theme={availableOffline ? 'danger' : null}
            disabled={isSavingOffline}
          >
            {
              isSavingOffline
              ?
              <Loader />
              :
              <SvgIcon name={availableOffline ? 'bin' : 'offline'}/>
            }
            {' '}
            {availableOffline ? t('Book.remove-from-offline') : t('Book.add-to-offline')}
          </Link>
        </List>
      )
    } else {
      if (availableOffline) {
        return (
          <List inline>
            <Link
              onClick={onClickRemoveFromOffline}
              theme="danger"
            >
              <SvgIcon name="bin" /> {t('Book.remove-from-offline')}
            </Link>
          </List>
        )
      } else {
        return (
          <Dropdown
            toggleEl={<Link><SvgIcon name="offline" size="m" pushRight/>{t('Book.add-to-offline')}</Link>}
            minWidth="l"
            align="left"
          >
            <List nowrap>
              <LoginDropdown LoginText={t('Book.please-log-in-add-story-to-offline')} onClickLogin={ openAuthModal } />
            </List>
          </Dropdown>
        )
      }
    }
  }
};

export default OfflineActions;
