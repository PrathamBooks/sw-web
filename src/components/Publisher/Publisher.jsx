import React from 'react';
import { translate } from 'react-polyglot';
import Link from '../Link';

import './Publisher.scss';

function toDashCase(str) {
  return str.replace(/_/g, '-');
}

const Publisher = ({ publisher, t, offline , status , publishedDate, updatedDate ,  createdDate , showUpdatedOnDate }) => {
  const {
    slug,
    name,
    logo,
  } = publisher;
const baseClassName = 'pb-publisher';

  // When the story is published by StoryWeaver Community then the slug will be null.
  let publisherLogo;
  let publisherName;
  let date = publishedDate || updatedDate || createdDate;
  let imageTag = <img
                  className={`${baseClassName}__publisher-logo`}
                  src={logo} 
                  alt={`${t("global.logo-of")} ${name}`}
                  disabled={offline}
                  />
  if (slug) {
    publisherLogo = <Link isInternal href={`/publishers/${slug}`}>
                     {imageTag}
                    </Link>
    publisherName = status && showUpdatedOnDate && date
                    ?
                    <p>{t(`global.${toDashCase(status)}-by`)} <Link isInternal disabled={offline} href={`/publishers/${slug}`}> {name} </Link> {t(`global.${toDashCase(status)}-on`)} {date}</p>
                    :
                    <p>{t(`global.published-by`)} <Link isInternal disabled={offline} href={`/publishers/${slug}`}> {name} </Link></p>
  } else {
    publisherLogo = imageTag
    publisherName = status && showUpdatedOnDate && date
                    ?
                    <p> {t(`global.${toDashCase(status)}-by`)} {name} {t(`global.${toDashCase(status)}-on`)} {date} </p>
                    :
                    <p> {t(`global.published-by`)} {name} </p>
  }
  return (
    <div className={`${baseClassName}`}>
      {publisherLogo}
      {publisherName}
    </div>
    );
};

export default translate()(Publisher);
