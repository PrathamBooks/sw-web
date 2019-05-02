import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '../SvgIcon';

import './Loader.scss';

class Loader extends Component {
  static defaultProps = {
    size: 'm'
  }

  render() {
    const baseClassName = 'pb-loader';
    const classNames = [baseClassName];
    const { size, parentClassName } = this.props;

    classNames.push(`${baseClassName}--${size}`);

    if (parentClassName) {
      classNames.push(parentClassName);
    }

    return (
      <div className={classNames.join(' ')}>
        <SvgIcon parentClassName={`${baseClassName}__icon`} size={size} name="loader" />
      </div>
    );
  }
}

Loader.propTypes = {
  parentClassName: PropTypes.string,
  /* Default size is m */
  size: PropTypes.oneOf([
    's',
    'm',
    'l',
    'xl'
  ])
};

export default Loader;
