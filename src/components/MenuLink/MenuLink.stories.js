import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import MenuLink from '.';

setAddon(JSXAddon);

const stories = storiesOf('MenuLink', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const label = text('Label', 'A Sensible Label');
  const legend = text('Legend', 'A sensible legend, a bit more explaned compared to the label.');
  const leftIcon = text('Left Icon', 'heart');
  const rightIcon = text('Right Icon', 'heart');
  const loading = boolean('Loading?');
  const disabled = boolean('Disabled?');
  const theme = select('Theme', {
    '': 'Default',
    'danger': 'Danger',
    'info': 'Info',
    'success': 'Success',
    'warning': 'Warning',
  }, '');

  return <MenuLink
          label={label}
          legend={legend}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          loading={loading}
          disabled={disabled}
          onClick={action("menu-item-clicked")}
          theme={theme === '' ? null : theme}
          />
});
