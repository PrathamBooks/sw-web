import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import u from 'updeep';
import { isEqual } from 'lodash';
import NoResults from '../NoResults';
import LoaderBlock from '../LoaderBlock';
import Pagination from '../Pagination';
import ReadingListCard from '../ReadingListCard';
import Grid from '../Grid';
import FiltersBar from '../FiltersBar';
import FiltersPanel from '../FiltersPanel';

import {
  fetchSearchReadingListsFiltersWorkflow,
  fetchSearchReadingListsWorkflow,
} from '../../redux/expandedSearchActions';
import { sortOptions } from '../../lib/constants';


const ReadingListsGrid = ({ lists }) => {
  const listsEl = lists.map(list => {
    return (
      <ReadingListCard
        key={list.slug}
        title={list.title}
        count={list.count}
        slug={list.slug}
        books={list.books}
        owner={list.author}
      />
    )
  });

  return <Grid variant="3up">{listsEl}</Grid>;
};

const mapDispatchToProps = {
    fetchSearchReadingListsFiltersWorkflow,
    fetchSearchReadingListsWorkflow,
};

const mapStateToProps = ({ expandedSearch, viewport, allFilters: { listsFilters } }) => ({
  ...expandedSearch,
  viewport,
  appliedFilters: listsFilters
});

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class ListSearchResultsContainer extends Component {
  constructor(props) {
    super(props);

    const { t } = props;

    this.state = {
      // The filters bar allows searching through available
      // filter values. We store that search text here.
      filtersSearchText: {
        level: '',
        category: '',
        language: '',
      },
    }

    this.filtersBarSortOptions = [
      {
        name: t('sort.relevance'),
        queryValue: sortOptions.relevance
      },
      {
        name: t('sort.new-arrivals'),
        queryValue: sortOptions.newArrivals
      },
      {
        name: t('sort.most-viewed'),
        queryValue: sortOptions.mostViewed
      },
      {
        name: t('sort.most-liked'),
        queryValue: sortOptions.mostLiked
      },
    ];

    // FiltersBar uses a SelectBox to display sort options, whereas
    // FiltersPanel uses a RadioGroup. Both these components expect
    // different props to display options. We do the transformation
    // here, before passing the props down.
    this.filtersPanelSortOptions = this.props.translateFiltersBarSortOptionsToFiltersPanelSortOptions(this.filtersBarSortOptions);
  }

  // Updates filter bar search text for a specified filter.
  updateFiltersSearchText = (key, text) => {
    this.setState(u({
      filtersSearchText: {
        [key]: text
      }
    }, this.state));
  };

  // Convenience methods for updating filter bar search text for
  // our current list of filters.
  updateLevelSearchText = e => this.updateFiltersSearchText('level', e.target.value);
  updateCategorySearchText = e => this.updateFiltersSearchText('category', e.target.value);
  updateLanguageSearchText = e => this.updateFiltersSearchText('language', e.target.value);

  onLoadMore = () => this.props.fetchSearchReadingListsWorkflow(
    this.props.appliedFilters,
    this.props.loadedPages + 1
  );

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.appliedFilters, nextProps.appliedFilters)) {
      this.props.fetchSearchReadingListsWorkflow(nextProps.appliedFilters);
    }
  }

  componentDidMount() {
    const {
      fetchSearchReadingListsFiltersWorkflow,
      fetchSearchReadingListsWorkflow,
      appliedFilters,
    } = this.props;

    fetchSearchReadingListsFiltersWorkflow().then(
      () => fetchSearchReadingListsWorkflow(appliedFilters)
    );
  }
  
  render() {
    const {
      t,
      isFetchingSearchLists,
      lists,
      totalSearchListsCount,
      viewport,
      filters,
      isFetchingListsFilters,
      appliedFilters,
      applyFilter,
      removeFilter,
      clearFilter,
      onSortOptionChanged,
    } = this.props;

    if (!filters || isFetchingListsFilters) {
      return <LoaderBlock />;
    }

    // API sends filters in the wrong format for lists.
    const sanitizedFilters = { };
    filters.forEach(f => {
      sanitizedFilters[f.queryKey] = f;
    });

    let filtersComponent = null;
    if (viewport.medium) {
      filtersComponent = (
        <FiltersBar
          noTopBorder
          pullUp
          filters={sanitizedFilters}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
          appliedFilters={appliedFilters}
          levelSearchValue={this.state.filtersSearchText.level}
          updateLevelSearchValue={this.updateLevelSearchText}
          categorySearchValue={this.state.filtersSearchText.category}
          updateCategorySearchValue={this.updateCategorySearchText}
          languageSearchValue={this.state.filtersSearchText.language}
          updateLanguageSearchValue={this.updateLanguageSearchText}
          resultsCount={totalSearchListsCount}
          itemTypeLabel={t('global.list', totalSearchListsCount)}
          sortOptions={this.filtersBarSortOptions}
          applySortOption={onSortOptionChanged}
          appliedSortOption={appliedFilters.sort}
        />
      );
    } else {
      filtersComponent = (
        <FiltersPanel
          noTopBorder
          pullUp
          viewport={viewport}
          filters={sanitizedFilters}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
          clearFilter={clearFilter}
          appliedFilters={appliedFilters}
          levelSearchValue={this.state.filtersSearchText.level}
          updateLevelSearchValue={this.updateLevelSearchText}
          categorySearchValue={this.state.filtersSearchText.category}
          updateCategorySearchValue={this.updateCategorySearchText}
          languageSearchValue={this.state.filtersSearchText.language}
          updateLanguageSearchValue={this.updateLanguageSearchText}
          resultsCount={totalSearchListsCount}
          itemTypeLabel={t('global.list', totalSearchListsCount)}
          sortOptions={this.filtersPanelSortOptions}
          applySortOption={onSortOptionChanged}
          appliedSortOption={appliedFilters.sort}
        />
      );
    }

    // TODO: nested ternary operators are BAD!
    const shouldShowLoadMore = lists && lists.length !== 0 ? (lists.length < totalSearchListsCount ? true : false) : false;
    
    return (
      <div>
        { filtersComponent }
        {
          isFetchingSearchLists || !lists
          ?
          <LoaderBlock />
          :
          <div>
            <ReadingListsGrid
              lists={lists}
            />
            {
              shouldShowLoadMore
              ?
              <Pagination
                onClick={this.onLoadMore}
                loading={this.props.isFetchingSearchMoreLists}
              />
              :
              null
            }
            {
              totalSearchListsCount
              ?
              null
              :
              <NoResults />
            }
          </div>
        }
      </div>
    );
  }
}

ListSearchResultsContainer.propTypes = {
};

export default ListSearchResultsContainer;
