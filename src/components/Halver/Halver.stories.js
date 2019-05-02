import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import Halver from '.';

setAddon(JSXAddon);

const stories = storiesOf('Halver', module);

stories.addDecorator(withKnobs);

const imageUrl = 'https://unsplash.it/1000/562?image=1063';

stories.addWithJSX('Default', () => {
  const backgroundUrl = text('Backround Image URL', imageUrl);
  const content = text('Content', "<p>A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer. It was not until close upon six o'clock that I found myself free and was able to spring into a hansom and drive to Baker Street, half afraid that I might be too late to assist at the dénouement of the little mystery. I found Sherlock Holmes alone, however, half asleep, with his long, thin form curled up in the recesses of his armchair. A formidable array of bottles and test-tubes, with the pungent cleanly smell of hydrochloric acid, told me that he had spent his day in the chemical work which was so dear to him.</p>")

  return (
    <Halver backgroundUrl={backgroundUrl}>
      <div dangerouslySetInnerHTML={{__html: content}} />
    </Halver>
  );
});
