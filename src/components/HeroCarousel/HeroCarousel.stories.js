import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number, boolean } from '@storybook/addon-knobs';
import { imageObject } from '../Img/Img.stories.js';

import HeroCarousel from '.';

setAddon(JSXAddon);

const stories = storiesOf('HeroCarousel', module);

stories.addDecorator(withKnobs);

export const slide = {
  imageUrls: {...imageObject, aspectRatio: 3.402666667, cropCoords: {x: 0, y: 0}},
  pointToLink: "#go-some-where"
}

stories.addWithJSX('Default', () => {
  const wrapAround = boolean('Wraparound?');
  const autoplay = boolean('Autoplay?');
  const autoplayInterval = number('Autoplay interval (ms)', 3000);
  const numberOfSlides = number('Number of Slides', 4, {
     range: true,
     min: 0,
     max: 8,
     step: 1,
  });

  const slides = Array.apply(null, {length: numberOfSlides}).map((n, i) => {
    return slide
  });

  return <HeroCarousel
            slides={slides}
            wrapAround={wrapAround}
            autoplay={autoplay}
            autoplayInterval={autoplayInterval}/>
});
