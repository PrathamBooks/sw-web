import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number, boolean } from '@storybook/addon-knobs';
import backgrounds from "@storybook/addon-backgrounds";
import { gbLightDefault } from '../../../.storybook/backgrounds.js'

import SkeletonBookCard from '../SkeletonBookCard';
import CardsCarousel from '.';

const mapStateToProps = ({ viewport }) => ({
  viewport
});

@connect(mapStateToProps)
class CardsCarouselWithViewport extends Component {
  render() {
    return <CardsCarousel viewport={this.props.viewport} {...this.props} />
  }
}

setAddon(JSXAddon);

const stories = storiesOf('CardsCarousel', module);
stories.addDecorator(withKnobs);
stories.addDecorator(backgrounds(gbLightDefault));

stories.addWithJSX('Default', () => {
  const maxNumberOfCards = 14;
  const popoutControls = boolean('Popout controls');
  const highlightCurrent = boolean('highlight current');
  const currentIndex = number(`Current index (max: ${maxNumberOfCards})`);

  const cardsEl = Array.apply(null, {length: maxNumberOfCards}).map((n, i) => {
    return <SkeletonBookCard key={`skeleton-book-card-${i}`} />
  });

  const el = <CardsCarouselWithViewport
                popoutControls={popoutControls}
                highlightCurrent={currentIndex && currentIndex < maxNumberOfCards && highlightCurrent}
                currentIndex={currentIndex}
                >
                  {cardsEl}
             </CardsCarouselWithViewport>;

 if (popoutControls) {
  return (
    <div style={{margin: "0 4em", backgroundColor: '#FFECE7'}}>
      <div>
        <span>Container</span>
        {el}
      </div>
    </div>
  );
 }

  return el;
});
