import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, array, boolean } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import List from '.';

setAddon(JSXAddon);

const stories = storiesOf('List', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const separator = text('Separator');
  const items = array('Items', ['One', 'Two', 'Three']);
  const inline = boolean('Inline');
  const itemsEl = items.map((item) => { return (<span>{item}</span>)});
  const nowrap = boolean('nowrap on Children');

  return <List
    separator={separator}
    inline={inline}
    nowrap={nowrap}>
      {itemsEl}
    </List>;
});
