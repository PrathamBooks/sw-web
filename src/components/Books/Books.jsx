import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '../Grid';
import BookCard from '../BookCard';

class Books extends Component {
  static defaultProps = {
    books: []
  }

  render() {
    const { books } = this.props;

    return (
      <Grid variant="2up-6up">
        {
          books.map(book => {
            return (
              <BookCard key={book.id} book={book} />
            )
          })
        }
      </Grid>
    );
  }
}

Books.propTypes = {
  // TODO: Add shape of each object
  books: PropTypes.array
};

export default Books;
