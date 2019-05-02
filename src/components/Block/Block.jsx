import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Block.scss';

class Block extends Component {
  static defaultProps = {
    noHorizontalPadding: false,
    noVerticalPadding: false,
    background: 'default'
  }

  render() {
    const baseClassName = 'pb-block';
    const {
      background,
      noHorizontalPadding,
      noVerticalPadding
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--bg-${background}`]: true,
      [`${baseClassName}--no-horizontal-padding`]: noHorizontalPadding,
      [`${baseClassName}--no-vertical-padding`]: noVerticalPadding,
    };

    return (
      <div className={classNames(classes)}>
        {this.props.children}
      </div>
    );
  }
}

Block.propTypes = {
  children: PropTypes.node,
  noHorizontalPadding: PropTypes.bool,
  noVerticalPadding: PropTypes.bool,
  background: PropTypes.oneOf(['default', 'transparent'])
};

export default Block;
