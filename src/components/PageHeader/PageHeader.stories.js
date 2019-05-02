import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, object, boolean, select } from '@storybook/addon-knobs';

import Block from '../Block';
import Button from '../Button';
import PageHeader from '.';

setAddon(JSXAddon);

const stories = storiesOf('PageHeader', module);

stories.addDecorator(withKnobs);

const imageUrl = 'https://unsplash.it/1000/562?image=1063';
const imageObj = {
  aspectRatio: 1.333333333,
  cropCoords: {
    x: 0,
    y: 0
  },
  sizes: [
    {
      height: 128,
      width: 268,
      url: "https://storage.googleapis.com/storyweaver-sw2-full/illustration_crops/28773/size1/c214f635203a86fa98e9f0ba0ee9c0b7.jpg"
    },
    {
      height: 148,
      width: 308,
      url: "https://storage.googleapis.com/storyweaver-sw2-full/illustration_crops/28773/size2/c214f635203a86fa98e9f0ba0ee9c0b7.jpg"
    },
    {
      height: 205,
      width: 428,
      url: "https://storage.googleapis.com/storyweaver-sw2-full/illustration_crops/28773/size3/c214f635203a86fa98e9f0ba0ee9c0b7.jpg"
    },
    {
      height: 263,
      width: 548,
      url: "https://storage.googleapis.com/storyweaver-sw2-full/illustration_crops/28773/size4/c214f635203a86fa98e9f0ba0ee9c0b7.jpg"
    },
    {
      height: 339,
      width: 708,
      url: "https://storage.googleapis.com/storyweaver-sw2-full/illustration_crops/28773/size5/c214f635203a86fa98e9f0ba0ee9c0b7.jpg"
    },
    {
      height: 385,
      width: 803,
      url: "https://storage.googleapis.com/storyweaver-sw2-full/illustration_crops/28773/size6/c214f635203a86fa98e9f0ba0ee9c0b7.jpg"
    },
    {
      height: 460,
      width: 959,
      url: "https://storage.googleapis.com/storyweaver-sw2-full/illustration_crops/28773/size7/c214f635203a86fa98e9f0ba0ee9c0b7.jpg"
    }
  ]
};

stories.addWithJSX('Default', () => {
  const title = text('Title', 'What is this page about?');
  const bgType = select('Background Image Type', {
    'none': 'None',
    'url': 'URL',
    'imageObj': 'Image Object',
  }, 'none');
  const breadcrumbPaths = object('Breadcrumb', [
    {
      title: 'Title-1',
      href: '#destination-1',
    },
    {
      title: 'Title-2',
      href: '#destination-2',
    }
  ]);
  const icon = text('Icon', 'heart');
  const contents = text('Content', 'A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer.');
  const pullInBottom = boolean('Pull in bottom?');
  const overlayVariant = select('Overlay Variant', {
    'default': 'Default',
    'mid-night-gradient': 'mid-night-gradient',
  }, 'default');
  const addSomeActions = boolean('With Some Actions?');

  let image = null;
  if (bgType === 'url') {
    image = imageUrl;
  } else if (bgType === 'imageObj') {
    image = imageObj;
  }

  return (
    <div>
      <PageHeader
        title={title}
        breadcrumbPaths={breadcrumbPaths}
        icon={icon}
        image={image}
        pullInBottom={pullInBottom}
        overlayVariant={overlayVariant}
        actions={addSomeActions ? <Button fullWidth label="Some Action" variant="primary"/> : null}>
        <p dangerouslySetInnerHTML={{__html: contents}}></p>
      </PageHeader>
      {
        pullInBottom
        ?
        <Block>
          <p>Test Block</p>
        </Block>
        :
        null
      }
    </div>
  );
});
