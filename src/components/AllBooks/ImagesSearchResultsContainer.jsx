import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import u from 'updeep';
import { isEqual } from 'lodash';

import LoaderBlock from '../LoaderBlock';
import Pagination from '../Pagination';
import ImageCard from '../ImageCard';
import Grid from '../Grid';
import NoResults from '../NoResults';
import FiltersBar from '../FiltersBar';
import FiltersPanel from '../FiltersPanel';

import {
    fetchSearchImagesFiltersWorkflow,
    fetchSearchImagesWorkflow,
} from '../../redux/expandedSearchActions';
import { recordGaEvents } from '../../redux/googleAnalyticsActions';
import { sortOptions, gaEventCategories, gaEventActions, sectionClicked } from '../../lib/constants';


const ImageGridEl = ({ images, onProfileLinkClicked }) => {
  const imageEls = images.map(image => {
    return (
      <ImageCard
        key={image.slug}
        title={image.title}
        slug={image.slug}
        image={image.imageUrls[0]}
        artists={image.illustrators}
        onProfileLinkClicked={onProfileLinkClicked}
      />
    )
  });

  return <Grid variant="2up-6up">{imageEls}</Grid>
};

const mapDispatchToProps = {
    fetchSearchImagesFiltersWorkflow,
    fetchSearchImagesWorkflow,
    recordGaEvents
};

const mapStateToProps = ({ expandedSearch, viewport, allFilters: { imagesFilters }, user: { profile } }) => ({
  ...expandedSearch,
  viewport,
  appliedFilters: imagesFilters,
  userEmail: profile.email
});

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class ImagesSearchResultsContainer extends Component {
  constructor(props) {
    super(props);

    const { t } = props;

    this.state = {
      // The filters bar allows searching through available
      // filter values. We store that search text here.
      filtersSearchText: {
        category: '',
        publisher: '',
        style: '',
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
  updateCategorySearchText = e => this.updateFiltersSearchText('category', e.target.value);
  updatePublisherSearchText = e => this.updateFiltersSearchText('publisher', e.target.value);
  updateStyleSearchText = e => this.updateFiltersSearchText('style', e.target.value);

  onLoadMore = () => this.props.fetchSearchImagesWorkflow(
    this.props.appliedFilters,
    this.props.loadedPages + 1
  );

  onProfileLinkClicked = (profileSlug) => {
    const {
      recordGaEvents,
      userEmail,
    } = this.props;
  
    recordGaEvents({
      eventCategory: gaEventCategories.profile,
      eventAction: gaEventActions.opened,
      eventLabel: sectionClicked.illustrationSearchPage,
      userEmail: userEmail,
      dimension5: profileSlug
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.appliedFilters, nextProps.appliedFilters)) {
      this.props.fetchSearchImagesWorkflow(nextProps.appliedFilters);
    }
  }

  componentDidMount() {
    const {
      fetchSearchImagesFiltersWorkflow,
      fetchSearchImagesWorkflow,
      appliedFilters,
    } = this.props;

    fetchSearchImagesFiltersWorkflow().then(
      () => fetchSearchImagesWorkflow(appliedFilters)
    );
  }
  
  render() {
    const {
      t,
      isFetchingSearchImages,
      images,
      totalSearchImagesCount,
      viewport,
      imagesFilters,
      isFetchingImagesFilters,
      appliedFilters,
      applyFilter,
      removeFilter,
      clearFilter,
      onSortOptionChanged,
      recordGaEvents
    } = this.props;
 
    if (!imagesFilters || isFetchingImagesFilters) {
      return <LoaderBlock />;
    }

    let filtersComponent = null;
    if (viewport.medium) {
      filtersComponent = (
        <FiltersBar
          noTopBorder
          pullUp
          filters={ imagesFilters}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
          appliedFilters={appliedFilters}
          recordGaEvents={recordGaEvents}
          gaEventCategoryType={gaEventCategories.filterImage}
          categorySearchValue={this.state.filtersSearchText.category}
          updateCategorySearchValue={this.updateCategorySearchText}
          publisherSearchValue={this.state.filtersSearchText.publisher}
          updatePublisherSearchValue={this.updatePublisherSearchText}
          styleSearchValue={this.state.filtersSearchText.style}
          updateStyleSearchValue={this.updateStyleSearchText}
          resultsCount={totalSearchImagesCount}
          itemTypeLabel={t('global.image', totalSearchImagesCount)}
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
          filters={imagesFilters}
          applyFilter={applyFilter}
          clearFilter={clearFilter}
          removeFilter={removeFilter}
          appliedFilters={appliedFilters}
          recordGaEvents={recordGaEvents}
          gaEventCategoryType={gaEventCategories.filterImage}
          categorySearchValue={this.state.filtersSearchText.category}
          updateCategorySearchValue={this.updateCategorySearchText}
          publisherSearchValue={this.state.filtersSearchText.publisher}
          updatePublisherSearchValue={this.updatePublisherSearchText}
          styleSearchValue={this.state.filtersSearchText.style}
          updateStyleSearchValue={this.updateStyleSearchText}
          resultsCount={totalSearchImagesCount}
          itemTypeLabel={t('global.image', totalSearchImagesCount)}
          sortOptions={this.filtersPanelSortOptions}
          applySortOption={onSortOptionChanged}
          appliedSortOption={appliedFilters.sort}
        />
      );
    }

    // TODO: nested ternary operators are BAD!
    const shouldShowLoadMore = images && images.length !== 0 ? (images.length < totalSearchImagesCount ? true : false) : false;
    
    return (
      <div>
        { filtersComponent }
        {
          isFetchingSearchImages || !images
          ?
          <LoaderBlock />
          :
          <div>
            <ImageGridEl
              images={images}
              onProfileLinkClicked={this.onProfileLinkClicked}
            />
            {
              shouldShowLoadMore
              ?
              <Pagination
                onClick={this.onLoadMore}
                loading={this.props.isFetchingSearchMoreImages}
              />
              :
              null
            }
            {
              totalSearchImagesCount
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

ImagesSearchResultsContainer.propTypes = {
};

export default ImagesSearchResultsContainer;
