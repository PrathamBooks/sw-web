import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, object, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Donor from '.';

setAddon(JSXAddon);

const stories = storiesOf('Donor', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const offline = boolean('Disabled?', false);
  const donor = object('Donor', {
  	name: "Oracle",
  	logo: "https://storage.googleapis.com/storyweaver-sw2-full/donors/logos/1/original/o-sponsorship.png?1448282709"
  });

  return <Donor
    donor={donor}
    offline={offline}
    />
});
