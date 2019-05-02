import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, number, boolean } from '@storybook/addon-knobs';

import Table from '../Table';

setAddon(JSXAddon);
const stories = storiesOf('Table', module);
stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  
  const count = number('Number of Columns', 10, {
     range: true,
     min: 1,
     max: 100,
     step: 1,
  });

  const rows = number('Number of Rows', 20, {
      range: true,
      min: 1,
      max: 20,
      step: 1,
  });
  const pageSize = number('Number of Row in Each Page', 5, {
    range: true,
    min: 5,
    max: 20,
    step: 5,
  });

  const isSelectable = boolean('isSelectable ?', false);
  const showPagination = boolean('showPagination ?', true);
  const showPaginationTop = boolean('showPaginationTop ?', false);
  const showPaginationBottom = boolean('showPaginationBottom ?', true);
  const sortable = boolean('sortable ?', true);
  const resizable = boolean('resizable ?', true);
  const filterable = boolean('filterable ?', false);
  

  const columns = Array.apply(null, {length: count}).map((n, i) => {
    return ({ header: `Column ${i}`, accessor: `column${i}`} );
  });

  const data = Array.apply(null, {length: rows}).map((n, i) => {
                let row = {};
                for (let j = 0; j < count; j++) {
                  row[`column${j}`] = `some random text ${i} ${j}`
                }
                row[`id`] = i
                return (row);
              });

  return (<Table 
            data={data}
            columns={columns}
            showPagination={showPagination}
            isSelectable={isSelectable}
            showPaginationTop={showPaginationTop}
            showPaginationBottom={showPaginationBottom}
            sortable={sortable}
            resizable={resizable}
            filterable={filterable}
            pageSize={pageSize}
          />);
});
