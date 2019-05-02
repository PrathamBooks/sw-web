import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Avatar.scss';

class Avatar extends Component {
  static defaultProps = {
    size: 'm',
    variant: 'default'
  }

  render() {
    const baseClassName = 'pb-avatar';

    const {
      url,
      name,
      size,
      variant,
      parentClassName
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName,
      [`${baseClassName}--${size}`]: size,
      [`${baseClassName}--${variant}`]: variant
    }

    return (
      <div className={classNames(classes)}>
        <img className={`${baseClassName}__image`} src={url} alt={name} />
      </div>
    );
  }
}

Avatar.propTypes = {
  parentClassName: PropTypes.string,
  url: PropTypes.string.isRequired,
  name: PropTypes.string,
  variant: PropTypes.oneOf([
    'default',
    'circular'
  ]),
  size: PropTypes.oneOf(['m', 'l'])
};

export default Avatar;
