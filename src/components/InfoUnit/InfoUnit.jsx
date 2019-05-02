import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './InfoUnit.scss';

class InfoUnit extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-info-unit';
    const {
      label,
      children,
      noWrap
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--no-wrap`]: noWrap
    };

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__label`}>{label}</div>
        <div className={`${baseClassName}__content`}>{children}</div>
      </div>
    );
  }
}

InfoUnit.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  noWrap: PropTypes.bool
};

export default InfoUnit;
