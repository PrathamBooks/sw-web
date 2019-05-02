import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import BookCard from '../BookCard';
import SkeletonBookCard from '../SkeletonBookCard';
import Link from '../Link';

import './BookCardGroup.scss';

class BookCardGroup extends Component {
  static defaultProps = {
    books: []
  }

  render() {
    const baseClassName = 'pb-book-card-group';
    const {
      title,
      href,
      parentClassName
    } = this.props;

    const books = this.props.books.slice(0, 4);
    books.reverse();

    let isEmpty = false;
    if (books.length === 0) {
      isEmpty = true;
    }

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName,
      [`${baseClassName}--empty`]: isEmpty,
    }

    return (
      <div className={classNames(classes)}>
        {
          books.map(book => {
            return (
              <div className={`${baseClassName}__book`} key={book.slug}>
                <BookCard book={book} shouldDisplayMenu={false} />
              </div>
            )
          })
        }
        {
          isEmpty
          ?
          (
            <div className={`${baseClassName}__book`}>
              <SkeletonBookCard />
            </div>
          )
          :
          null
        }
        {
          href
          ?
          <Link
            parentClassName={`${baseClassName}__link`}
            href={href}
            isInternal={true}>
            {title || href}
          </Link>
          :
          null
        }
      </div>
    );
  }
}

BookCardGroup.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape(BookCard.propTypes)).isRequired,
  parentClassName: PropTypes.string,
  title: PropTypes.string,
  href: PropTypes.string
};

export default BookCardGroup;
