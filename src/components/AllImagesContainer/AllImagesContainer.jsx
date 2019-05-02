import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import AllImages from '../AllImages';
import FiltersBar from '../FiltersBar';
import FiltersPanel from '../FiltersPanel';
import { translate } from 'react-polyglot';
import { cloneDeep } from 'lodash';
import u from 'updeep';
import { openAuthModal } from '../../redux/userActions';
import { sortOptions, bulkDownloadOptions, gaEventCategories } from '../../lib/constants';
import queryString from 'query-string';
import LoaderBlock from '../LoaderBlock';
import { fetchMeWorkflow } from '../../redux/userActions';

import { fetchAllIllustrationsFiltersWorkflow, 
         fetchAllIllustrationsWorkflow,
         initializeIllustrations } from '../../redux/allIllustrationsActions';

import { uploadIllustrationWorkflow, 
         autocompleteTagsWorkflow,
         autocompleteIllustratorsWorkflow,
         fetchNewIllustrationFormDataWorkflow,
         fetchConfirmImageFormatWorkflow } from '../../redux/illustrationActions';

import { recordGaEvents } from '../../redux/googleAnalyticsActions';
import { addNotificationModal, removeNotificationModal } from '../../redux/notificationModalActions';
import { addSlimNotification } from '../../redux/slimNotificationActions';

const defaultFilters = {
  category: [],
  publisher: [],
  style: [],
  sort: sortOptions.relevance,
  tags: [],
  query: ''
};

const mapStateToProps = ({ allImages, viewport, illustration, user }) => ({
  ...allImages,
  isUploadingIllustration: illustration.isUploadingIllustration,
  isLoggedIn: user.isLoggedIn,
  isFetchingMe: user.isFetchingMe,
  firstName: user.profile.first_name,
  userRoles: user.profile.roles,
  userEmail: user.profile.email,
  name: user.profile.name,
  organisation: user.profile.orgName,
  country: user.profile.country,
  downloadLimitReached: user.profile.imagesDownloadLimitReached,
  isOrganisationMember: user.profile.isOrganisationMember,
  organizationRoles: user.profile.organizationRoles,
  hasOwnIllustrations: user.profile.hasOwnIllustrations,
  tags: illustration.tags,
  newFormData: illustration.formData,
  illustratorSuggestions: illustration.illustratorSuggestions,
  bulkDownloadFormatOptions: allImages.bulkDownloadFormatOptions,
  isfetchingConfirmImageFormat: illustration.isfetchingConfirmImageFormat,
  viewport
});

const mapDispatchToProps = {
  openAuthModal,
  fetchAllIllustrationsFiltersWorkflow,
  fetchAllIllustrationsWorkflow,
  initializeIllustrations,
  replace,
  uploadIllustrationWorkflow,
  autocompleteTagsWorkflow,
  autocompleteIllustratorsWorkflow,
  fetchNewIllustrationFormDataWorkflow,
  recordGaEvents,
  addNotificationModal,
  removeNotificationModal,
  addSlimNotification,
  fetchMeWorkflow,
  fetchConfirmImageFormatWorkflow
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)

class AllImagesContainer extends Component {

    constructor(props) {
    super(props);
    const { t } = props;

    this.state = {
      filtersSearchText: {
        category: '',
        publisher: '',
        style: '',
      },
      showBulkDownloadOptions: this.getAppliedFilters().bulk_download ,
    };
    
    this.filtersBarSortOptions = [
      {
        name: t('sort.relevance'),
        queryValue: sortOptions.relevance
      },
      {
        name: t('sort.new-arrivals-images'),
        queryValue: sortOptions.newArrivals
      },
      {
        name: t('sort.most-viewed'),
        queryValue: sortOptions.mostViewed
      },
      {
        name: t('sort.most-liked'),
        queryValue: sortOptions.mostLiked
      }
    ];

    this.filtersPanelSortOptions = this.filtersBarSortOptions.map(
      so => ({ label: so.name, value: so.queryValue })
    );

    this.filtersBarBulkDownloadOptions = [
      {
        name: t('BulkDownload.all-images'),
        queryValue: bulkDownloadOptions.allImages
      },
      {
        name: t('BulkDownload.not-downloaded'),
        queryValue: bulkDownloadOptions.notDownloaded
      }
    ];
  }

  componentDidMount() {
    const {
      initializeIllustrations,
      fetchAllIllustrationsFiltersWorkflow,
      fetchAllIllustrationsWorkflow,
    } = this.props;

    initializeIllustrations();

    fetchAllIllustrationsFiltersWorkflow().then(
      () => fetchAllIllustrationsWorkflow(this.getAppliedFilters())
    );
  }


  updateFiltersSearchText = (key, text) => {
    this.setState(u({
      filtersSearchText: {
        [key]: text
      }
    }, this.state));
  };

  updateStyleSearchText = e => this.updateFiltersSearchText('style', e.target.value);
  updatePublisherSearchText = e => this.updateFiltersSearchText('publisher', e.target.value);
  updateCategorySearchText = e => this.updateFiltersSearchText('category', e.target.value);
  
  loadMore = () => this.props.fetchAllIllustrationsWorkflow(this.getAppliedFilters(),this.props.loadedPages + 1);


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
    const appliedFilters = cloneDeep(this.getAppliedFilters());
    const filterIsArray = Array.isArray(appliedFilters[type]);

    if (filterIsArray) {
      appliedFilters[type].push(value);
    } else {
      appliedFilters[type] = value;
    }

    this.props.replace({
      search: queryString.stringify(appliedFilters)
    });
    this.props.initializeIllustrations();
    this.props.fetchAllIllustrationsWorkflow(appliedFilters);
  }

  removeFilter = (type, value) => {
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
    
    this.props.initializeIllustrations();
    this.props.replace({ search: queryString.stringify(appliedFilters) });
    this.props.fetchAllIllustrationsWorkflow(appliedFilters);
  }

  clearFilter = (type) => {
    let appliedFilters = cloneDeep(this.getAppliedFilters());

    if (!appliedFilters[type]) {
      return;
    }

    if (Array.isArray(appliedFilters[type])) {
      appliedFilters[type] = [];
    } else {
      delete appliedFilters[type];
    }
    
    this.props.initializeIllustrations();
    this.props.replace({ search: queryString.stringify(appliedFilters) });
    this.props.fetchAllIllustrationsWorkflow(appliedFilters);
  }

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


  onBulkDownloadOptionsChanged = (showBulkDownloadOptions) => this.setState( {showBulkDownloadOptions: showBulkDownloadOptions});

  onSortOptionChanged = (option) => this.applyFilter('sort', option)

  render() {

    const {
      t,
      viewport,
      isLoggedIn,
      filters,
      isFetchingFilters,
      isFetchingAllIllustrations,
      illustrations,
      illustrationsInfo,
      isFirstPage,
      uploadIllustrationWorkflow,
      fetchAllIllustrationsWorkflow,
      initializeIllustrations,
      isUploadingIllustration,
      openAuthModal,
      firstName,
      userRoles,
      autocompleteTagsWorkflow,
      tags,
      autocompleteIllustratorsWorkflow,
      illustratorSuggestions,
      newFormData,
      fetchNewIllustrationFormDataWorkflow,
      recordGaEvents,
      userEmail,
      organizationRoles,
      bulkDownloadFormatOptions,
      addNotificationModal,
      removeNotificationModal,
      isOrganisationMember,
      addSlimNotification,
      name,
      organisation,
      country,
      downloadLimitReached,
      hasOwnIllustrations,
      fetchMeWorkflow,
      fetchConfirmImageFormatWorkflow,
      isfetchingConfirmImageFormat,
      isFetchingMe
    } = this.props;

    const { filtersSearchText } = this.state;
    const appliedFilters = this.getAppliedFilters();

    if (!filters || isFetchingFilters) {
      return <LoaderBlock />;
    }

    let filtersComponent = null;
    const illustrationsCount = illustrationsInfo.hits;

    if (viewport.medium) {
      filtersComponent = (
        <FiltersBar
          noTopBorder
          pullUp
          filters={filters}
          applyFilter={this.applyFilter}
          removeFilter={this.removeFilter}
          clearFilter={this.clearFilter}
          appliedFilters={appliedFilters}
          userEmail={userEmail}
          recordGaEvents={recordGaEvents}
          gaEventCategoryType={gaEventCategories.filterImage}
          styleSearchValue={filtersSearchText.style}
          updateStyleSearchValue={this.updateStyleSearchText}
          categorySearchValue={filtersSearchText.category}
          updateCategorySearchValue={this.updateCategorySearchText}
          publisherSearchValue={filtersSearchText.publisher}
          updatePublisherSearchValue={this.updatePublisherSearchText}
          resultsCount={illustrationsCount}
          itemTypeLabel={t('global.image', illustrationsCount)}
          sortOptions={this.filtersBarSortOptions}
          applySortOption={this.onSortOptionChanged}
          appliedSortOption={appliedFilters.sort}
          bulkDownloadOptions={this.state.showBulkDownloadOptions ? this.filtersBarBulkDownloadOptions : null}
        />  
      );
    } else {
      filtersComponent = (
        <FiltersPanel
              filters={filters}
              applyFilter={this.applyFilter}
              removeFilter={this.removeFilter}
              clearFilter={this.clearFilter}
              appliedFilters={appliedFilters}
              viewport={viewport}
              userEmail={userEmail}
              recordGaEvents={recordGaEvents}
              gaEventCategoryType={gaEventCategories.filterImage}
              styleSearchValue={filtersSearchText.style}
              updateStyleSearchValue={this.updateStyleSearchText}
              categorySearchValue={filtersSearchText.category}
              updateCategorySearchValue={this.updateCategorySearchText}
              publisherSearchValue={filtersSearchText.publisher}
              updatePublisherSearchValue={this.updatePublisherSearchText}
              resultsCount={illustrationsCount}
              itemTypeLabel={t('global.image', illustrationsCount)}
              sortOptions={this.filtersPanelSortOptions}
              applySortOption={this.onSortOptionChanged}
              appliedSortOption={appliedFilters.sort}
              bulkDownloadOptions={this.state.showBulkDownloadOptions ? this.filtersBarBulkDownloadOptions : null}
            />
      );
    }

    return (<AllImages
        applyFilter={this.applyFilter}
        removeFilter={this.removeFilter}
        isLoggedIn={isLoggedIn}
        isFetchingAllIllustrations={isFetchingAllIllustrations}
        images={illustrations}
        illustrationsInfo={illustrationsInfo}
        isFirstPage={isFirstPage}
        loadMore={this.loadMore}
        filtersComponent={filtersComponent}
        uploadIllustration={uploadIllustrationWorkflow}
        fetchAllIllustrations={fetchAllIllustrationsWorkflow}
        appliedFilters={appliedFilters}
        initializeIllustrations={initializeIllustrations}
        isUploadingIllustration={isUploadingIllustration}
        openAuthModal={openAuthModal}
        firstName={firstName}
        userRoles={userRoles}
        autocompleteTags={autocompleteTagsWorkflow}
        tags={tags}
        autocompleteIllustrators={autocompleteIllustratorsWorkflow}
        illustratorSuggestions={illustratorSuggestions}
        newFormData={newFormData}
        fetchNewIllustrationFormData={fetchNewIllustrationFormDataWorkflow}
        recordGaEvents={recordGaEvents}
        userEmail={userEmail}
        name={name}
        organisation={organisation}
        country={country}
        downloadLimitReached={downloadLimitReached}
        fetchMeWorkflow={fetchMeWorkflow}
        organizationRoles={organizationRoles}
        hasOwnIllustrations={hasOwnIllustrations}
        addSlimNotification={addSlimNotification}
        addNotificationModal={addNotificationModal}
        removeNotificationModal={removeNotificationModal}
        onBulkDownloadOptionsChanged={this.onBulkDownloadOptionsChanged}
        bulkDownloadFormatOptions={bulkDownloadFormatOptions}
        isOrganisationMember={isOrganisationMember}
        clearFilter={this.clearFilter}
        filters={filters}
        confirmImageFormat={fetchConfirmImageFormatWorkflow}
        isfetchingConfirmImageFormat={isfetchingConfirmImageFormat}
        isFetchingMe={isFetchingMe}
        />
      );
  }

} 

AllImagesContainer.propTypes = {};

export default AllImagesContainer;
