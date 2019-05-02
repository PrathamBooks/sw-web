import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text } from '@storybook/addon-knobs';
import backgrounds from "@storybook/addon-backgrounds";
import { gbDarkDefault } from '../../../.storybook/backgrounds.js'


import ContentStyler from '.';

setAddon(JSXAddon);

const stories = storiesOf('ContentStyler', module);

stories.addDecorator(withKnobs);

const defaultContent = `
  <h1>Heading L1</h1>
  <h2>Heading L1</h2>
  <h3>Heading L1</h3>
  <p>A paragraph. A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer. It was not until close upon six o'clock that I found myself free and was able to spring into a hansom and drive to Baker Street, half afraid that I might be too late to assist at the dénouement of the little mystery.</p>

  <ul><li>List Items</li><li>List Items</li><li>List Items</li></ul>
  <ol><li>Numbered List Items</li><li>Numbered List Items<ol><li>Numbered List Items</li><li>Numbered List Items</li><li>Numbered List Items</li></ol></li><li>Numbered List Items</li></ol>
  <p class="pb-center">Centered Paragraph</p>
`;

stories.addWithJSX('Default', () => {
  const content = text('HTML Content', defaultContent);

  return <ContentStyler><div dangerouslySetInnerHTML={{__html: content}}></div></ContentStyler>
});

stories.addDecorator(backgrounds(gbDarkDefault));

stories.addWithJSX('Light', () => {
  const content = text('HTML Content', defaultContent);

  return <ContentStyler theme="light"><div dangerouslySetInnerHTML={{__html: content}}></div></ContentStyler>
});
