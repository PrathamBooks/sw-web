import React, { Component } from 'react';
import { connect } from 'react-redux';

import OfflineBooks from '../OfflineBooks';
import { unsaveOffline } from '../../redux/offlineBooksActions'
import { recordGaEvents } from '../../redux/googleAnalyticsActions';

import { gaEventCategories, gaEventActions } from '../../lib/constants';

const mapStateToProps = state => {
  return {
    viewport: state.viewport,
    books: state.offlineBooks.books,
    online: state.network.online,
    userEmail: state.user.profile.email
  }
}

const mapDispatchToProps = {
  unsaveOffline,
  recordGaEvents
}

@connect(mapStateToProps, mapDispatchToProps)
class OfflineBooksContainer extends Component {
  constructor(props) {
    super(props);
    this.enableEditMode = this.enableEditMode.bind(this);
    this.disableEditMode = this.disableEditMode.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onChangeCheckedValues = this.onChangeCheckedValues.bind(this);
    this.state = {
      editActive: false,
      checkedValues: []
    }
  }

  enableEditMode() {
    this.setState({
      editActive: true
    })
  }

  disableEditMode() {
    this.setState({
      editActive: false,
      checkedValues: []
    })
  }

  onChangeCheckedValues(checkedValues) {
    this.setState({
      checkedValues
    })
  }

  onDelete() {
    const { unsaveOffline, books, userEmail, recordGaEvents } = this.props;
    this.state.checkedValues.map(unsaveOffline)

    // Find the selected books for deletion
    const checkedBooks = books.filter((book) => this.state.checkedValues.includes(book.id));
    
    //send delete event to GA
    checkedBooks.forEach(
      book => recordGaEvents({
        eventCategory: gaEventCategories.offline,
        eventAction: gaEventActions.delete,
        userEmail: userEmail,
        dimension2: book.level,
        dimension3: book.language,
        dimension5: book.slug,
        metric2: -1
      })
    )

    this.setState({
      editActive: false,
      checkedValues: []
    })
  }

  render() {
    const { viewport, books, online } = this.props;
    const { editActive, checkedValues } = this.state;
    return (
      <OfflineBooks
        viewport={viewport}
        books={books}
        editActive={editActive}
        onManage={this.enableEditMode}
        onCancel={this.disableEditMode}
        onDelete={this.onDelete}
        onChangeCheckedValues={this.onChangeCheckedValues}
        online={online}
        isSomethingSelected={Boolean(checkedValues.length)}
        checkedValues={checkedValues}
      />
    );
  }
}

export default OfflineBooksContainer;
