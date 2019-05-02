import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import backgrounds from "@storybook/addon-backgrounds";
import { gbDarkDefault } from '../../../.storybook/backgrounds.js'

import CollapsibleSection from '.';

setAddon(JSXAddon);

const stories = storiesOf('CollapsibleSection', module);

stories.addDecorator(withKnobs);

const titleText = 'A meaningful title';
const contentText = 'A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer.';

stories.addWithJSX('Default', () => {
  const title = text('Title', titleText);
  const content = text('Content', contentText);
  const upperCaseTitle = boolean('Upper case title?');
  const expandOnMediumViewport = boolean('Expand on medium viewport');
  const expandOnLargeViewport = boolean('Expand on large viewport');
  const disableCollapse = boolean('Disable Collapse');

  return <CollapsibleSection
    title={title}
    upperCaseTitle={upperCaseTitle}
    disableCollapse={disableCollapse}
    expandOnMediumViewport={expandOnMediumViewport}
    expandOnLargeViewport={expandOnLargeViewport}>
      {content}
    </CollapsibleSection>;
});

stories.addDecorator(backgrounds(gbDarkDefault));

stories
  .addWithJSX('Light', () => {
    const title = text('Title', titleText);
    const content = text('Content', contentText);

    return <CollapsibleSection title={title} theme='light'>{content}</CollapsibleSection>;
  });
