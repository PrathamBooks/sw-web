import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';

import List from '../List';
import ShareMenu from '../ShareMenu';
import Link from '../Link';
import SvgIcon from '../SvgIcon';
import Dropdown from '../Dropdown';
import Loader from '../Loader';

// import AddToListDropdown from './AddToListDropdown';
import AddToMyLibraryLink from './AddToMyLibraryLink';
import DownloadsDropdown from './DownloadsDropdown';
import AuthDropdown from '../AuthDropdown';

import { roles as availableRoles } from '../../lib/constants';

const EditorsPicksToggle = (props) => {
  const {
    isEditorsPick,
    onRemoveFromEditorsPicks,
    onAddToEditorsPicks,
    isAddingToOrRemovingFromEditorsPicks,
    slug,
    t
  } = props;

  if (isEditorsPick) {
    return (
      <Link fullWidth onClick={() => onRemoveFromEditorsPicks(slug)}>
        { isAddingToOrRemovingFromEditorsPicks ? <Loader size="m" /> : <SvgIcon name="bin" />}
        {' '}
        {t('Book.remove-from-editors-picks')}
      </Link>
    );
  } else {
    return (
      <Link fullWidth onClick={() => onAddToEditorsPicks(slug)}>
        { isAddingToOrRemovingFromEditorsPicks ? <Loader size="m" /> : <SvgIcon name="plus-circle" />}
        {' '}
        {t('Book.add-to-editors-picks')}
      </Link>
    );
  }
};

const BookActions = (props) => {
  const {
    t,
    title,
    downloadLinks,
    isFetchingMe,
    isFetchingBookDownloadLimit,
    isFetchingUserLists,
    userLists,
    viewport,
    onAddToList,
    onRemoveFromList,
    slug,
    isLoggedIn,
    isAddingOrRemovingFromList,
    listMemberships,
    baseClassName,
    onOpenModal,
    onLastPageClicked,
    isEditable,
    onEdit,
    roles,
    isEditorsPick,
    onAddToEditorsPicks,
    onRemoveFromEditorsPicks,
    isAddingToOrRemovingFromEditorsPicks,
    addNotification,
    addSlimNotification,
    openAuthModal,
    onRelevelClicked,
    notifications,
    removeNotification,
    userEmail,
    level,
    status,
    language,
    recordGaEvents,
    isFlagged,
    authProps,
    recordBookDownload,
    recordBookDownloadPopUpOpened,
    onBookDownload,
    attributionLoading,
    isFetchingAssets,
    isDerivation,
    isRelevellingBook
  } = props;
  

  let flagAction = null;
  let flagText = (status !== "de_activated") ? t('global.flagged') : t('global.pulled-down');
  if (!isFlagged) {
     flagAction = <Link onClick = { !isFlagged && isLoggedIn ? () => onOpenModal('flag'): null }>
    <SvgIcon name="flag" size="m" pushRight/>
      {t("global.flag")}
  </Link>; 
  }
  else {
     flagAction =<div><SvgIcon
     name="flag-filled" 
     size="m"
     variant="accent"
     pushRight />
     {flagText}</div>
  }
 
  if ( !isLoggedIn && !isFlagged )
      flagAction = <AuthDropdown { ...authProps } toggleEl = { flagAction }
                    loginText = { t("global.please-log-in", {
                      action: t('global.flag'),
                      content_type: t('global.story',1)
                    }) } />;
  
  return (
    <List inline>
      {/*
      <AddToListDropdown
        isLoggedIn={isLoggedIn}
        slug={slug}
        isFetchingUserLists={isFetchingUserLists}
        isAddingOrRemovingFromList={isAddingOrRemovingFromList}
        lists={userLists}
        listMemberships={listMemberships}
        onAddToList={onAddToList}
        onCreateList={onCreateList}
        onRemoveFromList={onRemoveFromList}
      />
      */}
      <AddToMyLibraryLink
        isLoggedIn={isLoggedIn}
        slug={slug}
        isFetchingUserLists={isFetchingUserLists}
        isAddingOrRemovingFromList={isAddingOrRemovingFromList}
        lists={userLists}
        listMemberships={listMemberships}
        onAddToList={onAddToList}
        onRemoveFromList={onRemoveFromList}
        addNotification={addNotification}
        addSlimNotification={addSlimNotification}
        openAuthModal={openAuthModal}
        notifications={notifications}
        removeNotification={removeNotification}
        userEmail={userEmail}
        recordGaEvents={recordGaEvents}
      />
      <DownloadsDropdown
        slug={slug}
        level={level}
        language={language}
        userEmail={userEmail}
        isFetchingMe={isFetchingMe}
        downloadLinks={downloadLinks}
        isFetchingBookDownloadLimit={isFetchingBookDownloadLimit}
        isLoggedIn={isLoggedIn}
        onOpenModal={onOpenModal}
        openAuthModal={openAuthModal}
        recordBookDownload={recordBookDownload}
        recordBookDownloadPopUpOpened={recordBookDownloadPopUpOpened}
        onBookDownload={onBookDownload}
        baseClassName={baseClassName}
      />
      <ShareMenu title={title} href={window.location.href} />
      { flagAction }
      <Dropdown
        toggleEl={<Link><SvgIcon name="dots" /> {t("global.more")}</Link>}
        parentClassName={`${baseClassName}__extra-dropdown`}
        toggleClassName={`${baseClassName}__extra-dropdown-toggle`}>
        <List nowrap={viewport.medium}>
          {
            isEditable
            ?
            <Link fullWidth onClick={() => onEdit()}><SvgIcon name="pen" /> {t("global.edit")}</Link>
            :
            null
          }
          {
            roles && roles.includes(availableRoles.CONTENT_MANAGER)
            ?
            <EditorsPicksToggle
              isEditorsPick={isEditorsPick}
              onAddToEditorsPicks={onAddToEditorsPicks}
              onRemoveFromEditorsPicks={onRemoveFromEditorsPicks}
              isAddingToOrRemovingFromEditorsPicks={isAddingToOrRemovingFromEditorsPicks}
              t={t}
              slug={slug}
            />
            :
            null
          }
          <Link onClick={() => ((!isLoggedIn && process.env.REACT_APP_FEATURE_AUTH) ? openAuthModal() : onRelevelClicked(slug))} fullWidth><SvgIcon name="refresh" /> {t("Book.re-level")}</Link>
          <Link fullWidth legend={t('global.embed-legend')} onClick={() => onOpenModal('embed')}>
            <SvgIcon name="code" /> {t('global.embed')}
          </Link>
          <Link fullWidth onClick={() => onLastPageClicked()}>
            {
              isFetchingAssets && attributionLoading
                ?
                <Loader />
                :
                null
            }
            {t('global.view-attribution')}
          </Link>
          {
            roles && roles.includes(availableRoles.CONTENT_MANAGER) && !isDerivation && status !== "de_activated"
            ?
            <Link fullWidth onClick={() => onOpenModal('relevel')}>
              {
                isRelevellingBook && <Loader />
              }
              {t('Book.change-level')}
            </Link>
            :
            null
          }
         </List>
      </Dropdown>
    </List>
  );
};

BookActions.propTypes = {
  title: PropTypes.string.isRequired,
  downloadLinks: PropTypes.array.isRequired,
  isFetchingUserLists: PropTypes.bool,
  userLists: PropTypes.array.isRequired,
  onAddToList: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isAddingOrRemovingFromList: PropTypes.object.isRequired,
  listMemberships: PropTypes.array.isRequired,
  baseClassName: PropTypes.string.isRequired,
  onOpenModal: PropTypes.func.isRequired,
  isEditable: PropTypes.bool,
  onEdit: PropTypes.func,
  isFlagged: PropTypes.bool
};

export default translate()(BookActions);
