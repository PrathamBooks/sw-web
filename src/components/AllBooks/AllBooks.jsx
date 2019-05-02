import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import DocumentTitle from 'react-document-title';

import BookCard from '../BookCard';
import PageHeader from '../PageHeader';
import Tabs from '../Tabs';
import Tab from '../Tab';
import BooksSearchResultsContainer from './BooksSearchResultsContainer';
import ImagesSearchResultsContainer from './ImagesSearchResultsContainer';
import ListsSearchResultsContainer from './ListsSearchResultsContainer';
import PeopleSearchResultsContainer from './PeopleSearchResultsContainer';
import Block from '../Block';

import { links, profileTypes } from '../../lib/constants';

import './AllBooks.scss';


// This must match the visual order of tabs on screen.
const tabIndexes = {
  books: 0,
  lists: 1,
  images: 2,
  people: 3,
  organisations: 4,
};


const translateFiltersBarSortOptionsToFiltersPanelSortOptions = (filtersBarSortOptions) =>
  filtersBarSortOptions.map(
    so => ({ label: so.name, value: so.queryValue })
  );

 const translateFiltersSortOptionsToFiltersPanelSortOptions = (filtersSortOptions) =>
  filtersSortOptions.map(
    so => ({ label: so.name, value: so.queryValue })
  );

@translate()
class AllBooks extends Component {
  static defaultProps = {
    icon: 'book-alt',
    headerBgUrl: 'https://storage.googleapis.com/storyweaver-sw2-full/illustrations/2136/large/Illustration-7.jpg?1443543843'
  }

  constructor(props) {
    super(props);

    this.state = {
      activeTabIndex: tabIndexes[props.appliedFilters.tab]
    }
  }

  onTabChange = (index) => {
    this.setState({ activeTabIndex: index });
    this.props.onTabChange(Object.keys(tabIndexes)[index]);
  }

  render() {
    const baseClassName = 'pb-all-books';

    const {
      t,
      isSearchVariant,
      searchQuery,
      tags,
      headerTitle,
      audioStoryTypeHeaderTitle,
      applyFilter,
      removeFilter,
      clearFilter,
      onSortOptionChanged,
      item,
      roles,
      tab,
      totalBooksCount,
      totalListsCount,
      totalImagesCount,
      totalUsersCount,
      totalOrganisationsCount
    } = this.props;

    const isTagSearch = (tags && tags.length > 0 && !searchQuery);
    const isImgToBeSearched = (item === "images");

    let title = t('global.all-stories');
    if (isSearchVariant && searchQuery && (!tags || tags.length === 0)) {
      title = `"${searchQuery}"`;
    } else if (isSearchVariant && isTagSearch) {
      // We only support a single tag right now. This will become an array join
      // when we support multiple tags.
      // currently, we have tagged search for images and stories
      title = (isImgToBeSearched) ? `${t('Item.tagged', { item: t('Images') })} "${tags}"` : `${t('Item.tagged', { item: t('Stories') })} "${tags}"`;
    } else if (audioStoryTypeHeaderTitle) {
      title = t('Book.listen');
    } else {
      title = headerTitle ? headerTitle : t(`global.all-${tab || item || 'stories'}`);
    }

    const booksSearchResultsEl = (
      <BooksSearchResultsContainer
        roles={roles}
        applyFilter={applyFilter}
        removeFilter={removeFilter}
        clearFilter={clearFilter}
        onSortOptionChanged={onSortOptionChanged}
        translateFiltersBarSortOptionsToFiltersPanelSortOptions = {translateFiltersBarSortOptionsToFiltersPanelSortOptions} 
        translateFiltersSortOptionsToFiltersPanelSortOptions={translateFiltersSortOptionsToFiltersPanelSortOptions}
      />
    );

    const imagesSearchResultEl = (
      <ImagesSearchResultsContainer
        applyFilter={applyFilter}
        removeFilter={removeFilter}
        clearFilter={clearFilter}
        onSortOptionChanged={onSortOptionChanged}
        translateFiltersBarSortOptionsToFiltersPanelSortOptions={translateFiltersBarSortOptionsToFiltersPanelSortOptions}
      />
    );

    let searchResultsEl = (
      <Block>
        {booksSearchResultsEl}
      </Block>
    );

    if (isSearchVariant) {
      const { activeTabIndex } = this.state;

      if (isTagSearch) {
        if (isImgToBeSearched) {
          searchResultsEl = (<Block>{imagesSearchResultEl}</Block>);
        } // else searchResultsEl will continue to hold book search block
      } else {
        searchResultsEl = (
          <Block noHorizontalPadding noVerticalPadding>
            <Tabs onTabChange={this.onTabChange} activeTabIndex={activeTabIndex}>
              <Tab key="books" title={`${t('global.story', 2)} (${totalBooksCount === null ? 0 : totalBooksCount})`} shouldUnloadContent={true}>
                {booksSearchResultsEl}
              </Tab>
              <Tab key="lists" title={`${t('global.list', 2)} (${totalListsCount === null ? 0 : totalListsCount})`} shouldUnloadContent={true}>
                <ListsSearchResultsContainer
                    applyFilter={applyFilter}
                    removeFilter={removeFilter}
                    clearFilter={clearFilter}
                    onSortOptionChanged={onSortOptionChanged}
                    translateFiltersBarSortOptionsToFiltersPanelSortOptions={translateFiltersBarSortOptionsToFiltersPanelSortOptions}
                  />
              </Tab>
              <Tab key="images" title={`${t('global.image', 2)} (${totalImagesCount === null ? 0 : totalImagesCount})`} shouldUnloadContent={true}>
                <ImagesSearchResultsContainer
                  applyFilter={applyFilter}
                  removeFilter={removeFilter}
                  clearFilter={clearFilter}
                  onSortOptionChanged={onSortOptionChanged}
                  translateFiltersBarSortOptionsToFiltersPanelSortOptions={translateFiltersBarSortOptionsToFiltersPanelSortOptions}
                />
              </Tab>
              {
                process.env.REACT_APP_EXPANDED_SEARCH_PEOPLE_TAB
                ?
                <Tab key="people" title={`${t('global.person', 2)} (${totalUsersCount === null ? 0 : totalUsersCount })`} active={activeTabIndex === tabIndexes.people} shouldUnloadContent={true}>
                  <PeopleSearchResultsContainer
                    applyFilter={applyFilter}
                    removeFilter={removeFilter}
                    clearFilter={clearFilter}
                    onSortOptionChanged={onSortOptionChanged}
                    translateFiltersBarSortOptionsToFiltersPanelSortOptions={translateFiltersBarSortOptionsToFiltersPanelSortOptions}
                  />
                </Tab>
                :
                null
              }
              {
                process.env.REACT_APP_EXPANDED_SEARCH_ORGANISATION_TAB
                ?
                <Tab key="organisations" title={`${t('global.organisation', 2)} (${totalOrganisationsCount === null ? 0 : totalOrganisationsCount})`}  active={activeTabIndex === tabIndexes.organisations} shouldUnloadContent={true}>
                  <PeopleSearchResultsContainer
                    applyFilter={applyFilter}
                    removeFilter={removeFilter}
                    clearFilter={clearFilter}
                    onSortOptionChanged={onSortOptionChanged}
                    translateFiltersBarSortOptionsToFiltersPanelSortOptions={translateFiltersBarSortOptionsToFiltersPanelSortOptions}
                    variant={profileTypes.ORGANISATION}
                  />
                </Tab>
                :
                null
              }
            </Tabs>
          </Block>
        );
      }
    }

    const headerBgUrl = isSearchVariant ? null : this.props.headerBgUrl;
    const icon = isSearchVariant ? null : this.props.icon;

    const breadcrumbPaths = [{
      title: t('global.home'),
      href: links.home(),
      isInternal: true
    }];

    if (isSearchVariant) {
      breadcrumbPaths.push({
        title: t('Search.results-for')
      });
    }

    const classes = {
      [baseClassName]: true
    };

    return (
      <div className={classNames(classes)}>
        <DocumentTitle title={`${title} - ${t('global.site-title')}`} />
        <PageHeader
          icon={icon}
          image={headerBgUrl}
          pullInBottom
          title={title}
          breadcrumbPaths={breadcrumbPaths}
        />
        {searchResultsEl}
      </div>
    );
  }
}

AllBooks.propTypes = {
  icon: PropTypes.string,
  headerBgUrl: PropTypes.string,
  books: PropTypes.arrayOf(PropTypes.shape(BookCard.propTypes)),
  onReadClicked: PropTypes.func,
};

export default AllBooks;
