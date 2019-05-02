import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, boolean, number, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Likes from '.';

setAddon(JSXAddon);

const stories = storiesOf('Likes', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const liked = boolean('Liked?');
  const numberOfLikes = number('Number of Likes', 0, {
     min: 0,
     step: 1,
  });
  const logInMsg = text('Login Msg', 'Please log in to like me');
  const isLoggedIn = boolean('LoggedIn?');

  return <Likes
            isliked={liked}
            likesCount={numberOfLikes}
            onLike={action('like-clicked')}
            isLoggedIn={isLoggedIn}
            openAuthModal={action('openAuthModal-clicked')}
            logInMsg={logInMsg}
          />
});
