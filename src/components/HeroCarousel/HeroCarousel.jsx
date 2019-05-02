import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Carousel from 'nuka-carousel';

import Img from '../Img';
import Link from '../Link';
import { CarouselPreviousButton, CarouselNextButton } from '../CarouselButton';

import './HeroCarousel.scss';

class HeroCarousel extends Component {
  static defaultProps = {
    autoplay: false,
    autoplayInterval: 5000
  }

  dispatchResize = () => {
    // Fix: Sometimes carousel render with zero height. It might be due to delay in
    // in the API call or delay in image loading. So, we forcing the carousel re-render
    // by dispatching a 'resize' event when the image is loaded
    window.dispatchEvent(new Event('resize'));
  }

  render() {
    const baseClassName = 'pb-hero-carousel';

    const {
      slides,
      autoplay,
      autoplayInterval,
      wrapAround
    } = this.props;

    let enabled;
    if (slides && slides.length > 0) {
      enabled = true;
    }

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--disabled`]: !enabled
    };

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__container`}>
          {
            enabled
            ?
            <Carousel
              renderCenterLeftControls={({ previousSlide }) => (
                  <CarouselPreviousButton onClick={previousSlide} />
              )}
              renderCenterRightControls={({ nextSlide }) => (
                  <CarouselNextButton onClick={nextSlide} />
              )}
              autoplay={autoplay}
              wrapAround={wrapAround}
              autoplayInterval={autoplayInterval}>
              {
                slides.map((slide, i) => {
                  let onImageLoad;
                  if (i === 0) {
                    onImageLoad = this.dispatchResize;
                  }

                  return <Link href={slide.pointToLink} key={i}><Img image={slide.imageUrls} onLoad={onImageLoad}/></Link>
                })
              }
            </Carousel>
            :
            null
          }
        </div>
      </div>
    );
  }
}

HeroCarousel.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.object),
  autoplay: PropTypes.bool,
  autoplayInterval: PropTypes.number,
  wrapAround: PropTypes.bool
};

export default HeroCarousel;
