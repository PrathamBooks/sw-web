import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { action } from '@storybook/addon-actions';

import ThreePointRating from '.';

setAddon(JSXAddon);

const stories = storiesOf('ThreePointRating', module);

stories.addWithJSX('Default', () => {

  return <ThreePointRating
    onChange={action('smiley-rating-on-change')}
    />
});
