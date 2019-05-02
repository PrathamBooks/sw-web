import React from 'react';

import List from '../List';
import Pill from '../Pill';

import { links } from '../../lib/constants';

const CategoryTags = ({ categories, baseClassName , isCategoryPill}) => {

  return (
    <List inline>{
      categories.map((c, i) => {
       return (
       <Pill key={i} label={c.name} href={links.searchByCategory(c.query)} icon="circle" isInternal isCategoryPill={isCategoryPill}/>
       )
    })}</List>
  );
};

export default CategoryTags;