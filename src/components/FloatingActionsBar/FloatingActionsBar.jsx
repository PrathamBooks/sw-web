import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import DocumentClass from '../DocumentClass';

import './FloatingActionsBar.scss';

class FloatingActionsBar extends Component {
  static defaultProps = {
    float: true
  }

  render() {
    const baseClassName = 'pb-floating-actions-bar';
    const {
      parentClassName,
      children,
      float,
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--floating`]: float,
      [parentClassName]: parentClassName
    };

    return (
      <div className={classNames(classes)}>
        {
          float
          ?
          <DocumentClass className={`${baseClassName}-document--pad`} />
          :
          null
        }
        <div className={`${baseClassName}__container`}>{children}</div>
      </div>
    );
  }
}

FloatingActionsBar.propTypes = {
  parentClassName: PropTypes.string,
  float: PropTypes.bool,
  children: PropTypes.node
};

export default FloatingActionsBar;
