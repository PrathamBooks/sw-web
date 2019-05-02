import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, array, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import ListBox from '.';

setAddon(JSXAddon);

const stories = storiesOf('ListBox', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const options = array('Options', [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Australia',
    'Austria',
    'Azerbaijan',
  ]);

  const selectedIndex = number('Selected item index');

  return <ListBox
            options={options}
            onSelect={action('selected')}
            selectedIndex={selectedIndex}
            />
});
