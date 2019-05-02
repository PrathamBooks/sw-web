import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';

import Link from '../Link';
import SvgIcon from '../SvgIcon';

import './CarouselButton.scss';

@translate()
class CarouselButton extends Component {
  static defaultProps = {
    slideCount: 1,
    slidesToScroll: 1,
    currentSlide: 1
  }

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.checkDisabled = this.checkDisabled.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
      this.props.onClick();
  }

  checkDisabled() {
    const {
      direction,
      currentSlide,
      slidesToScroll,
      slideCount,
      wrapAround
    } = this.props;

    if (direction === 'previous') {
      return currentSlide === 0 && !wrapAround;
    }

    if (direction === 'next') {
      return(currentSlide + slidesToScroll >= slideCount && !wrapAround)
    }
  }

  render() {
    const baseClassName = 'pb-carousel-button';

    const {
      direction
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--direction-${direction}`]: direction
    };

    return (
      <Link parentClassName={classNames(classes)} onClick={this.handleClick}>
        <SvgIcon
          parentClassName={`${baseClassName}__icon`}
          name={direction === "next" ? "chevron-right" : "chevron-left"}
          size="l" />
      </Link>
    );
  }
}

CarouselButton.propTypes = {
  currentSlide: PropTypes.number,
  nextSlide: PropTypes.func,
  previousSlide: PropTypes.func,
  slideCount: PropTypes.number,
  slidesToScroll: PropTypes.number,
  wrapAround: PropTypes.bool,
  direction: PropTypes.oneOf([
    'next',
    'previous'
  ]).isRequired
};

export const CarouselNextButton = (props) => <CarouselButton direction="next" {...props} />
export const CarouselPreviousButton = (props) => <CarouselButton direction="previous" {...props} />

export default CarouselButton;
