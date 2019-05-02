import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import Loader from '../Loader';

import './LoaderBlock.scss';

class LoaderBlock extends Component {
  static defaultProps = {}

  render() {
    
    const baseClassName = 'pb-loader-block';
    const classNames = [baseClassName];

    return (
      <div className={classNames.join(' ')}>
        <div className={`${baseClassName}__wrapper`}><Loader size="l" /></div>
      </div>
    );
  }
}

LoaderBlock.propTypes = {};

export default LoaderBlock;
