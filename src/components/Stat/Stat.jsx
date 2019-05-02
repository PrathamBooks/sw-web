import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Link from '../Link';
import SvgIcon from '../SvgIcon';

import './Stat.scss';

class Stat extends Component {
  static defaultProps = {
    iconVariant: 'default',
    size: 'm'
  }

  render() {
    const baseClassName = 'pb-stat';

    const {
      icon,
      value,
      label,
      size,
      align,
      iconVariant,
      parentClassName
    } = this.props;

    let iconEl;
    if (icon) {
      iconEl = <SvgIcon parentClassName={`${baseClassName}__icon`} name={icon} size={size} variant={iconVariant} />
    }

    let stateEl;
    if (value || value === 0) {
      stateEl = <span className={`${baseClassName}__value`}>{value}</span>
    }

    let labelEl;
    if (label) {
      labelEl = <span className={`${baseClassName}__label`}>{label}</span>
    }

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--align-${align}`]: align,
      [`${baseClassName}--${size}`]: size,
      [`${baseClassName}--icon-${iconVariant}`]: iconVariant,
      [parentClassName]: parentClassName,
    }

    return (
      <div className={classNames(classes)}>
        {
          this.props.onClick
          ?
          <Link parentClassName="pb-stat__link" onClick={this.props.onClick}>{iconEl}{stateEl}{labelEl}</Link>
          :
          <span>{iconEl}{stateEl}{labelEl}</span>
        }
      </div>
    );
  }
}

Stat.propTypes = {
  parentClassName: PropTypes.string,
  icon: PropTypes.string,
  value: PropTypes.number.isRequired,
  label: PropTypes.string,
  onClick: PropTypes.func,
  iconVariant: SvgIcon.propTypes.variant,
  size: PropTypes.oneOf([
    's',
    'm',
    'l'
  ]),
  align: PropTypes.oneOf([
    'left',
    'center'
  ])
};

export default Stat;
