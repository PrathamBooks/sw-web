import React from 'react';

import SectionBlock from '../SectionBlock';
import BookShelf from '../BookShelf';
import { sectionClicked } from '../../lib/constants';

const SimilarBooks = ({ offline, similarBooks, t, viewport }) => {
  if (offline || !similarBooks || !similarBooks.length) {
    return null;
  }

  return (
    <SectionBlock
      background="transparent"
      title={t('Book.similar-books')}
      >
      <BookShelf
        books={similarBooks}
        viewport={viewport}
        sectionClicked={sectionClicked.similarBooks}
        offline={offline}
        />
    </SectionBlock>
  );
};

export default SimilarBooks;
