import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';


import Menu from '../Menu';
import MenuLink from '../MenuLink';
import { imageObjectLandscape, imageObjectPortrait } from '../Img/Img.stories.js';

import ImgBrowser from '.';

setAddon(JSXAddon);

const stories = storiesOf('ImgBrowser', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const isPortrait = boolean('Portrait?');
  const next = boolean('Next Image?', true);
  const previous = boolean('Previous Image?', true);
  const showMenu = boolean('Show Menu?', true);

  const menu = (
    <Menu>
      <MenuLink leftIcon="flag" label="Flag" onClick={action("flag-clicked")} />
    </Menu>
  );

  return <ImgBrowser
    image={isPortrait ? imageObjectPortrait : imageObjectLandscape}
    onClickNext={next ? action('next-clicked') : null}
    onClickPrevious={previous ? action('previous-clicked') : null}
    menu={showMenu ? menu : null}
    />
});
