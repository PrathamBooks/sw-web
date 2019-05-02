import React, { Component } from 'react';
import classNames from 'classnames';
// import PropTypes from 'prop-types';

import './MenuDivider.scss';

class MenuDivider extends Component {
  render() {
    const baseClassName = 'pb-menu-divider';

    const classes = {
      [baseClassName]: true
    };

    return (
      <hr className={classNames(classes)} />
    );
  }
}

export default MenuDivider;
