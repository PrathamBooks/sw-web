import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';

import Avatar from '../Avatar';
import Link from '../Link';
import { profileTypes } from '../../lib/constants';
import { links } from '../../lib/constants';

import './ProfileCard.scss';

const mapProfileTypeToSlug = {
  [profileTypes.ORGANISATION]: 'organisations',
  [profileTypes.PUBLISHER]: 'publishers',
  [profileTypes.USER]: 'users'
}

@translate()
class ProfileCard extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-profile-card';

    const {
      t,
      type,
      title,
      slug,
      imageUrl
    } = this.props;

    let typeLabel = t("global.user-profile", 1);
    if (type === profileTypes.ORGANISATION) {
      typeLabel = t("global.organisation", 1);
    } else if (type === profileTypes.PUBLISHER) {
      typeLabel = t("global.publisher", 1);
    }

    const classes = {
      [baseClassName]: true
    };

    return (
      <Link
        isInternal
        parentClassName={classNames(classes)}
        href={links.profile(mapProfileTypeToSlug[type], slug)}>
        <Avatar
          parentClassName={`${baseClassName}__avatar`}
          url={imageUrl} name={title}
          variant={type === profileTypes.USER ? 'circular' : 'default'}
          size="l" />
        <div className={`${baseClassName}__content`}>
          <h3 className={`${baseClassName}__title`}>{title}</h3>
          <h4 className={`${baseClassName}__type`}>{typeLabel}</h4>
        </div>
      </Link>
    );
  }
}

ProfileCard.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  imageUrl: PropTypes.string
};

export default ProfileCard;
