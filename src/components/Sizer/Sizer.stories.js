import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, boolean, select, text } from '@storybook/addon-knobs';

import Sizer from '.';

setAddon(JSXAddon);

const stories = storiesOf('Sizer', module);

stories.addDecorator(withKnobs);

const availableSizes = {
  'none': 'None (Default)',
  'xxxs': 'XXXS',
  'xxs': 'XXS',
  'xs': 'XS',
  's': 'S',
  'm': 'M',
  'l': 'L',
  'xl': 'XL',
  'xxl': 'XXL',
  'xxxl': 'XXXL',
};

stories.addWithJSX('Default', () => {
  const height = select('Height', availableSizes, 'none');
  const width = select('Width', availableSizes, 'none');
  const maxHeight = select('Max-height', availableSizes, 'none');
  const maxWidth = select('Max-width', availableSizes, 'none');
  const scrollX = boolean('Horizontal Scroll?');
  const scrollY = boolean('Vertical Scroll?');
  const content = text('Content', "<p>A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer. It was not until close upon six o'clock that I found myself free and was able to spring into a hansom and drive to Baker Street, half afraid that I might be too late to assist at the dénouement of the little mystery. I found Sherlock Holmes alone, however, half asleep, with his long, thin form curled up in the recesses of his armchair. A formidable array of bottles and test-tubes, with the pungent cleanly smell of hydrochloric acid, told me that he had spent his day in the chemical work which was so dear to him.</p>");

  return <Sizer
          width={width === 'none' ? null : width}
          height={height === 'none' ? null : height}
          maxHeight={maxHeight === 'none' ? null : maxHeight}
          maxWidth={maxWidth === 'none' ? null : maxWidth}
          scrollX={scrollX}
          scrollY={scrollY}
          >
            <div dangerouslySetInnerHTML={{__html: content}} />
          </Sizer>
});
