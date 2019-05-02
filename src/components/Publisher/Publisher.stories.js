import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, object, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Publisher from '.';

setAddon(JSXAddon);

const stories = storiesOf('Publisher', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const offline = boolean('Disabled?', false);
  const publisher = object('Publisher', {
  	slug: "811-pratham-books",
  	name: "Pratham Books",
  	logo: "https://storage.googleapis.com/storyweaver-sw2-full/publishers/logos/811/original/PB_Logo.png?1507632806"
  });

  return <Publisher
    publisher={publisher}
    offline={offline}
    />
});
