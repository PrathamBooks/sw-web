import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';

import {getLargestImage, getSmallestImage, generateSrcSet} from '../../lib/images';

import './Img.scss';

class Img extends Component {
  log = (...params) => {
    if (this.props.debug) {
      console.log('<Img>', ...params);
    }
  }

  aspectRatio = (width, height) => {
    return width / height;
  }

  isLandscape = (width, height) => {
    return width > height;
  }

  getSrcSetSizes = (aspectRatio) => {
    const { sizes } = this.props;

    if (sizes == null) {
      return;
    }

    const srcset = [];
    Object.keys(sizes).forEach(s => {
      let unit = 'vw';
      let width = sizes[s];
      if (sizes[s].value && sizes[s].unit) {
        width = sizes[s].value;
        unit = sizes[s].unit;
      }

      if (aspectRatio) {
        width = Math.ceil(width * aspectRatio);
      }

      let viewportSize = '';
      if (s !== 'default') {
        viewportSize = `${s} `;
      }

      srcset.push(`${viewportSize}${width}${unit}`);
    });

    return srcset.join(', ');
  }

  cropCoordsWithRespectToCrop = (cropCoords, aspectRatio, imageWidth, imageHeight) => {
    const destCropCoords = {
      x: 0,
      y: 0
    }

    let pseudoDestHeight = 0;
    let pseudoDestWidth = 0;

    const isLandscape = this.isLandscape(imageWidth, imageHeight);
    if (isLandscape) {
      pseudoDestHeight = imageHeight;
      pseudoDestWidth = pseudoDestHeight * aspectRatio;
    } else {
      pseudoDestWidth = imageWidth;
      pseudoDestHeight = pseudoDestWidth / aspectRatio;
    }

    if (cropCoords.x && cropCoords.x > 0) {
      const xAdjust = imageWidth * cropCoords.x;
      destCropCoords.x = xAdjust / pseudoDestWidth;
    }

    if (cropCoords.y && cropCoords.y > 0) {
      const yAdjust = imageHeight * cropCoords.y;
      destCropCoords.y = yAdjust / pseudoDestHeight;
    }

    return destCropCoords;
  }

  render() {
    const baseClassName = 'pb-img';
    const classNames = [baseClassName];

    const {
      parentClassName,
      alt,
      image,
      lazyLoad,
      useNativeAspectRatio,
      onLoad,
      noSrcSet
    } = this.props;

    if (!image.sizes || image.sizes.length === 0) {
      return null;
    }

    const srcSet = generateSrcSet(image.sizes);
    this.log(srcSet);

    let srcUrl;
    let fallbackImage;
    if (noSrcSet) {
      fallbackImage = getLargestImage(image.sizes);
    } else {
      fallbackImage = getSmallestImage(image.sizes);
    }

    let isImgLandscape = false;
    let imageAspectRatio = 1;
    if (fallbackImage) {
      srcUrl = fallbackImage.url;
      isImgLandscape = this.isLandscape(fallbackImage.width, fallbackImage.height);
      imageAspectRatio = this.aspectRatio(fallbackImage.width, fallbackImage.height);
    }
    this.log("srcUrl", srcUrl);
    this.log("isImgLandscape", isImgLandscape);
    this.log("imageAspectRatio", imageAspectRatio);

    let destAspectRatio = 1;
    let xAdjust = 0;
    let yAdjust = 0;

    if (useNativeAspectRatio) {
      // Overide aspect ratio from object
      destAspectRatio = imageAspectRatio;
    } else if (image && image.aspectRatio) {
      destAspectRatio = image.aspectRatio;
    }
    this.log('destAspectRatio', destAspectRatio);

    const isDestLandscape = destAspectRatio > 1;
    this.log('isDestLandscape', isDestLandscape);

    if (image && image.cropCoords) {
      const {x, y} = this.cropCoordsWithRespectToCrop(image.cropCoords,
                                                      destAspectRatio,
                                                      fallbackImage.width,
                                                      fallbackImage.height);
      xAdjust = x;
      yAdjust = y;
    }

    const paddingTop = (1 / destAspectRatio) * 100;

    let imgSizing;
    const imagesStyles = {
      top: 0,
      left: 0
    };

    // I know these if-elses looks scary.
    // Feel free to re-write a less scary one.
    if (useNativeAspectRatio) {
      imagesStyles.width = '100%';
      imgSizing = this.getSrcSetSizes();
    } else {
      if (isDestLandscape) {
        if (isImgLandscape && imageAspectRatio >= destAspectRatio) {
          imagesStyles.height = '100%';
          imgSizing = this.getSrcSetSizes(imageAspectRatio);
        } else {
          imagesStyles.width = '100%';
          imgSizing = this.getSrcSetSizes();
        }
      } else {
        if (!isImgLandscape && imageAspectRatio < destAspectRatio) {
          imagesStyles.width = '100%';
          imgSizing = this.getSrcSetSizes();
        } else {
          imagesStyles.height = '100%';
          imgSizing = this.getSrcSetSizes(imageAspectRatio);
        }
      }

      if (xAdjust) {
        imagesStyles.left = `-${xAdjust * 100}%`
      }

      if (yAdjust) {
        imagesStyles.top = `-${yAdjust * 100}%`
      }
    }

    const imageEl = <img
                      className={`${baseClassName}__img`}
                      src={srcUrl}
                      srcSet={noSrcSet ? null : srcSet}
                      sizes={noSrcSet ? null : imgSizing}
                      style={imagesStyles}
                      alt={alt}
                      onLoad={onLoad}/>;

    if (parentClassName) {
      classNames.push(parentClassName);
    }

    return (
      <div className={classNames.join(' ')}>
        <div className={`${baseClassName}__wrapper`} style={{paddingTop: `${paddingTop}%`}}>
          {
            !noSrcSet && lazyLoad
            ?
            <LazyLoad offset={250} once>{imageEl}</LazyLoad>
            :
            imageEl
          }
        </div>
      </div>
    );
  }
}

Img.propTypes = {
  image: PropTypes.object.isRequired,
  parentClassName: PropTypes.string,
  alt: PropTypes.string,
  sizes: PropTypes.object, // Refer to the defaultProps for the shape
  lazyLoad: PropTypes.bool,
  useNativeAspectRatio: PropTypes.bool,
  onLoad: PropTypes.func,
  debug: PropTypes.bool,
  noSrcSet: PropTypes.bool
};

export default Img;
