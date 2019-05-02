import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './CarouselMarker.scss';

class CarouselMarker extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props);

    this.getIndexes = this.getIndexes.bind(this);
  }

  getIndexes() {
    const {
      slideCount,
      slidesToScroll
    } = this.props;

    var arr = [];
    for (var i = 0; i < slideCount; i += slidesToScroll) {
      arr.push(i);
    }
    return arr;
  }

  noop() {}

  render() {
    const baseClassName = 'pb-carousel-marker';

    const {
      goToSlide,
      currentSlide
    } = this.props;

    const indexes = this.getIndexes();

    const handleGoToSlide = goToSlide || this.noop;

    const classes = {
      [baseClassName]: true
    };

    return (
      <ul className={classNames(classes)}>
        {
          indexes.map(function(index) {
            const buttonClasses = {
              [`${baseClassName}__button`]: true,
              [`${baseClassName}__button--active`]: currentSlide === index
            }

            return (
              <li className={`${baseClassName}__item`} key={index}>
                <button
                  className={classNames(buttonClasses)}
                  onClick={handleGoToSlide.bind(null, index)}>
                  &bull;
                </button>
              </li>
            )
          })
        }
      </ul>
    );
  }
}

CarouselMarker.propTypes = {
  goToSlide: PropTypes.func,
  slideCount: PropTypes.number,
  slidesToScroll: PropTypes.number,
  currentSlide: PropTypes.number
};

export default CarouselMarker;
