import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Link from '../Link';
import Caret from '../Caret';

import './CollapsibleSection.scss';

class CollapsibleSection extends Component {
  constructor(props) {
    super(props);
    this.toggleOpen = this.toggleOpen.bind(this);

    this.state = {
      open: false
    };
  }

  toggleOpen() {
    if (!this.props.disableCollapse) {
      this.setState({
        open: !this.state.open
      });
    }
  }

  render() {
    const baseClassName = 'pb-collapsible-section';

    const {
      children,
      expandOnMediumViewport,
      expandOnLargeViewport,
      theme,
      title,
      disableCollapse,
      upperCaseTitle,
      parentClassName
} = this.props;

    let titleEl;

    if (title) {
      titleEl = <Link parentClassName={`${baseClassName}__title`} onClick={this.toggleOpen}>
        <Caret parentClassName={`${baseClassName}__caret`} direction={ this.state.open ? "down" : "right"} />
        {title}
      </Link>;
    }

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName,
      [`${baseClassName}--open`]: this.state.open,
      [`${baseClassName}--${theme}`]: theme,
      [`${baseClassName}--upper-case-title`]: upperCaseTitle,
      [`${baseClassName}--disable-collapse`]: disableCollapse,
      [`${baseClassName}--expand-on-medium-viewport`]: expandOnMediumViewport,
      [`${baseClassName}--expand-on-large-viewport`]: expandOnLargeViewport
    }

    return (
      <div className={classNames(classes)}>
        {titleEl}
        <div className={`${baseClassName}__content`}>{children}</div>
      </div>
    );
  }
}

CollapsibleSection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  theme: PropTypes.string,
  parentClassName: PropTypes.string,
  expandOnLargeViewport: PropTypes.bool,
  disableCollapse: PropTypes.bool
};

export default CollapsibleSection;
