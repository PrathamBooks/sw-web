import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './MenuContentWrapper.scss';

class MenuContentWrapper extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-menu-wrapper';
    const {
      children,
      matchLeftIcon,
      title
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--match-left-icon`]: matchLeftIcon,
    };

    return (
      <div className={classNames(classes)}>
        {
          title
          ?
          <h3 className={`${baseClassName}__title`}>{title}</h3>
          :
          null
        }
        {children}
      </div>
    );
  }
}

MenuContentWrapper.propTypes = {
  children: PropTypes.node,
  matchLeftIcon: PropTypes.bool,
  title: PropTypes.string
};

export default MenuContentWrapper;
