import React from 'react';

import List from '../List';
import Pill from '../Pill';

import { links } from '../../lib/constants';


const Tags = ({ tags, baseClassName}) => {

  return (
    <List inline>{
      tags.map((t, i) => {
        return <Pill key={`tag.${i}`} label={t.name} href={links.searchByTag(t.query)} icon="circle" isInternal />
      })
    }</List>
  );
};

export default Tags;