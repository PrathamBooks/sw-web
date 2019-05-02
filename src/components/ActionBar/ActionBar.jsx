import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './ActionBar.scss';

export class ActionBarSection extends Component {
  render() {
    const baseClassName = 'pb-action-bar__section';
    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--force-align-right`]: this.props.forceAlignRight
    };

    return (<div className={classNames(classes)}>{this.props.children}</div>);
  }
}

ActionBarSection.propTypes = {
  children: PropTypes.node,
  forceAlignRight: PropTypes.bool
};

class ActionBar extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-action-bar';

    const {
      children,
      parentClassName,
      noTopBorder,
      noBottomBorder,
      noSectionSeparators,
      asymmetric,
      disabled
    } = this.props;

    const allowedChildren = React.Children.toArray(children);
    const columns = allowedChildren.length;
    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName,
      [`${baseClassName}--2up`]: columns === 2,
      [`${baseClassName}--3up`]: columns > 2,
      [`${baseClassName}--no-top-border`]: noTopBorder,
      [`${baseClassName}--no-bottom-border`]: noBottomBorder,
      [`${baseClassName}--no-section-separators`]: noSectionSeparators,
      [`${baseClassName}--asymmetric`]: asymmetric,
      [`${baseClassName}--disabled`]: disabled
    }

    return (
      <div className={classNames(classes)}>
        {allowedChildren}
      </div>
    );
  }
}

ActionBar.propTypes = {
  children: (props, propName, componentName) => {
    const prop = props[propName];
    const areAllPropsSections = React.Children
      .toArray(prop)
      .reduce((acc, child) => acc && child.type === ActionBarSection, true);

    if (!areAllPropsSections) {
      throw new Error(`All children of ${componentName} should be instances of ActionBarSection.`);
    }
  },
  parentClassName: PropTypes.string,
  noTopBorder: PropTypes.bool,
  noBottomBorder: PropTypes.bool,
  asymmetric: PropTypes.bool,
  disabled: PropTypes.bool,
  noSectionSeparators: PropTypes.bool
};

export default ActionBar;
