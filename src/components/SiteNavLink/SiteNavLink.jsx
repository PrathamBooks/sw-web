import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Link from '../Link';
import Caret from '../Caret';

import './SiteNavLink.scss';

class SiteNavLink extends Component {
  static defaultProps = {
    variant: 'default',
    active: false,
    isInternal: false
  }

  render() {
    const {
      isInternal,
      variant,
      active,
      respondWidth,
      disabled,
      respondFontSize,
      truncateLongText,
      parentClassName,
      caret,
      href,
      onClick,
      children,
      title
    } = this.props;
    const baseClassName = 'pb-site-nav-link';

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName,
      [`${baseClassName}--${variant}`]: variant,
      [`${baseClassName}--active`]: active,
      [`${baseClassName}--respond-width`]: respondWidth,
      [`${baseClassName}--respond-font-size`]: respondFontSize,
      [`${baseClassName}--truncate-long-text`]: truncateLongText,
      [`${baseClassName}--caret`]: caret
    }

    let caretEl;
    if (caret) {
      caretEl = <Caret direction={caret} parentClassName={`${baseClassName}__caret`}/>
    }

    return (
      <Link
        isInternal={isInternal}
        parentClassName={classNames(classes)}
        disabled={disabled}
        onClick={onClick}
        title={title}
        href={href}><span className={`${baseClassName}__title`}>{children}</span>{caretEl}</Link>
    );
  }
}

SiteNavLink.propTypes = {
  children: PropTypes.node,
  parentClassName: PropTypes.string,
  href: PropTypes.string,
  active: PropTypes.bool,
  truncateLongText: PropTypes.bool,
  disabled: PropTypes.bool,
  respondWidth: PropTypes.bool,
  respondFontSize: PropTypes.bool,
  isInternal: PropTypes.bool,
  onClick: PropTypes.func,
  /* Default size is default */
  variant: PropTypes.oneOf([
    'default',
    'bordered'
  ]),
  caret: PropTypes.oneOf([
    'down',
    'top',
    'left',
    'right'
  ]),
  title: PropTypes.string
};

export default SiteNavLink;
