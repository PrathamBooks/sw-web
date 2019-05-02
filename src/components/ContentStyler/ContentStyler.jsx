import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './ContentStyler.scss';

class ContentStyler extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-content-styler';

    const {
      theme
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--${theme}`]: theme
    };

    return (
      <div className={classNames(classes)}>
        {this.props.children}
      </div>
    );
  }
}

ContentStyler.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.string
};

export default ContentStyler;
