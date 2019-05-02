import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';

import MenuContentWrapper from '.';

setAddon(JSXAddon);

const stories = storiesOf('MenuContentWrapper', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const title = text('Title', 'May be a title');
  const matchLeftIcon = boolean('Match left icon?');

  return (
    <MenuContentWrapper
      matchLeftIcon={matchLeftIcon}
      title={title}>
      <p>A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer.</p>
    </MenuContentWrapper>
  );
});
