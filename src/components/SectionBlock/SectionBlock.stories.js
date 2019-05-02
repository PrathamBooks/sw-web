import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import backgrounds from "@storybook/addon-backgrounds";
import { gbDarkDefault } from '../../../.storybook/backgrounds.js'

import SectionBlock from '.';

setAddon(JSXAddon);

const stories = storiesOf('SectionBlock', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const title = text('Title', 'Title for the section');
  const noContentHorizontalPadding = boolean("No Content Horizontal Padding?");
  const separateHeader = boolean("Separate Header?");
  const content = text('Content', 'A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer. It was not until close upon six o\'clock that I found myself free and was able to spring into a hansom and drive to Baker Street, half afraid that I might be too late to assist at the dénouement of the little mystery.');

  return (
    <SectionBlock
      title={title}
      separateHeader={separateHeader}
      noContentHorizontalPadding={noContentHorizontalPadding}>
      <p>{content}</p>
    </SectionBlock>
  );
});

stories.addDecorator(backgrounds(gbDarkDefault));

stories.addWithJSX('Light', () => {
  const title = text('Title', 'Title for the section');
  const content = text('Content', 'A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer. It was not until close upon six o\'clock that I found myself free and was able to spring into a hansom and drive to Baker Street, half afraid that I might be too late to assist at the dénouement of the little mystery.');

  return (
    <SectionBlock
      title={title}
      theme="light">
      <p>{content}</p>
    </SectionBlock>
  );
});
