import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {getSmallestImage, generateSrcSet} from '../../lib/images';

import './ImgCanvas.scss';

class ImgCanvas extends Component {
  static defaultProps = {
    fit: 'auto'
  }

  render() {
    const baseClassName = 'pb-canvas';

    const {
      image,
      alt,
      parentClassName,
      fit
    } = this.props;

    if (image == null) {
      return null;
    }

    const smallestImage = getSmallestImage(image.sizes);
    const aspectRatio = smallestImage.width / smallestImage.height;
    const isLandscape = aspectRatio > 1;
    const srcSet = generateSrcSet(image.sizes);

    const classes = {
      [baseClassName]: true
    };

    const imgClasses = {
      [`${baseClassName}__img`]: true,
      [`${baseClassName}__img--fit-height`]: (fit === 'height') || ((fit === 'auto') && !isLandscape),
      [`${baseClassName}__img--fit-width`]: (fit === 'width') || ((fit === 'auto') && isLandscape),
      [parentClassName]: parentClassName,
    };
    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__wrapper`}>
          <img className={classNames(imgClasses)} src={smallestImage.url} srcSet={srcSet} alt={alt}/>
        </div>
      </div>
    );
  }
}

ImgCanvas.propTypes = {
  image: PropTypes.object.isRequired,
  alt: PropTypes.string,
  parentClassName: PropTypes.string,
  fit: PropTypes.oneOf([
    'auto',
    'width',
    'height'
  ])
};

export default ImgCanvas;
