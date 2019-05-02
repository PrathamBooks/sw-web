import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number } from '@storybook/addon-knobs';
import backgrounds from "@storybook/addon-backgrounds";
import { gbDarkDefault } from '../../../.storybook/backgrounds.js'

import Breadcrumb from '.';

setAddon(JSXAddon);

const stories = storiesOf('Breadcrumb', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const levels = number('Levels', 3, {
     range: true,
     min: 1,
     max: 6,
     step: 1,
  });

  const paths = Array.apply(null, {length: levels}).map((n, i) => {
    return {
      title: `Title-${i}`,
      href: `#destination-${i}`,
    };
  });

  return <Breadcrumb paths={paths}/>
});

stories.addDecorator(backgrounds(gbDarkDefault));

stories
  .addWithJSX('Light', () => {
    const levels = number('Levels', 3, {
       range: true,
       min: 1,
       max: 6,
       step: 1,
    });

    const paths = Array.apply(null, {length: levels}).map((n, i) => {
      return {
        title: `Title-${i}`,
        href: `#destination-${i}`,
      };
    });

    return <Breadcrumb paths={paths} theme="light"/>;
  });
