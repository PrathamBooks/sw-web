import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Carousel from 'nuka-carousel';
import deepEqual from 'fast-deep-equal';

import Link from '../Link';
import SvgIcon from '../SvgIcon';

import './CardsCarousel.scss';

class CardsCarousel extends Component {
  static defaultProps = {
    cardsInFrame: {
      small: 2,
      medium: 3,
      large: 5,
      xxlarge: 6
    }
  }

  constructor(props) {
    super(props);

    // Reference: https://github.com/FormidableLabs/nuka-carousel/issues/16#issuecomment-165244283
    this.state = {
      carousels: {}
    };
  }

  componentDidMount() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
  }

  componentDidUpdate(prevProps) {
    if (!deepEqual(this.props.children, prevProps.children)) {
      window.dispatchEvent(new Event('resize'));
    }
  }

  setCarouselData(carousel) {
    var data = this.state.carousels;
    data[carousel] = this.refs[carousel];
    this.setState({
      carousels: data
    });
  }

  render() {
    const baseClassName = 'pb-cards-carousel';
    const {
      children,
      viewport,
      parentClassName,
      cardsInFrame,
      currentIndex,
      highlightCurrent,
      popoutControls
    } = this.props;

    let cards = 1;
    if (viewport.xxlarge && cardsInFrame.xxlarge) {
      cards = cardsInFrame.xxlarge;
    } else if (viewport.xlarge && cardsInFrame.xlarge) {
      cards = cardsInFrame.xlarge;
    } else if (viewport.large && cardsInFrame.large) {
      cards = cardsInFrame.large;
    } else if (viewport.medium && cardsInFrame.medium) {
      cards = cardsInFrame.medium;
    } else if (viewport.small && cardsInFrame.small) {
      cards = cardsInFrame.small;
    }

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--highlight-current`]: highlightCurrent,
      [`${baseClassName}--popout-controls`]: popoutControls,
      [parentClassName]: parentClassName
    };

    return (
      <div className={classNames(classes)}>
        <Carousel
          ref="carousel"
          data={this.setCarouselData.bind(this, 'carousel')}
          renderBottomCenterControls={null}
          renderCenterLeftControls={({ previousSlide, currentSlide }) => (
          <Link
            parentClassName={`${baseClassName}__link ${baseClassName}__link--previous`}
            onClick={previousSlide}
            disabled={currentSlide === 0}
            theme="dark"
          >
            <SvgIcon name="chevron-left" />
          </Link>
          )}
          renderCenterRightControls={({ nextSlide, currentSlide, slideCount }) => (
          <Link
            parentClassName={`${baseClassName}__link ${baseClassName}__link--next`}
            onClick={nextSlide}
            disabled={( slideCount === currentSlide + cards ) || ( slideCount <= cards )}
            theme="dark"
          >
            <SvgIcon name="chevron-right" />
          </Link>
          )}
          slidesToShow={cards}
          slidesToScroll="auto"
          slideIndex={currentIndex}
          >
          {
            React.Children
              .toArray(children)
              .map((child, i) => {
                const cardBaseClassName = `${baseClassName}__card`;
                const cardClasses = {
                  [cardBaseClassName]: true,
                  [`${cardBaseClassName}--active`]: currentIndex >= 0 && i === currentIndex
                };
                return (
                  <div className={classNames(cardClasses)} key={`${baseClassName}__card-${i}`}>
                    {child}
                  </div>
                )
              })
          }
        </Carousel>          
      </div>
    );
  }
}

CardsCarousel.propTypes = {
  children: PropTypes.node.isRequired,
  viewport: PropTypes.object.isRequired,
  parentClassName: PropTypes.string,
  cardsInFrame: PropTypes.object,
  currentIndex: PropTypes.number,
  highlightCurrent: PropTypes.bool,
  popoutControls: PropTypes.bool
};

export default CardsCarousel;
