import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, boolean, select } from '@storybook/addon-knobs';

import ImgCanvas from '.';

import { imageObjectLandscape, imageObjectPortrait } from '../Img/Img.stories.js';

setAddon(JSXAddon);

const stories = storiesOf('ImgCanvas', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const isPortrait = boolean('Portrait image?');
  const fit = select('Fit', {
    auto: 'auto',
    width: 'width',
    height: 'height'
  });

  return <ImgCanvas
    image={isPortrait ? imageObjectPortrait : imageObjectLandscape}
    fit={fit}
    />
});
