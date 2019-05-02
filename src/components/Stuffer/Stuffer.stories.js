import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, select } from '@storybook/addon-knobs';

import Stuffer from '.';

setAddon(JSXAddon);

const stories = storiesOf('Stuffer', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const options = {
    'none': 'None',
    'm': 'M',
    'l': 'L',
    'xl': 'XL'
  };

  const verticalSpacing = select('Vertical Spacing', options, 'none');

  const horizontalSpacing = select('Horizontal Spacing', options, 'none');

  return (
    <Stuffer
      horizontalSpacing={horizontalSpacing === 'none' ? null : horizontalSpacing}
      verticalSpacing={verticalSpacing === 'none' ? null : verticalSpacing}>
      <p>A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer. It was not until close upon six o'clock that I found myself free and was able to spring into a hansom and drive to Baker Street, half afraid that I might be too late to assist at the dénouement of the little mystery. I found Sherlock Holmes alone, however, half asleep, with his long, thin form curled up in the recesses of his armchair. A formidable array of bottles and test-tubes, with the pungent cleanly smell of hydrochloric acid, told me that he had spent his day in the chemical work which was so dear to him.</p>
    </Stuffer>
  );

});
