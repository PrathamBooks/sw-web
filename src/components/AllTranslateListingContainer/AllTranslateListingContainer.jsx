import React, { Component } from 'react';
import { connect } from 'react-redux'

import AllTranslateListing from '../AllTranslateListing'

import { fetchBooksWorkflow, changeSourceLanguage, changeTargetLanguage, loadMoreWorkflow, fetchFiltersWorkflow } from '../../redux/translateActions'

const mapStateToProps = state => {
  return {
    isFetchingBooks: state.translate.isFetchingBooks,
    books: state.translate.books,
    metadata: state.translate.metadata,
    sourceLanguage: state.translate.sourceLanguage,
    targetLanguage: state.translate.targetLanguage,
    viewport: state.viewport,
    filters: state.translate.filters,
    appliedFilters: state.translate.appliedFilters
  }
}

const mapDispatchToProps = {
  fetchBooksWorkflow,
  changeSourceLanguage,
  changeTargetLanguage,
  loadMoreWorkflow,
  fetchFiltersWorkflow
}

@connect(mapStateToProps, mapDispatchToProps)
class AllTranslateListingContainer extends Component {
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
      metadata,
      viewport,
      appliedFilters,
      sourceLanguage,
      targetLanguage,
      isFetchingBooks,
      changeSourceLanguage,
      changeTargetLanguage,
      loadMoreWorkflow,
      filters
    } = this.props;
    return (
      <AllTranslateListing
        books={books}
        metadata={metadata}
        viewport={viewport}
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
        isFetchingBooks={isFetchingBooks}
        changeSourceLanguage={changeSourceLanguage}
        changeTargetLanguage={changeTargetLanguage}
        loadMore={loadMoreWorkflow}
        filters={filters}
        appliedFilters={appliedFilters}
      />
    );
  }
}

export default AllTranslateListingContainer;
