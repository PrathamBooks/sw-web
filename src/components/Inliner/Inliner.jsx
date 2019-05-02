import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Inliner.scss';

class Inliner extends Component {
  static defaultProps = {
    width: 'm'
  }

  render() {
    const baseClassName = 'pb-inliner';
    const classNames = [baseClassName];

    const {
      children,
      width,
      isChildInput
    } = this.props;

    classNames.push(`${baseClassName}--w-${width}`);

    if (isChildInput) {
      classNames.push(`${baseClassName}--is-child-input`);
    }

    return (
      <div className={classNames.join(' ')}>
        {children}
      </div>
    );
  }
}

Inliner.propTypes = {
  children: PropTypes.node,
  isChildInput: PropTypes.bool,
  /* Default size is m */
  size: PropTypes.oneOf([
    'xxxs',
    'xxs',
    'xs',
    's',
    'm',
    'l',
    'xl',
    'xxl'
  ])
};

export default Inliner;
