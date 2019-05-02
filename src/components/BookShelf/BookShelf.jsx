
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';

import BookCard from '../BookCard';
import CardShelf from '../CardShelf';

import './BookShelf.scss';

const renderBookEls = (t, books, onReadClicked, isFetchingAssets, sectionClicked, offline) => {
  return books.map(book => {
    return <BookCard 
        key={book.id} 
        book={book}
        sectionClicked={sectionClicked} 
        offline={offline}
        onClick={onReadClicked}
        hideMenu
      />;
  });
};

@translate()
class BookShelf extends Component {
  static defaultProps = {}

  render() {
    const {
      books,
      onReadClicked,
      isFetchingAssets,
      viewport,
      t,
      sectionClicked,
      offline
    } = this.props;

    const baseClassName = 'pb-book-shelf';

    const classes = {
      [baseClassName]: true
    };

    return (
      <div className={classNames(classes)}>
        <CardShelf cellWidth="book-card" viewport={viewport}>
          {renderBookEls(t, books, onReadClicked, isFetchingAssets, sectionClicked, offline)}
        </CardShelf>
      </div>
    );
  }
}

BookShelf.propTypes = {
  viewport: PropTypes.object.isRequired,
  books: PropTypes.arrayOf(PropTypes.shape(BookCard.propTypes)).isRequired
};

export default BookShelf;
