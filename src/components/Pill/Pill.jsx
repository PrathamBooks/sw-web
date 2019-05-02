import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Link from '../Link';
import SvgIcon from '../SvgIcon';

import './Pill.scss';

class Pill extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-pill';

    const {
      label,
      onClose,
      icon,
      parentClassName,
      href,
      isInternal,
      isCategoryPill
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--dismissable`]: onClose,
      [`${baseClassName}--with-icon`]: icon,
      [`${baseClassName}--link`]: href,
      [`${baseClassName}--is-category-pill`]: isCategoryPill,
      [parentClassName]: parentClassName
    }

    const parentElements = {
      span: 'span',
      link: Link
    }

    const Parent = parentElements[href ? 'link' : 'span'];

    return (
      <Parent
        className={href ? null : classNames(classes)}
        parentClassName={href ? classNames(classes) : null}
        isInternal={isInternal}
        href={href}>
        {
          icon
          ?
          <SvgIcon parentClassName={`${baseClassName}__icon`} name={icon} size="s" />
          :
          null
        }
        <span className={`${baseClassName}__label`}>{label}</span>
        {
          !href && onClose
          ?
          (
            <Link parentClassName={`${baseClassName}__link`} onClick={onClose}>
              <SvgIcon name="close-circle" size="m" />
            </Link>
          )
          :
          null
        }
      </Parent>
    );
  }
}

Pill.propTypes = {
  label: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  icon: PropTypes.string,
  parentClassName: PropTypes.string,
  href: PropTypes.string,
  isInternal: PropTypes.bool,
  isCategoryPill: PropTypes.bool
};

export default Pill;
