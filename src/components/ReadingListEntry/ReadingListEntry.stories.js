import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, select, number, object, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import ReadingListEntry from '.';
import { imageObject } from '../Img/Img.stories.js';

setAddon(JSXAddon);

const stories = storiesOf('ReadingListEntry', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  imageObject.aspectRatio = 1;
  const maxIndexCount = 9;
  const editActive = boolean('Edit Active?');
  const active = boolean('Entry Active?');
  const usageInstructions = object('Usage Instruction', {
    html: '<p>Read aloud in the class once.<br>Distribute the printout to the students.</p><p>A professional case of great gravity was engaging.</p>',
    txt: 'Read aloud in the class once.\nDistribute the printout to the students.\n\nA professional case of great gravity was engaging.'
  });
  const index = number('Index', 1, {
     range: true,
     min: 0,
     max: maxIndexCount,
     step: 1,
  });
  const title = text('Title', 'The Elephant in the Room');
  const language = text('Language', 'English');
  const level = select('Reading Level', {
    1: 'Level 1',
    2: 'Level 2',
    3: 'Level 3',
    4: 'Level 4'
  }, 2);
  const slug = text('slug', 'the-elephant-in-the-room');
  const authors = object('Authors', [
    {name: 'Sam Wilson', slug: '/users/sam-wilson'},
    {name: 'Sam Wilson II', slug: '/users/sam-wilson-ii'}
  ]);
  const coverImage = object('Cover Image', imageObject);

  return <ReadingListEntry
            index={index}
            book={{
              title,
              slug,
              coverImage,
              language,
              level,
              authors,
              usageInstructions
            }}
            first={index === 0}
            last={index === maxIndexCount}
            active={active}
            editActive={editActive}
            onFieldChange={action('on-field-change')}
            onAddHowToUse={action('on-add-how-to-use')}
            onRemoveHowToUse={action('on-remove-how-to-use')}
            onDeleteBook={action('on-delete-book')}
            onMoveBook={action('on-move-book')}
            onFieldFocus={action('on-field-focus')}
            onFieldBlur={action('on-field-blur')}
            />
});
