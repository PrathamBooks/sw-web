import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import SvgIcon from '../SvgIcon';
import Loader from '../Loader';

import './Button.scss';

// eslint-disable-next-line no-script-url
const noopStr = 'javascript:;';

class Button extends Component {
  static defaultProps = {
    variant: 'default',
    size: 'm'
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    if (this.props.disabled) {
      e.stopPropagation();
    } else {
      if (!this.props.loading && this.props.onClick) {
        this.props.onClick(e);
      }
    }
  }

  render() {
    const baseClassName = 'pb-button';

    const {
      label,
      parentClassName,
      iconLeft,
      iconRight,
      fullWidth,
      disabled,
      matchInputFields,
      loading,
      variant,
      inGroup,
      mergeTop,
      mergeBottom,
      mergeSides,
      size
    } = this.props;

    let leftIconEl;
    if (loading) {
      leftIconEl = <Loader size="m" parentClassName={`${baseClassName}__icon-left`} />
    } else if (iconLeft) {
      leftIconEl = <SvgIcon name={iconLeft} size="m" parentClassName={`${baseClassName}__icon-left`} />
    }

    let rightIconEl;
    if (iconRight) {
      rightIconEl = <SvgIcon name={iconRight} size="m" parentClassName={`${baseClassName}__icon-right`} />
    }

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName,
      [`${baseClassName}--${variant}`]: variant,
      [`${baseClassName}--size-${size}`]: size,
      [`${baseClassName}--disabled`]: disabled || loading,
      [`${baseClassName}--loading`]: loading,
      [`${baseClassName}--match-input-fields`]: matchInputFields,
      [`${baseClassName}--full-width`]: fullWidth,
      [`${baseClassName}--in-group-${inGroup}`]: inGroup,
      [`${baseClassName}--merge-top`]: mergeTop,
      [`${baseClassName}--merge-bottom`]: mergeBottom,
      [`${baseClassName}--merge-sides`]: mergeSides
    }

    return (
      <a className={classNames(classes)} href={noopStr} onClick={this.handleClick}>
        {leftIconEl}
        {label}
        {rightIconEl}
      </a>
    );
  }
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  parentClassName: PropTypes.string,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  fullWidth: PropTypes.bool,
  matchInputFields: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  inGroup: PropTypes.oneOf([
    'first',
    'last',
    'middle'
  ]),
  mergeTop: PropTypes.bool,
  mergeBottom: PropTypes.bool,
  mergeSides: PropTypes.bool,
  /* Default variant is default */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'info',
    'danger',
    'warning',
    'success',
    'facebook',
    'google'
  ]),
  /* Default size is m */
  size: PropTypes.oneOf([
    'm',
    's',
    'l',
    'xl'
  ])
};

export default Button;
