import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
// import { withKnobs, boolean } from '@storybook/addon-knobs';

import { MediaObject, Media, Body } from '.';

setAddon(JSXAddon);

const stories = storiesOf('MediaObject', module);

// stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  return (
    <MediaObject>
      <Media>
        <img src="http://via.placeholder.com/640x480?text=4:3" alt="sample" />
      </Media>
      <Body>
        <p>Content for the body</p>
      </Body>
    </MediaObject>
  );
});
