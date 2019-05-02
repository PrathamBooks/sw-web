import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, select } from '@storybook/addon-knobs';

import VideoEmbed from '.';

setAddon(JSXAddon);

const stories = storiesOf('VideoEmbed', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const src = text('Youtube URL', 'https://www.youtube.com/watch?v=kJCC5VklbEI');
  const aspectRatio = select('Size', {
    '4-by-3': '4-by-3',
    '1-by-1': '1-by-1',
    '16-by-9': '16-by-9'
  }, '4-by-3');

  return <VideoEmbed src={src} aspectRatio={aspectRatio} />
});
