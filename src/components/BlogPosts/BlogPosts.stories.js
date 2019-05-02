import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, object } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';

import BlogPosts from '.';
import { imageObject } from '../Img/Img.stories.js';

setAddon(JSXAddon);

const stories = storiesOf('BlogPosts', module);

stories.addDecorator(withKnobs);

// Force the aspect ratio
const postImageObject = {...imageObject, aspectRatio: 1.777777778};

export const samplePost = {
  title: "How Story Time Is Making Learning Fun for 30,000 Students in Maharashtra’s Govt Schools",
  summary: "In the hilly terrains of Phaltan, Satara district, Maharashtra a movement to seed the joy of reading in classrooms is being quietly seeded in 150 Zilla Parishad schools.",
  url: "#link-to-the-post",
  image: postImageObject
};

export const samplePosts = Array.apply(null, {length: 2}).map((n, i) => {
  return samplePost;
});

stories.addWithJSX('Default', () => {
  const posts = object('Posts', samplePosts);

  return <BlogPosts posts={posts}/>
});
