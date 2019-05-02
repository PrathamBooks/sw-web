import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { action } from '@storybook/addon-actions';

import MenuLink from '../MenuLink';
import MenuDivider from '../MenuDivider';
import MenuContentWrapper from '../MenuContentWrapper';

import Menu from '.';

setAddon(JSXAddon);

const stories = storiesOf('Menu', module);

stories.addWithJSX('Default', () => {
  return (
    <Menu>
      <MenuLink
        label="Make Available Offline"
        legend="You’ll be able to read the book even when you are not connected to the internet."
        leftIcon="offline"
        onClick={action("menu-item-clicked")}
        />
      <MenuLink
        label="Mark as Read"
        leftIcon="check"
        onClick={action("menu-item-clicked")}
        />
      <MenuDivider />
      <MenuLink
        label="Delete"
        leftIcon="bin"
        onClick={action("menu-item-clicked")}
        theme="danger"
        />
      <MenuContentWrapper matchLeftIcon>
        <p><strong>Matching space of an icon.</strong> A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer.</p>
      </MenuContentWrapper>
      <MenuDivider />
      <MenuLink
        label="Action Without an Icon"
        onClick={action("menu-item-clicked")}
        />
      <MenuContentWrapper>
        <p>A professional case of great gravity was engaging my own attention at the time, and the whole of next day I was busy at the bedside of the sufferer.</p>
      </MenuContentWrapper>
    </Menu>
  );
});
