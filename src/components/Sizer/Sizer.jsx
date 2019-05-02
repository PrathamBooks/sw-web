import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './Sizer.scss';

class Sizer extends Component {

  render() {
    const baseClassName = 'pb-sizer';
    const {
      parentClassName,
      children,
      width,
      height,
      maxHeight,
      maxWidth,
      scrollX,
      scrollY
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--height-${height}`]: height,
      [`${baseClassName}--width-${width}`]: width,
      [`${baseClassName}--max-height-${maxHeight}`]: maxHeight,
      [`${baseClassName}--max-width-${maxWidth}`]: maxWidth,
      [`${baseClassName}--scroll-x`]: scrollX,
      [`${baseClassName}--scroll-y`]: scrollY,
      [parentClassName]: parentClassName,
    };

    return (
      <div className={classNames(classes)}>
        {children}
      </div>
    );
  }
}

const availableSizes =  [
  'xxxs',
  'xxs',
  'xs',
  's',
  'm',
  'l',
  'xl',
  'xxl',
  'xxxl',
];

Sizer.propTypes = {
  parentClassName: PropTypes.string,
  children: PropTypes.node,
  height: PropTypes.oneOf(availableSizes),
  maxHeight: PropTypes.oneOf(availableSizes),
  maxWidth: PropTypes.oneOf(availableSizes),
  scrollX: PropTypes.bool,
  scrollY: PropTypes.bool,
  width: PropTypes.oneOf(availableSizes),
};

export default Sizer;
