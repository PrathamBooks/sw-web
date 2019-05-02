import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import FiltersBar from '../FiltersBar';
import FiltersPanel from '../FiltersPanel';
import LoaderBlock from '../LoaderBlock';

import AllLists from '../AllLists';

import { fetchAllListsFiltersWorkflow,
         fetchAllListsWorkflow, 
         initializeLists } from '../../redux/allListsActions';
import { sortOptions, roles as availableRoles } from '../../lib/constants';
import queryString from 'query-string';
import { replace } from 'react-router-redux';
import { cloneDeep } from 'lodash';
import u from 'updeep';

const defaultFilters = {
  category: [],
  sort: sortOptions.relevance,
  tags: [],
  query: ''
};

const mapStateToProps = ({ user, allLists, viewport }) => ({
  isFetchingAllLists: allLists.isFetchingAllLists,
  lists: allLists.lists,
  loadedPages: allLists.loadedPages,
  listsInfo: allLists.listsInfo,
  filters: allLists.filters,
  viewport,
  userRoles: user.profile.roles,
});

const mapDispatchToProps = {
  fetchAllListsFiltersWorkflow,
  fetchAllListsWorkflow,
  initializeLists,
  replace,
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class AllListsContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      filtersSearchText: {
        category: '',
      }
    };

    const { t } = props;

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

    // filtersPanel have a different format for sortOptions
    this.filtersPanelSortOptions = this.filtersBarSortOptions.map(
      so => ({ label: so.name, value: so.queryValue })
    );
  }

  componentWillMount() {
    const {
      initializeLists,
      fetchAllListsFiltersWorkflow,
      fetchAllListsWorkflow
    } = this.props;

    initializeLists();
    fetchAllListsFiltersWorkflow().then( 
      () => fetchAllListsWorkflow(this.getAppliedFilters())
    );
  }
  
  updateFiltersSearchText = (key, text) => {
    this.setState(u({
      filtersSearchText: {
        [key]: text
      }
    }, this.state));
  };

  updateCategorySearchText = e => this.updateFiltersSearchText('category', e.target.value);

  loadMore = () => this.props.fetchAllListsWorkflow(this.getAppliedFilters(), this.props.loadedPages + 1);

  getAppliedFilters = (props = this.props) => {
    const parsedFilters = queryString.parse(props.location.search);
    Object.entries(parsedFilters).forEach(([ k, v ]) => {
      if (Array.isArray(defaultFilters[k]) && !Array.isArray(v)) {
        parsedFilters[k] = [v];
      }
    });
    
    return ({
      ...defaultFilters,
      ...parsedFilters
    });
  }
 
  applyFilter = (type, value) => {
    const { initializeLists, replace, fetchAllListsWorkflow } = this.props;
    const appliedFilters = cloneDeep(this.getAppliedFilters());
    const filterIsArray = Array.isArray(appliedFilters[type]);

    if (filterIsArray) {
      appliedFilters[type].push(value);
    } else {
      appliedFilters[type] = value;
    }

    initializeLists();
    replace({
      search: queryString.stringify(appliedFilters)
    });
    fetchAllListsWorkflow(appliedFilters);
  }

  removeFilter = (type, value) => {
    const { initializeLists, replace, fetchAllListsWorkflow } = this.props;
    const appliedFilters = cloneDeep(this.getAppliedFilters());

    if (!appliedFilters[type]) {
      return;
    }

    if (Array.isArray(appliedFilters[type])) {
      const index = appliedFilters[type].indexOf(value);
      if (index !== -1 ) {
        appliedFilters[type].splice(index, 1);
      }
    } else {
      delete appliedFilters[type];
    }
    
    initializeLists();
    replace({ 
      search: queryString.stringify(appliedFilters) 
    });
    fetchAllListsWorkflow(appliedFilters);
  }

  clearFilter = (type) => {
    const { initializeLists, replace, fetchAllListsWorkflow } = this.props;
    let appliedFilters = cloneDeep(this.getAppliedFilters());

    if (!appliedFilters[type]) {
      return;
    }

    if (Array.isArray(appliedFilters[type])) {
      appliedFilters[type] = [];
    } else {
      delete appliedFilters[type];
    }
    
    initializeLists();
    replace({ 
      search: queryString.stringify(appliedFilters) 
    });
    fetchAllListsWorkflow(appliedFilters);
  }


 onSortOptionChanged = (option) => this.applyFilter('sort', option)

  render() {

    const {
      t,
      viewport,
      isFetchingFilters,
      isFetchingAllLists,
      lists,
      listsInfo,
      filters,
      loadedPages,
      userRoles
    } = this.props;

    // API sends filters in the wrong format for lists.
    // TODO: Standardize API to be same as other filters, 
    // Fix here as well as in lists expandable search when API structure is fixed.
    const sanitizedFilters = { };
    filters && filters.forEach(f => {
      sanitizedFilters[f.queryKey] = f;
    });


    const { filtersSearchText } = this.state;
    const appliedFilters = this.getAppliedFilters();
    const listsCount = listsInfo.hits;

    const listReadCount = userRoles && userRoles.includes(availableRoles.CONTENT_MANAGER)
                          ?
                          listsInfo.totalReads
                          :
                          null

    if (!filters || isFetchingFilters) {
      return <LoaderBlock />;
    }

    let filtersComponent = null;

    if (viewport.medium) {
        filtersComponent = <FiltersBar
          noTopBorder
          pullUp
          filters={sanitizedFilters}
          applyFilter={this.applyFilter}
          removeFilter={this.removeFilter}
          appliedFilters={appliedFilters}
          categorySearchValue={filtersSearchText.category}
          updateCategorySearchValue={this.updateCategorySearchText}
          itemTypeLabel={t('global.list', listsCount)}
          resultsCount={listsCount}
          readCount={listReadCount}
          sortOptions={this.filtersBarSortOptions}
          applySortOption={this.onSortOptionChanged}
          appliedSortOption={appliedFilters.sort}
        />;
    } else {
      filtersComponent = <FiltersPanel
        viewport={viewport}
        filters={sanitizedFilters}
        applyFilter={this.applyFilter}
        removeFilter={this.removeFilter}
        clearFilter={this.clearFilter}
        appliedFilters={appliedFilters}
        categorySearchValue={filtersSearchText.category}
        updateCategorySearchValue={this.updateCategorySearchText}
        itemTypeLabel={t('global.list', listsCount)}
        resultsCount={listsCount}
        sortOptions={this.filtersPanelSortOptions}
        applySortOption={this.onSortOptionChanged}
        appliedSortOption={appliedFilters.sort}
      />;
    }

    return (
      <AllLists
        isFetchingAllLists={isFetchingAllLists}
        lists={lists}
        listsInfo={listsInfo}
        loadedPages={loadedPages}
        loadMore={this.loadMore}
        filtersComponent={filtersComponent}
        userRoles={userRoles}
      />
    );
  }
}

AllListsContainer.propTypes = {};

export default AllListsContainer;
