import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SvgSymbol from '../SvgSymbol';

import './SvgIcon.scss';

const baseClassName = 'pb-svg-icon';

class SvgIcon extends Component {
  static defaultProps = {}

  render() {
    const classNames = [baseClassName];

    if (this.props.size && this.props.size !== 'm') {
      classNames.push(`${baseClassName}--${this.props.size}`);
    }

    classNames.push(`${baseClassName}--type-${this.props.name}`);

    if (this.props.parentClassName) {
      classNames.push(this.props.parentClassName);
    }

    if (this.props.variant) {
      classNames.push(`${baseClassName}--${this.props.variant}`);
    }

    if (this.props.pushLeft) {
      classNames.push(`${baseClassName}--push-left`);
    }

    if (this.props.pushRight) {
      classNames.push(`${baseClassName}--push-right`);
    }

    return (
      <SvgSymbol name={this.props.name} parentClassName={classNames.join(' ')} />
    );
  }
}

SvgIcon.propTypes = {
  name: PropTypes.string,
  parentClassName: PropTypes.string,
  variant: PropTypes.oneOf([
    'default',
    'accent'
  ]),
  pushRight: PropTypes.bool,
  pushLeft: PropTypes.bool,

  /* Default size is m */
  size: PropTypes.oneOf([
    's',
    'm',
    'l',
    'xl',
    's-m',
    'm-l',
    'l-xl',
    'xl-xxl',
  ])
};

export default SvgIcon;
