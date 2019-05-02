import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { getUiConfig } from '../lib/ui.js';

import './Caret.scss';

class Caret extends Component {
  static defaultProps = {
    direction: 'down'
  }

  render() {
    const baseClassName = 'pb-caret';
    const classNames = [baseClassName];

    if (this.props.direction) {
      classNames.push(`${baseClassName}--${this.props.direction}`);
    }

    if (this.props.parentClassName) {
      classNames.push(this.props.parentClassName);
    }

    return (
      <span className={classNames.join(' ')}></span>
    );
  }
}

Caret.propTypes = {
  direction: PropTypes.oneOf(['down', 'up', 'left', 'right']),
  parentClassName: PropTypes.string
};

export default Caret;
