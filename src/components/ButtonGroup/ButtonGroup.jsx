import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Columnizer from '../Columnizer';
import Button from '../Button';

import './ButtonGroup.scss';


class ButtonGroup extends Component {
  static defaultProps = {}

  renderButtons() {
    return React.Children
      .toArray(this.props.children)
      .map((child, i, childArr) => {
        let inGroup = 'middle';
        if (i === 0) {
          inGroup = 'first';
        } else if (i === childArr.length -1) {
          inGroup = 'last'
        }

        return React.cloneElement(child, {
          mergeTop: this.props.mergeTop,
          mergeBottom: this.props.mergeBottom,
          mergeSides: this.props.mergeSides,
          inGroup,
          fullWidth: true
        })
      });
  }

  render() {
    const baseClassName = 'pb-button-group';
    const classes = {
      [baseClassName]: true
    }

    return (
      <div className={classNames(classes)}>
        <Columnizer noGutter>
          {this.renderButtons()}
        </Columnizer>
      </div>
    );
  }
}

ButtonGroup.propTypes = {
  children: (props, propName, componentName) => {
    const prop = props[propName];
    const areAllPropsSections = React.Children
      .toArray(prop)
      .reduce((acc, child) => acc && child.type === Button, true);

    if (!areAllPropsSections) {
      throw new Error(`All children of ${componentName} should be instances of Button.`);
    }
  },
  mergeTop: PropTypes.bool,
  mergeBottom: PropTypes.bool,
  mergeSides: PropTypes.bool
};

export default ButtonGroup;
