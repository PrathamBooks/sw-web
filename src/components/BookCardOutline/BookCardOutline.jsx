import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Link from '../Link';
import SvgIcon from '../SvgIcon';

import './BookCardOutline.scss';

class BookCardOutline extends Component {
  render() {
    const baseClassName = 'pb-book-card-outline';
    const {
      parentClassName,
      href,
      icon,
      label,
      theme
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--theme-${theme}`]: theme,
      [parentClassName]: parentClassName
    };

    return (
      <div className={classNames(classes)}>
        <Link
          parentClassName={`${baseClassName}__wrapper`}
          href={href}>
          {
            icon
            ?
            <SvgIcon name={icon} size="l" />
            :
            null
          }
          {
            label
            ?
            <p>{label}</p>
            :
            null
          }
        </Link>
      </div>
    );
  }
}

BookCardOutline.propTypes = {
  parentClassName: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  href: PropTypes.string,
  theme: PropTypes.oneOf(['default', 'light']),
};

export default BookCardOutline;
