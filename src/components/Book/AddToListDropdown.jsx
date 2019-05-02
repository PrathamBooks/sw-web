import React from 'react';
import { translate } from 'react-polyglot';

import Link from '../Link';
import Dropdown from '../Dropdown';
import SvgIcon from '../SvgIcon';
import List from '../List';
import Loader from '../Loader';
import Checkbox from '../Checkbox';

import { links } from '../../lib/constants';


const getisAddingOrRemovingFromList = (bookSlug, listSlug, isAddingOrRemovingFromList) => {
  if (!isAddingOrRemovingFromList[bookSlug]) {
    return false;
  }

  return isAddingOrRemovingFromList[bookSlug].includes(listSlug);
};

const getIsAddedToList = (listMemberships, listSlug) => {
  return listMemberships.find(lm => lm.slug === listSlug);
};

const onToggleListMembership = (listMemberships, bookSlug, listSlug, onAddToList, onRemoveFromList) => {
  if (getIsAddedToList(listMemberships, listSlug)) {
    onRemoveFromList(bookSlug, listSlug);
  } else {
    onAddToList(bookSlug, listSlug);
  }
};


const AddToListDropdown = (props) => {
  const {
    slug,
    isLoggedIn,
    isFetchingUserLists,
    isAddingOrRemovingFromList,
    lists,
    onAddToList,
    onRemoveFromList,
    listMemberships,
    // onCreateList,
    t
  } = props;

  let items;

  if (isFetchingUserLists && isLoggedIn) {
    items = <span><Loader size="m" /> {t('global.loading')}</span>;
  } else if (!isFetchingUserLists && isLoggedIn) {
    items = lists.map((list, i) => (
        <Checkbox
          id={`book--add-to-list-dropdown--checkbox--${slug}`}
          key={i}
          label={list.title}
          onChange={() => onToggleListMembership(listMemberships, slug, list.slug, onAddToList, onRemoveFromList)}
          loading={getisAddingOrRemovingFromList(slug, list.slug, isAddingOrRemovingFromList)}
          checked={!!getIsAddedToList(listMemberships, list.slug)} />
    ));

    // items.push(
    //   <Link leftIcon="plus-circle" onClick={onCreateList} key="create-and-add">
    //     {t('ReadingList.create-and-add')} <SvgIcon name="plus-circle" />
    //   </Link>
    // );
  } else {
    items = (
      <Link fullWidth legend={t('Book.please-log-in')} href={links.login()}>
        <SvgIcon name="user"/> {t('global.log-in')}
      </Link>
    );
  }

  return (
    <Dropdown
      toggleEl={<Link><SvgIcon name="plus-circle" size="m" pushRight/>{t('global.add-to-my-bookshelf')}</Link>}
      minWidth="l"
      align="left"
    >
      <List nowrap>{items}</List>
    </Dropdown>
  );
};

export default translate()(AddToListDropdown);
