import React from 'react';
import Link from '../Link';

import { arrayToI18nList } from '../../lib/textUtils.js';
import { links, linkType } from '../../lib/constants';


export default ({
  isTranslation,
  isRelevelled,
  authors,
  illustrators,
  photographers,
  originalTitle,
  originalSlug,
  originalAuthors,
  t,
  offline,
  onProfileLinkClicked
}) => {
  const makeProfileLinks = (collection, sectionClicked) =>
    collection.map((item, i) =>
      <Link
        isInternal={true}
        key={item.slug}
        disabled={offline}
        href={links.userProfile(item.slug)}
        onClick={() => {onProfileLinkClicked(item.slug, sectionClicked)}}>
        {item.name}
      </Link>
    );

  const authorLinks = makeProfileLinks(authors, (isTranslation ? linkType.translatedBy : linkType.writtenBy) );

  let mainAuthorsEl;
  if (isTranslation) {
    mainAuthorsEl = <p>{t('Book.translated-by')} {arrayToI18nList(authorLinks)}</p>
  } else if (isRelevelled) {
    mainAuthorsEl = <p>{t('Book.relevelled-by')} {arrayToI18nList(authorLinks)}</p>
  } else {
    mainAuthorsEl = <p>{t('Book.written-by')} {arrayToI18nList(authorLinks)}</p>
  }

  const illustratorLinks = makeProfileLinks(illustrators, linkType.illustratedBy);

  const illustratorEl = illustratorLinks.length > 0 ? (
    <p>
      {t('Book.illustrated-by')} {arrayToI18nList(illustratorLinks)}
    </p>
  ) : null;

  const photographerLinks = makeProfileLinks(photographers, linkType.photographedBy);
  const photographerEl = photographerLinks.length > 0 ? (
    <p>
      {t('Book.photograph-by')} {arrayToI18nList(photographerLinks)}
    </p>
  ) : null;

  let originalAuthorsEl = null;
  if (isTranslation || isRelevelled) {
    const originalAuthorsLinks = makeProfileLinks(originalAuthors, linkType.originalStory);
    originalAuthorsEl = (
      <p>
        {t('Book.original-story')} <Link isInternal={true} disabled={offline} href={links.bookDetails(originalSlug)}>{originalTitle}</Link> {t('global.by')} {arrayToI18nList(originalAuthorsLinks)}
      </p>
    );
  }

  return (
    <div>
      {mainAuthorsEl}
      {originalAuthorsEl}
      {illustratorEl}
      {photographerEl}
    </div>
  );
};
