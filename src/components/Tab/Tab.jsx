import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Tab.scss';

class Tab extends Component {
  static defaultProps = {
    shouldUnloadContent: false
  }
  
  render() {
    const baseClassName = 'pb-tab';
    const classNames = [baseClassName];
    const { noPadding, active, shouldUnloadContent } = this.props;

    if (noPadding) {
      classNames.push(`${baseClassName}--no-padding`);
    }

    if (active) {
      classNames.push(`${baseClassName}--active`);
    }

    return (
      <div className={classNames.join(' ')}>
        {
          !active && shouldUnloadContent
          ?
          null
          :
          this.props.children
        }
      </div>
    )
  }
}

Tab.propTypes = {
  title: PropTypes.string.isRequired,
  noPadding: PropTypes.bool,
  active: PropTypes.bool,
  shouldUnloadContent: PropTypes.bool
};

export default Tab;
