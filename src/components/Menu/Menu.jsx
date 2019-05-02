import React, { Component } from 'react';
import classNames from 'classnames';
// import PropTypes from 'prop-types';

import MenuDivider from '../MenuDivider';
import MenuLink from '../MenuLink';
import MenuContentWrapper from '../MenuContentWrapper';

import './Menu.scss';

class Menu extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-menu';
    const {
      children
    } = this.props;

    const classes = {
      [baseClassName]: true
    };

    return (
      <div className={classNames(classes)}>
        {children}
      </div>
    );
  }
}

Menu.propTypes = {
  children: (props, propName, componentName) => {
    const prop = props[propName];
    const areAllPropsSections = React.Children
      .toArray(prop)
      .reduce((acc, child) => acc && ((child.type === MenuLink) || (child.type === MenuDivider) || (child.type === MenuContentWrapper)), true);

    if (!areAllPropsSections) {
      throw new Error(`Children of ${componentName} should be instances of MenuLink or MenuDivider.`);
    }
  },
};

export default Menu;
