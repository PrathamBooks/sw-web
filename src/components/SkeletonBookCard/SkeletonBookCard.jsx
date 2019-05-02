import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './SkeletonBookCard.scss';

class SkeletonBookCard extends Component {
  render() {
    const baseClassName = 'pb-skeleton-book-card';
    const {
      parentClassName
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName
    }

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__wrapper`}>
          <div className={`${baseClassName}__meta`}></div>
        </div>
      </div>
    );
  }
}

SkeletonBookCard.propTypes = {
  parentClassName: PropTypes.string
};

export default SkeletonBookCard;
