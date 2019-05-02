import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, object } from '@storybook/addon-knobs';
import { imageObject } from '../Img/Img.stories.js';
import CategoryCard from '.';

setAddon(JSXAddon);

const stories = storiesOf('CategoryCard', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const category = text('Category Name', 'Activity Books');
  const imageUrls = object('Image', imageObject);

  return <CategoryCard category={category} image={imageUrls}/>
});
