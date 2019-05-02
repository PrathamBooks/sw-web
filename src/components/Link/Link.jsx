import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';

import './Link.scss';

// eslint-disable-next-line no-script-url
const noopStr = 'javascript:;';
const disableInternalLinks = (process.env.REACT_APP_MODE === 'bookends') || false;

class Link extends Component {
  static defaultProps = {
    isInternal: false,
    theme: 'default'
  }

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const {
      onClick,
      disabled
    } = this.props;

    if (disabled) {
      e.stopPropagation();
      e.preventDefault();
    } else {
      if (onClick) {
        onClick(e)
      }
    }
  }

  render() {
    const baseClassName = 'pb-link';
    let href = this.props.href;

    const {
      children,
      fullWidth,
      parentClassName,
      shouldOpenNewPage,
      theme,
      title,
      legend,
      disabled,
      normal,
      onClick,
      tabIndex
    } = this.props;

    let { isInternal } = this.props;

    if (disableInternalLinks || onClick) {
      isInternal = false;
    }

    if (!href) {
      href = noopStr;
    }

    let legendEl;
    if (legend) {
      legendEl = <span className={`${baseClassName}__legend`}>{legend}</span>;
    }

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--${theme}`]: theme,
      [`${baseClassName}--full-width`]: fullWidth,
      [`${baseClassName}--disabled`]: disabled,
      [`${baseClassName}--normal`]: normal,
      [parentClassName]: parentClassName
    };

    if (isInternal && !disabled) {
      return (
        <RouterLink
          to={href}
          className={classNames(classes)}
          title={title}
          tabIndex={tabIndex}
        >
          {children}
          {legendEl}
        </RouterLink>
      );
    } else if (shouldOpenNewPage) {
      return (
        <a
          href={href}
          className={classNames(classes)}
          title={title}
          target="_blank"
          onClick={this.handleClick}
          tabIndex={tabIndex}
        >
          {children}
          {legendEl}
        </a>
      )
    } else {
      return (
        <a
          href={href}
          className={classNames(classes)}
          title={title}
          onClick={this.handleClick}
          tabIndex={tabIndex}
        >
          {children}
          {legendEl}
        </a>
      );
    }
  }
}

Link.propTypes = {
  isInternal: PropTypes.bool,
  shouldOpenNewPage: PropTypes.bool,
  children: PropTypes.node.isRequired,
  parentClassName: PropTypes.string,
  /* Default theme is default */
  theme: PropTypes.oneOf([
    'default',
    'light',
    'info',
    'danger',
    'warning',
    'success',
    'dark'
  ]),
  title: PropTypes.string,
  fullWidth: PropTypes.bool,
  legend: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  tabIndex: PropTypes.string,
};

export default Link;
