import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import ContentStyler from '../ContentStyler';

import './Alert.scss';

class Alert extends Component {
  static defaultProps = {
    theme: 'info'
  }

  render() {
    const baseClassName = 'pb-alert';
    const {
      parentClassName,
      children,
      theme
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--theme-${theme}`]: theme,
      [parentClassName]: parentClassName
    };

    return (
      <div className={classNames(classes)}>
        <ContentStyler>
          {children}
        </ContentStyler>
      </div>
    );
  }
}

Alert.propTypes = {
  parentClassName: PropTypes.string,
  children: PropTypes.node,
  theme: PropTypes.oneOf([
    'info',
    'danger',
    'success',
    'warning',
  ])
};

export default Alert;
