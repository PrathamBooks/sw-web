import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReadingListCard from '../ReadingListCard'
import Grid from '../Grid'
import './ReadingLists.scss';

class ReadingLists extends Component {
  static defaultProps = {
    lists: [],
    showDescription: false
  }
  render() {
    const { menuOpt, showDescription, lists, owner, handleOptionsClick } = this.props;

    const readingLists = lists.map(list => (
        <ReadingListCard
          key={list.id}
          title={list.title}
          count={list.count}
          description={showDescription ? list.description : null }
          slug={list.slug}
          books={list.books}
          wide={showDescription}
          menuOpt={menuOpt}
          handleOptionsClick= {handleOptionsClick}
          canDelete={list.canDelete}
          downloadLinks={list.downloadLinks}
          owner={owner ? list.organisation : null }
        />)
    );

    let layoutContainer;
    if (showDescription) {
      layoutContainer = (<div>{readingLists}</div>);
    } else {
      layoutContainer = (<Grid variant="3up">{readingLists}</Grid>);
    }

    return (
      <div>
        {layoutContainer}
      </div>
    );
  }
}

ReadingLists.propTypes = {
  // TODO: Add shape of each object
  lists: PropTypes.array,
  showDescription: PropTypes.bool
};

export default ReadingLists;
