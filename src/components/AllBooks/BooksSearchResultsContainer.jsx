import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import u from 'updeep';
import { isEqual, cloneDeep } from 'lodash';

import ActionBar, {ActionBarSection} from '../ActionBar';
import LoaderBlock from '../LoaderBlock';
import Pagination from '../Pagination';
import BookCard from '../BookCard';
import Grid from '../Grid';
import FiltersBar from '../FiltersBar';
import FiltersPanel from '../FiltersPanel';
import Button from '../Button';
import Checkbox from '../Checkbox';
import NoResults from '../NoResults';
import SelectableGrid from '../SelectableGrid';
import BulkDownloadModal from './BulkDownloadModal';
import SelectField from '../SelectField';
import Inliner from '../Inliner';

import {
  fetchConfirmStoryFormatWorkflow
} from '../../redux/allBooksActions';

import {
  fetchSearchBooksFiltersWorkflow,
  fetchSearchBooksWorkflow,
} from '../../redux/expandedSearchActions';

import { openNextTranslationSuggestions } from '../../redux/nextTranslationActions';
import { fetchMeWorkflow } from '../../redux/userActions'
import {  fetchBookAssetsWorkflow, fetchNextTranslationBooksWorkflow } from '../../redux/bookActions';
import { recordGaEvents } from '../../redux/googleAnalyticsActions';
import { addSlimNotification } from '../../redux/slimNotificationActions';
import { MAX_BULK_DOWNLOAD_BOOKS_COUNT,
         sortOptions,
         links,
         bulkDownloadOptions,
         sectionClicked,
         gaEventCategories,
         gaEventActions,
         defaultBulkDownloadFormat,
         bookDownloadFormats,
         roles as availableRoles, nextSuggestionsTypes } from '../../lib/constants';

import './BooksSearchResultsContainer.scss';


const BookGridEl = ({ books, onReadClicked, isFetchingAssets, t }) => {
  const bookEls = books.map(book => {
    return (
      <BookCard
        key={book.slug}
        book={book}
        sectionClicked={sectionClicked.allStories}
      />
    )
  });

  return <Grid variant="2up-6up">{bookEls}</Grid>
};

const mapDispatchToProps = {
  fetchSearchBooksFiltersWorkflow,
  fetchSearchBooksWorkflow,
  fetchBookAssetsWorkflow,
  fetchMeWorkflow,
  recordGaEvents,
  addSlimNotification,
  fetchConfirmStoryFormatWorkflow,
  openNextTranslationSuggestions,
  fetchNextTranslationBooksWorkflow
};

const mapStateToProps = ({ expandedSearch, viewport, book: { assets, isFetchingAssets }, user, allFilters: { readFilters, bulkDownloadFormatOptions }}) => ({
  ...expandedSearch,
  viewport,
  assets,
  isFetchingAssets,
  isFetchingMe: user.isFetchingMe,
  appliedFilters: readFilters,
  name: user.profile.name,
  organisation: user.profile.orgName,
  country: user.profile.country,
  downloadLimitReached: user.profile.storiesDownloadLimitReached,
  isLoggedIn: user.isLoggedIn,
  userEmail: user.profile.email,
  userRoles: user.profile.roles,
  isOrganisationMember: user.profile.isOrganisationMember,
  organizationRoles: user.profile.organizationRoles,
  hasOwnStories: user.profile.hasOwnStories
});

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class BooksSearchResultsContainer extends Component {
  constructor(props) {
    super(props);

    const { t } = props;

    this.state = {
      // The filters bar allows searching through available
      // filter values. We store that search text here.
      filtersSearchText: {
        category: '',
        publisher: '',
        level: '',
        language: '',
        derivation_type: '',
        status: '',
        story_type: '',
      },
      // If bulk_download/bulk_download_format filter is already applied, will make the BulkDownload Tab visible(to take care of reload issue)
      isBulkDownloadTabClicked: this.props.appliedFilters.bulk_download ,
      checkedValues: [],
      allChecked: false,
      isDownloadModalVisible: false,
      downloadFormat: defaultBulkDownloadFormat.stories
    }

    this.filtersSortOptions = [
      {
        name: t('sort.relevance'),
        queryValue: sortOptions.relevance
      },
      {
        name: t('sort.new-arrivals'),
        queryValue: sortOptions.newArrivals
      },
      {
        name: t('sort.most-read'),
        queryValue: sortOptions.mostRead
      },
      {
        name: t('sort.most-liked'),
        queryValue: sortOptions.mostLiked
      },
      {
        name: t('sort.editors-picks'),
        queryValue: sortOptions.editorsPicks
      },
   ];

    
    this.filtersBarSortOptions = [
      ...this.filtersSortOptions,
      {
        name: t('sort.ratings'),
        queryValue: sortOptions.ratings
      }
   ];

    // FiltersBar uses a SelectBox to display sort options, whereas
    // FiltersPanel uses a RadioGroup. Both these components expect
    // different props to display options. We do the transformation
    // here, before passing the props down.
    const isContentManager = this.props.userRoles && this.props.userRoles.includes(availableRoles.CONTENT_MANAGER)
    this.filtersPanelSortOptions = (isContentManager ?this.props.translateFiltersBarSortOptionsToFiltersPanelSortOptions(this.filtersBarSortOptions):this.props.translateFiltersSortOptionsToFiltersPanelSortOptions(this.filtersSortOptions))

    this.filtersBarBulkDownloadOptions = [
      {
        name: t('BulkDownload.all-stories'),
        queryValue: bulkDownloadOptions.allStories
      },
      {
        name: t('BulkDownload.not-downloaded'),
        queryValue: bulkDownloadOptions.notDownloaded
      }
    ];
  }

  // Updates filter bar search text for a specified filter.
  updateFiltersSearchText = (key, text) => {
    this.setState(u({
      filtersSearchText: {
        [key]: text
      }
    }, this.state));
  };


  onChangeCheckedValues = (checkedValues) => {
    if(checkedValues.length >= MAX_BULK_DOWNLOAD_BOOKS_COUNT ) {
      this.props.addSlimNotification({
        type: 'info',
        id: 'Book.bulk-download-limit',
        content: this.props.t('Book.bulk-download-limit-text', MAX_BULK_DOWNLOAD_BOOKS_COUNT),
      });
    }

    this.setState(
      {checkedValues: checkedValues});
  }

  applyDownloadFormatOption = (value) => {

    if (value === bookDownloadFormats.hiResPdf) {
      const isContentManager = this.props.userRoles && this.props.userRoles.includes(availableRoles.CONTENT_MANAGER)
      if (!isContentManager) {
        this.props.addSlimNotification({
          type: 'info',
          content: this.props.t('Book.bulk-download-hi-res-warning'),
        });
      }
    }
    
    this.setState(
      {downloadFormat: value});
  };

  openBulkStoriesDownload = () => {
    this.setState({isBulkDownloadTabClicked: true});
    //Adding filter All Stories as default whenever DOWNNLOAD MULTIPLE BOOKS button is clicked
    this.props.applyFilter('bulk_download', bulkDownloadOptions.allStories);
  }

  closeBulkStoriesDownload = () => {
    this.setState(u(
      { isBulkDownloadTabClicked: false,
        checkedValues: [],
        allChecked: false,
        downloadFormat: defaultBulkDownloadFormat.stories }, this.state));
    //Removing bulkDownload filter whenever CANCEL button is clicked
    this.props.clearFilter('bulk_download');
  }

  allCheckedChange = (allChecked) => {
    this.setState({ allChecked: allChecked.checked });
  }
  
  downloadBulkStories = () => {
    this.props.fetchMeWorkflow()
    .then(response => {
      if(this.state.checkedValues.length > 0 ) {
        this.setState({isDownloadModalVisible: true});
      }
    })
  }

  bulkDownloadButtonClicked = (selectedValues) => {
    window.open(links.bulkStoriesDownload(selectedValues))
      this.props.recordGaEvents({
        eventCategory: gaEventCategories.bulkDownload,
        eventAction: gaEventActions.download,
        userEmail: this.props.userEmail,
        metric4: selectedValues.length
      });
    this.setState({isDownloadModalVisible: false});
  }

  onCloseDownloadModal = () => {
    this.setState({isDownloadModalVisible: false});
  }

  // Convenience methods for updating filter bar search text for
  // our current list of filters.
  updateCategorySearchText = e => this.updateFiltersSearchText('category', e.target.value);
  updatePublisherSearchText = e => this.updateFiltersSearchText('publisher', e.target.value);
  updateLevelSearchText = e => this.updateFiltersSearchText('level', e.target.value);
  updateLanguageSearchText = e => this.updateFiltersSearchText('language', e.target.value);
  updateStoryTypeSearchText = e => this.updateFiltersSearchText('derivation_type', e.target.value);
  updateStoryStatusSearchText = e => this.updateFiltersSearchText('status', e.target.value);
  updateTypeSearchText = e => this.updateFiltersSearchText('story_type', e.target.value);

  onLoadMore = () => this.props.fetchSearchBooksWorkflow(
    this.props.appliedFilters,
    this.props.loadedPages + 1
  );

  onFormLinkClicked = () => {
    const {
      userEmail,
      name,
      organisation,
      country
    } = this.props;
    window.open(links.googleFormBookDownloadLink({userEmail, name, organisation, country}));
    //closing the modal after opening the form
    this.setState({isDownloadModalVisible: false});
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.appliedFilters, nextProps.appliedFilters)) {
      this.props.fetchSearchBooksWorkflow(nextProps.appliedFilters);
      // Reset all checked books on changing /applying new filters
      if(this.state.isBulkDownloadTabClicked) {
        this.setState({checkedValues: [], allChecked: false})
      }
      const isContentManager = this.props.userRoles && this.props.userRoles.includes(availableRoles.CONTENT_MANAGER)
      if (isContentManager) {
        this.setState({checkedValues: [], allChecked: false})
      }
    }
  }

  renderBookEls() {
    const { books } = this.props;

    return books.map(book => {
      return (
        <BookCard
          key={book.slug}
          id={book.id}
          book={book}
          hasOverlay={book.storyDownloaded}
        />
      );
    });
  }
  
  componentDidMount() {
    const {
      fetchSearchBooksFiltersWorkflow,
      fetchSearchBooksWorkflow,
      appliedFilters,
      fetchNextTranslationBooksWorkflow,
      openNextTranslationSuggestions,
    } = this.props;

    // First fetch available filters, then fetch the books.
    fetchSearchBooksFiltersWorkflow().then(
      () => fetchSearchBooksWorkflow(appliedFilters)
    );
    // whenever these flags will be in url , we will show next translation suggestion
    if (appliedFilters.translateToLanguage && appliedFilters.slug) {
      fetchNextTranslationBooksWorkflow(appliedFilters.slug, appliedFilters.translateToLanguage).then(
        () => openNextTranslationSuggestions({ nextSuggestionsType : nextSuggestionsTypes.nextTranslation,translateToLanguage: appliedFilters.translateToLanguage })
      );
    } 
  }

  render() {
    const {
      t,
      isFetchingSearchBooks,
      books,
      isFetchingAssets,
      totalSearchBooksCount,
      viewport,
      booksFilters,
      isFetchingBooksFilters,
      appliedFilters,
      applyFilter,
      removeFilter,
      clearFilter,
      onSortOptionChanged,
      downloadLimitReached,
      isLoggedIn,
      bulkDownloadFormatOptions,
      isOrganisationMember,
      userRoles,
      organizationRoles,
      hasOwnStories,
      fetchConfirmStoryFormatWorkflow,
      isfetchingConfirmBooksFormat,
      isFetchingMe,
      recordGaEvents,
      userEmail
    } = this.props;

    let filters = cloneDeep(this.props.booksFilters);

    let isBulkDownloadTabClicked = this.state.isBulkDownloadTabClicked
    const isContentManager = userRoles && userRoles.includes(availableRoles.CONTENT_MANAGER)

    const baseClassName = 'pb-books-search-results';

    if (!booksFilters || isFetchingBooksFilters) {
      return <LoaderBlock />;
    }

    //ReadAlong language filters
    if (appliedFilters.isAudio) {
      let readAlongLangs = ["English", "Hindi"]
      filters.language.queryValues = filters.language.queryValues.filter(lang => readAlongLangs.includes(lang.queryValue))
    }
      
    let filtersComponent = null;
    if (viewport.medium) {
      filtersComponent = (
        <FiltersBar
          noTopBorder
          pullUp
          isContentManager={isContentManager}
          filters={filters}
          applyFilter={applyFilter}
          recordGaEvents={recordGaEvents}
          userEmail={userEmail}
          gaEventCategoryType={appliedFilters.isAudio ? gaEventCategories.filterReadalong : gaEventCategories.filterRead }
          removeFilter={removeFilter}
          appliedFilters={appliedFilters}
          typeSearchValue={this.state.filtersSearchText.story_type}
          updateTypeSearchValue={this.updateTypeSearchText}
          categorySearchValue={this.state.filtersSearchText.category}
          updateCategorySearchValue={this.updateCategorySearchText}
          publisherSearchValue={this.state.filtersSearchText.publisher}
          updatePublisherSearchValue={this.updatePublisherSearchText}
          levelSearchValue={this.state.filtersSearchText.level}
          updateLevelSearchValue={this.updateLevelSearchText}
          languageSearchValue={this.state.filtersSearchText.language}
          updateLanguageSearchValue={this.updateLanguageSearchText}
          storyStatusSearchValue={this.state.filtersSearchText.status}
          updateStoryStatusSearchValue={this.updateStoryStatusSearchText}
          storyTypeSearchValue={this.state.filtersSearchText.derivation_type}
          updatestoryTypeSearchValue={this.updatestoryTypeSearchText}
          resultsCount={totalSearchBooksCount}
          itemTypeLabel={t('global.story', totalSearchBooksCount)}
          sortOptions={isContentManager ? this.filtersBarSortOptions: this.filtersSortOptions }
          applySortOption={onSortOptionChanged}
          appliedSortOption={appliedFilters.sort}
          bulkDownloadOptions={isBulkDownloadTabClicked ? this.filtersBarBulkDownloadOptions : null}
        />
      );
    } else {
      filtersComponent = (
        <FiltersPanel
          isContentManager={isContentManager}
          filters={filters}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
          clearFilter={clearFilter}
          appliedFilters={appliedFilters}
          userEmail={userEmail}
          recordGaEvents={recordGaEvents}
          gaEventCategoryType={appliedFilters.isAudio ? gaEventCategories.filterReadalong : gaEventCategories.filterRead }
          viewport={viewport}
          typeSearchValue={this.state.filtersSearchText.story_type}
          updateTypeSearchValue={this.updateTypeSearchText}
          categorySearchValue={this.state.filtersSearchText.category}
          updateCategorySearchValue={this.updateCategorySearchText}
          publisherSearchValue={this.state.filtersSearchText.publisher}
          updatePublisherSearchValue={this.updatePublisherSearchText}
          levelSearchValue={this.state.filtersSearchText.level}
          updateLevelSearchValue={this.updateLevelSearchText}
          languageSearchValue={this.state.filtersSearchText.language}
          updateLanguageSearchValue={this.updateLanguageSearchText}
          storyStatusSearchValue={this.state.filtersSearchText.status}
          updateStoryStatusSearchValue={this.updateStoryStatusSearchText}
          storyTypeSearchValue={this.state.filtersSearchText.derivation_type}
          updatestoryTypeSearchValue={this.updatestoryTypeSearchText}
          resultsCount={totalSearchBooksCount}
          itemTypeLabel={t('global.story', totalSearchBooksCount)}
          sortOptions={this.filtersPanelSortOptions}
          applySortOption={onSortOptionChanged}
          appliedSortOption={appliedFilters.sort}
          bulkDownloadOptions={isBulkDownloadTabClicked ? this.filtersBarBulkDownloadOptions : null}
        />
      );
    }

    let bulkDownloadComponent = null;

    
    const isPublisher = organizationRoles && organizationRoles.includes(availableRoles.PUBLISHER)
    
    const shouldShowBulkDownload = isLoggedIn && (isContentManager || isPublisher || isOrganisationMember || hasOwnStories ) ;

    if ( shouldShowBulkDownload ) {
      if (isBulkDownloadTabClicked) {
        bulkDownloadComponent = (
          <div className={`${baseClassName}`} >
            <ActionBar noTopBorder parentClassName={`${baseClassName}__bulk-download-action-bar`} >
              <ActionBarSection>
                <Checkbox
                  label={t('global.bulk-download-stories-select-all')}
                  id="bulk-download-select-all"
                  onChange={this.allCheckedChange}
                  checked={this.state.allChecked}
                  inline
                />
              </ActionBarSection>
              <ActionBarSection forceAlignRight >
                <Inliner width='l'>
                  <SelectField
                    parentClassName={`${baseClassName}__select-format`}
                    value={this.state.downloadFormat}
                    id="bulk-download-select-format"
                    name="bulk-download-select-format"
                    onChange={this.applyDownloadFormatOption}
                    options={bulkDownloadFormatOptions}
                  />
                </Inliner>
                <Button
                  label={t("global.bulk-download-all")}
                  variant="primary"
                  onClick={this.downloadBulkStories}
                  disabled={this.state.checkedValues.length === 0 || this.state.downloadFormat === ""}
                  loading={isFetchingMe}
                />
                <Button
                  label={t("global.cancel")}
                  onClick={this.closeBulkStoriesDownload}
                />
              </ActionBarSection>
            </ActionBar>
            <div className={`${baseClassName}__bulk-download-count`}>
              <span className={`${baseClassName}__count`}>
                {`${t('global.bulk-download-count', {selectedCount: this.state.checkedValues ? this.state.checkedValues.length : 0, totalCount: books ? books.length : 0 })} ${t('Book.bulk-download-stories-warning')}`}
              </span>
            </div>
          </div>
        );
      }
      else
      {
        bulkDownloadComponent = (
          <ActionBar noTopBorder parentClassName={`${baseClassName}__bulk-download-action-bar`} >
            <ActionBarSection forceAlignRight >
              <Button
                label={t("global.bulk-download-button")}
                variant="primary"
                onClick={this.openBulkStoriesDownload}
              />
            </ActionBarSection>
          </ActionBar>
        );
      }
    }



    const shouldShowLoadMore = books && books.length < totalSearchBooksCount;

    return (
      <div>
        { filtersComponent }
        { bulkDownloadComponent }
        {
          this.state.isDownloadModalVisible
          ?
          <BulkDownloadModal
            isVisible={this.state.isDownloadModalVisible}
            onCloseClicked={this.onCloseDownloadModal}
            bulkDownloadButtonClicked={this.bulkDownloadButtonClicked}
            booksSelected={this.state.checkedValues}
            downloadFormat={this.state.downloadFormat}
            books={books}
            downloadLimitReached={downloadLimitReached}
            onFormLinkClicked={this.onFormLinkClicked}
            confirmStoryFormat={fetchConfirmStoryFormatWorkflow}
            isfetchingConfirmBooksFormat={isfetchingConfirmBooksFormat}
          />
          :
          null
        }
        
        {
          isFetchingSearchBooks || !books
          ?
          <LoaderBlock />
          :
          (
            isBulkDownloadTabClicked && shouldShowBulkDownload
            ?
            <div>
              <SelectableGrid
                id="offline-book-selectable-grid"
                variant="2up-6up"
                roundedCorners
                onChange={this.onChangeCheckedValues}
                allSelected={this.state.allChecked}
                theme="primary"
                maxSelectAllowed={MAX_BULK_DOWNLOAD_BOOKS_COUNT}
              >
                {this.renderBookEls()}
              </SelectableGrid>

              {
                shouldShowLoadMore
                ?
                <Pagination
                  onClick={this.onLoadMore}
                  loading={this.props.isFetchingSearchMoreBooks}
                />
                :
                null
              }
              {
                totalSearchBooksCount
                ?
                null
                :
                <NoResults />
              }
            </div>
            :
            <div>
              <BookGridEl
                books={books}
                onReadClicked={this.onReadClicked}
                isFetchingAssets={isFetchingAssets}
                t={t}
              />
              {
                shouldShowLoadMore
                ?
                <Pagination
                  onClick={this.onLoadMore}
                  loading={this.props.isFetchingMoreBooks}
                />
                :
                null
              }
              {
                totalSearchBooksCount
                ?
                null
                :
                <NoResults />
              }
            </div>
          )
        }
      </div>
    );
  }
}

BooksSearchResultsContainer.propTypes = {
};

export default BooksSearchResultsContainer;
