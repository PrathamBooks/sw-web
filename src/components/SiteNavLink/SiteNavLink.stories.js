import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import SiteNavLink from '.';

setAddon(JSXAddon);

const stories = storiesOf('SiteNavLink', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const label = text('Label', 'A Nice Label');
  const title = text('Title', 'A bit longer title');
  const active = boolean('Active');
  const truncateLongText = boolean('Truncate Long Text');
  const caret = select('Caret', {
    null: 'None',
    down: 'Down',
    top: 'Top',
    left: 'Left',
    right: 'Right'
  }, null);

  const variant = select('Variant', {
    default: 'Default',
    bordered: 'Bordered'
  }, 'default');

  return (
    <SiteNavLink
      variant={variant}
      isActive={active}
      caret={caret}
      truncateLongText={truncateLongText}
      title={title}>
      {label}
    </SiteNavLink>
  );
});
