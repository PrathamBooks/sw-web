import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './Badge.scss';

class Badge extends Component {
  static defaultProps = {
    theme: 'default'
  }

  render() {
    const baseClassName = 'pb-badge';

    const {
      parentClassName,
      value,
      theme
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName,
      [`${baseClassName}--${theme}`]: theme
    };

    return (
      <span className={classNames(classes)}>{value}</span>
    );
  }
}

Badge.propTypes = {
  parentClassName: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  theme: PropTypes.string
};

export default Badge;
