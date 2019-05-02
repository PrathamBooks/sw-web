import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Stuffer.scss';

class Stuffer extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-stuffer';
    const classNames = [baseClassName];

    const {
      children,
      parentClassName,
      horizontalSpacing,
      verticalSpacing
    } = this.props;

    if (horizontalSpacing) {
      classNames.push(`${baseClassName}--h-${horizontalSpacing}`);
    }

    if (verticalSpacing) {
      classNames.push(`${baseClassName}--v-${verticalSpacing}`);
    }

    if (parentClassName) {
      classNames.push(parentClassName);
    }

    return (
      <div className={classNames.join(' ')}>
        {children}
      </div>
    );
  }
}

Stuffer.propTypes = {
  children: PropTypes.node.isRequired,
  parentClassName: PropTypes.string,
  horizontalSpacing: PropTypes.oneOf(['m', 'l', 'xl']),
  verticalSpacing: PropTypes.oneOf(['m', 'l', 'xl'])
};

export default Stuffer;
