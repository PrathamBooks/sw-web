import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, object } from '@storybook/addon-knobs';

import StatsBar from '.';

setAddon(JSXAddon);

const stories = storiesOf('StatsBar', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const stats = object('Stats', [
    {
      label: 'Stories',
      value: 6174
    },
    {
      label: 'Reads',
      value: 999999999
    },
    {
      label: 'Languages',
      value: 6174
    },
  ]);

  return <StatsBar  stats={stats} />
});
