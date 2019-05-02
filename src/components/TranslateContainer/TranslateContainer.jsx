import React, { Component } from 'react';
import { connect } from 'react-redux'

import TranslateLanding from '../TranslateLanding'

import { fetchBooksWorkflow, changeSourceLanguage, changeTargetLanguage, fetchFiltersWorkflow } from '../../redux/translateActions'

import { addSlimNotification } from '../../redux/slimNotificationActions';

const mapStateToProps = state => {
  return {
    isFetchingBooks: state.translate.isFetchingBooks,
    books: state.translate.books,
    filters: state.translate.filters,
    appliedFilters: state.translate.appliedFilters,
    sourceLanguage: state.translate.sourceLanguage,
    targetLanguage: state.translate.targetLanguage,
    viewport: state.viewport
  }
}

const mapDispatchToProps = {
  fetchBooksWorkflow,
  changeSourceLanguage,
  changeTargetLanguage,
  fetchFiltersWorkflow,
  addSlimNotification
}

@connect(mapStateToProps, mapDispatchToProps)
class TranslateContainer extends Component {
  componentWillMount() {
    this.props.fetchFiltersWorkflow()
      .then(response => {
        return this.props.fetchBooksWorkflow(this.props.sourceLanguage, this.props.targetLanguage, this.props.appliedFilters, 1)
      })
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.sourceLanguage !== this.props.sourceLanguage)
      ||
      (nextProps.targetLanguage !== this.props.targetLanguage)
      ||
      (nextProps.appliedFilters !== this.props.appliedFilters)
    ) {
      this.props.fetchBooksWorkflow(nextProps.sourceLanguage, nextProps.targetLanguage, nextProps.appliedFilters, 1)
    }
  }

  render() {
    const {
      books,
      viewport,
      filters,
      sourceLanguage,
      targetLanguage,
      isFetchingBooks,
      changeSourceLanguage,
      changeTargetLanguage,
      addSlimNotification
    } = this.props;
    return (
      <TranslateLanding
        books={books}
        viewport={viewport}
        filters={filters}
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
        isFetchingBooks={isFetchingBooks}
        changeSourceLanguage={changeSourceLanguage}
        changeTargetLanguage={changeTargetLanguage}
        addSlimNotification={addSlimNotification}
      />
    );
  }
}

export default TranslateContainer;
