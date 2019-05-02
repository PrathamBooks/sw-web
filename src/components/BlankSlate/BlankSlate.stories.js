import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, select } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';
import { imageObject } from '../Img/Img.stories.js';
import sampleSVGPath from '../../assets/watering-can.svg';

import BlankSlate from '.';

setAddon(JSXAddon);

const stories = storiesOf('BlankSlate', module);

stories.addDecorator(withKnobs);


stories.addWithJSX('Default', () => {
  const title = text('Title', 'You have no books');
  const content = text('Content', '<p>How about you <a href="#">write one</a> or <a href="#">translate an existing</a> book?</p>');
  const graphicType = select('Graphic', {
    'none': 'None',
    'icon': 'Icon',
    'image': 'Image',
    'url': 'URL'
  }, 'none');

  let image;
  let icon;
  let url;
  if (graphicType === 'image') {
    image = imageObject;
  } else if (graphicType === 'url') {
    url = sampleSVGPath;
  } else if (graphicType === 'icon') {
    icon = 'book-alt';
  }

  return (
    <BlankSlate
      title={title}
      image={image}
      icon={icon}
      url={url}
      >
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    </BlankSlate>
  );
});
