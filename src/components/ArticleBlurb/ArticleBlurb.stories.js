import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, object, boolean } from '@storybook/addon-knobs';

import ArticleBlurb from '.';
import { imageObject } from '../Img/Img.stories.js';

setAddon(JSXAddon);

const stories = storiesOf('ArticleBlurb', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const coverImage = boolean('Cover Image?');
  const title = text('Title', 'A Nice title for the Article');
  const summary = text('Summary', 'It is probably the dream of any amateur astronomer to be able to be the boss of one of the great multi million dollar telescopes even if it was just for one hour or for a few shots. Sure, we can have a lot of fun with our binoculars. And as we improve our personal equipment set, we get better and better at pinpointing what we want to see in the sky.');
  const date = text('Date String (Unix Time Stamp)', '1496924376000');
  const meta = object('Meta Info', ['New Indian Express', 'News']);
  const url = text('URL', "https://www.example.com/article");

  return <ArticleBlurb
    title={title}
    summary={summary}
    date={date}
    meta={meta}
    url={url}
    image={coverImage ? imageObject : null}
    />
});
