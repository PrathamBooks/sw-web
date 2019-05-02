import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import CardsCarousel from '../CardsCarousel';
import HorizontalGrid from '../HorizontalGrid';

import './CardShelf.scss';

class CardShelf extends Component {
  render() {
    const {
      children,
      cellWidth,
      viewport
    } = this.props;

    const baseClassName = 'pb-book-shelf';

    const classes = {
      [baseClassName]: true
    };

    return (
      <div className={classNames(classes)}>
        {
          viewport.medium
          ?
          <CardsCarousel
            viewport={viewport}
            popoutControls={viewport.xxlarge}
            >
            {children}
          </CardsCarousel>
          :
          <HorizontalGrid cellWidth={cellWidth}>{children}</HorizontalGrid>
        }
      </div>
    );
  }
}

CardShelf.propTypes = {
  children: PropTypes.node,
  viewport: PropTypes.object.isRequired,
  cellWidth: PropTypes.string
};

export default CardShelf;
