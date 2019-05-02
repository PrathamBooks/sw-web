import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import PropTypes from 'prop-types';
import { flatMap, pick } from 'lodash';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import FloatingButton from '../FloatingButton';
import Modal from '../Modal';
import Picklist from '../Picklist';
import RadioGroup from '../RadioGroup';
import Tab from '../Tab';
import Tabs from '../Tabs';
import ToggleSwitch from '../ToggleSwitch';
import { gaEventWhitelistedFilters} from '../../lib/constants';
import './FiltersPanel.scss';

const sortAppliedOptions = (appliedOptions, options) => {

  let updatedOptions = options;
  if (appliedOptions && appliedOptions.length !== 0) {
    let updatedAppliedOptions = options.filter( ( option ) => appliedOptions.includes( option.queryValue ) );
    updatedOptions = options.filter( ( option ) => !appliedOptions.includes( option.queryValue ) );
    updatedOptions =  [...updatedAppliedOptions, ...updatedOptions];
  }
  return updatedOptions;
};


@translate()
class FiltersPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      showFilters: true
    };
  }

  openPanel = () => {
    this.setState({
      open: true
    });
  }

  closePanel = () => {
    this.setState({
      open: false
    });
  }

  handleToggle = val => {
    this.setState({
      showFilters: !val
    });
  }

  handlePicklistChange = (type, value, checked) => {
    const {
      applyFilter,
      removeFilter,
      appliedFilters
    } = this.props;

    if (checked) {
      applyFilter(type, value);
      //  we only want these selected filters for different pages so picking them
      const selectedFilters = pick(appliedFilters, gaEventWhitelistedFilters);
      // for GA event label we only want filter name like publisher , languge so we need to select only key of selectedFilters not from applied filters
      const gaEventFilterKey = Object.keys(selectedFilters).find(key => key === type);
      // for GA event action we need filter values like english , hindi and so on , so we only need values in an alphabetical order 
      const gaEventFilterValues = flatMap(selectedFilters[type], filters => filters);
      const gaEventFilterValuesArray = gaEventFilterValues.concat(value).sort().join(',')
      // for different pages use different GA event category type
      if (this.props.recordGaEvents && gaEventFilterKey) {
        this.props.recordGaEvents({
          eventCategory: this.props.gaEventCategoryType,
          eventAction: gaEventFilterValuesArray, 
          eventLabel: gaEventFilterKey,
          userEmail: this.props.userEmail,
        })
      }
    } else {
      removeFilter(type, value);
    }
  }

  handlePicklistClear = (type) => {
    this.props.clearFilter(type);
  }


  render() {
    const baseClassName = 'pb-filters-panel';
    const classNames = [baseClassName];

    const {
      t,
      filters,
      isContentManager,
      typeSearchValue,
      levelSearchValue,
      publisherSearchValue,
      categorySearchValue,
      languageSearchValue,
      styleSearchValue,
      storyTypeSearchValue,
      storyStatusSearchValue,
      updateTypeSearchValue,
      updateLevelSearchValue,
      updateCategorySearchValue,
      updatePublisherSearchValue,
      updateLanguageSearchValue,
      updateStyleSearchValue,
      updateStoryStatusSearchValue,
      updateStoryTypeSearchValue,
      appliedFilters,
      viewport,
      sortOptions,
      applySortOption,
      appliedSortOption,
      bulkDownloadOptions,
      resultsCount,
      itemTypeLabel,
      disablePublisherFilter,
      clearFilter
    } = this.props;


    const { publisher, category, level, language, style , derivation_type , status, story_type } = filters;

    const shouldDisplayLevelSelector = (
      typeof appliedFilters.level !== 'undefined' &&
      typeof filters.level !== 'undefined'
    );
    let levelOptions = [];
    if (level) {
      levelOptions = level.queryValues;
    }

    levelOptions = levelOptions.map(levelOption => {
      return (
        {
          name: levelOption.name,
          legend: levelOption.description,
          queryValue: levelOption.queryValue
        }
      )
    });

    levelOptions = sortAppliedOptions(appliedFilters.level, levelOptions);


    const shouldDisplayTypeSelector = (
      typeof appliedFilters.story_type !== 'undefined' &&
      typeof filters.story_type !== 'undefined'
    );
    let typeOptions = [];
    if (story_type) {
      typeOptions = story_type.queryValues;
    }

    typeOptions = sortAppliedOptions(appliedFilters.story_type, typeOptions);

    const shouldDisplayPublisherSelector = (
      typeof appliedFilters.publisher !== 'undefined' &&
      typeof filters.publisher !== 'undefined'
    );
    let publisherOptions = [];
    if (publisher) {
      publisherOptions = publisher.queryValues;
    }

    publisherOptions = sortAppliedOptions(appliedFilters.publisher, publisherOptions);

    const shouldDisplayCategorySelector = (
      typeof appliedFilters.category !== 'undefined' &&
      typeof filters.category !== 'undefined'
    );
    let categoryOptions = [];
    if (category) {
      categoryOptions = category.queryValues;
    }

    categoryOptions = sortAppliedOptions(appliedFilters.category, categoryOptions);

    const shouldDisplayLanguagesSelector = (
      typeof appliedFilters.language !== 'undefined' &&
      typeof filters.language !== 'undefined'
    );
    let languageOptions = [];
    if (language) {
      languageOptions = language.queryValues;
    }

    languageOptions = sortAppliedOptions(appliedFilters.language, languageOptions);

    const shouldDisplayStyleSelector = (
      typeof appliedFilters.style !== 'undefined' &&
      typeof filters.style !== 'undefined'
    );
    let styleOptions = [];
    if (style) {
      styleOptions = style.queryValues;
    }
    
    const shouldDisplayStoryStatusSelector = (
      typeof appliedFilters.status !== 'undefined' &&
      typeof filters.status !== 'undefined'
    );
    let storyStatusOptions = [];
    if (status) {
      storyStatusOptions = status.queryValues;
    }
    
    const shouldDisplayStoryTypeSelector = (
        typeof appliedFilters.derivation_type !== 'undefined' &&
        typeof filters.derivation_type !== 'undefined'
      );
      let storyTypeOptions = [];
      if (derivation_type) {
        storyTypeOptions = derivation_type.queryValues;
    }

    styleOptions = sortAppliedOptions(appliedFilters.style, styleOptions);

    const userVisibleFilters = ['publisher', 'category', 'level', 'language', 'style', 'status', 'derivation_type','story_type'];
    const filtersCount = flatMap(pick(appliedFilters, userVisibleFilters), f => f).length;
    let panelEl = <FloatingButton count={filtersCount} icon="filter" onClick={this.openPanel}/>;
    if (this.state.open) {
      const modalFooterEl = (
        <ButtonGroup mergeTop mergeBottom={!viewport.large} mergeSides>
          <Button fullWidth label="Close" variant="primary" onClick={this.closePanel}/>
        </ButtonGroup>
      );

      const modalHeaderEl = <ToggleSwitch
        id="filters-panel-toggle"
        defaultOn={!this.state.showFilters}
        offLabel={t("global.filter", 1)}
        onChange={this.handleToggle}
        onLabel={t("global.sort")}/>;

      const filtersPane = (
        <div className={`${baseClassName}__filters`}>
          <Tabs
            parentClassName={`${baseClassName}__filter-tabs`}
            fitHeight>
            {
              shouldDisplayTypeSelector
                ?
                <Tab title={t("Book.type", 1)}>
                  <Picklist
                    id="storybook-picklist"
                    searchValue={typeSearchValue}
                    onSearchChange={updateTypeSearchValue}
                    options={typeOptions}
                    onChange={this.handlePicklistChange.bind(this, 'story_type')}
                    onClear={clearFilter ? this.handlePicklistClear.bind(this, 'story_type') : null}
                    checkedValues={appliedFilters.story_type}
                  />
                </Tab>
                :
                null
            }
            {
              shouldDisplayLevelSelector
              ?
              <Tab title={t("global.level", 2)}>
                <Picklist
                  id="storybook-picklist"
                  searchValue={levelSearchValue}
                  onSearchChange={updateLevelSearchValue}
                  options={levelOptions}
                  onChange={this.handlePicklistChange.bind(this, 'level')}
                  onClear={clearFilter ? this.handlePicklistClear.bind(this, 'level') : null}
                  checkedValues={appliedFilters.level}
                  fontWeight='bold'
                />
              </Tab>
              :
              null
            }
            {
              shouldDisplayPublisherSelector
              ?
              <Tab title={t("global.publisher", 2)} disabled={disablePublisherFilter}>
                <Picklist
                  id="storybook-picklist"
                  disabled={disablePublisherFilter}
                  searchValue={publisherSearchValue}
                  onSearchChange={updatePublisherSearchValue}
                  options={publisherOptions}
                  onChange={this.handlePicklistChange.bind(this, 'publisher')}
                  onClear={clearFilter ? this.handlePicklistClear.bind(this, 'publisher') : null}
                  checkedValues={appliedFilters.publisher}
                />
              </Tab>
              :
              null
            }
            {
              shouldDisplayCategorySelector
              ?
              <Tab title={t("global.category", 2)}>
                <Picklist
                  id="storybook-picklist"
                  searchValue={categorySearchValue}
                  onSearchChange={updateCategorySearchValue}
                  options={categoryOptions}
                  onChange={this.handlePicklistChange.bind(this, 'category')}
                  onClear={clearFilter ? this.handlePicklistClear.bind(this, 'category') : null}
                  checkedValues={appliedFilters.category}
                />
              </Tab>
              :
              null
            }
            {
              shouldDisplayLanguagesSelector
              ?
              <Tab title={t("global.language", 2)}>
                <Picklist
                  id="storybook-picklist"
                  searchValue={languageSearchValue}
                  onSearchChange={updateLanguageSearchValue}
                  options={languageOptions}
                  onChange={this.handlePicklistChange.bind(this, 'language')}
                  onClear={clearFilter ? this.handlePicklistClear.bind(this, 'language') : null}
                  checkedValues={appliedFilters.language}
                />
              </Tab>
              :
              null
            }
            {
              shouldDisplayStyleSelector
              ?
              <Tab title={t("global.style", 2)}>
                <Picklist
                  id="storybook-picklist"
                  searchValue={styleSearchValue}
                  onSearchChange={updateStyleSearchValue}
                  options={styleOptions}
                  onChange={this.handlePicklistChange.bind(this, 'style')}
                  onClear={clearFilter ? this.handlePicklistClear.bind(this, 'style') : null}
                  checkedValues={appliedFilters.style}
                />
              </Tab>
              :
              null
            }
            {
                (isContentManager && shouldDisplayStoryTypeSelector )
                ?
                <Tab title={t("global.story-type", 1)} >
                  <Picklist
                    id="storybook-picklist"
                    searchValue={storyTypeSearchValue}
                    onSearchChange={updateStoryTypeSearchValue}
                    options={storyTypeOptions}
                    onChange={this.handlePicklistChange.bind(this, 'derivation_type')}
                    checkedValues={appliedFilters.derivation_type}
                  />
                </Tab>
                :
                null
            }
            {
                (isContentManager && shouldDisplayStoryStatusSelector )
                ?
                <Tab title={t("global.story-status", 1)}>
                  <Picklist
                    id="storybook-picklist"
                    searchValue={storyStatusSearchValue}
                    onSearchChange={updateStoryStatusSearchValue}
                    options={storyStatusOptions}
                    onChange={this.handlePicklistChange.bind(this, 'status')}
                    checkedValues={appliedFilters.status}
                  />
                </Tab>
                :
                null
            }
            {
              bulkDownloadOptions
              ?
              <Tab title={t("global.bulk-download")}>
                <Picklist
                  id="storybook-picklist"
                  options={bulkDownloadOptions}
                  onChange={this.handlePicklistChange.bind(this, 'bulk_download')}
                  checkedValues={appliedFilters.bulk_download}
                  onClear={clearFilter ? this.handlePicklistClear.bind(this, 'bulk_download') : null}
                  multiplePicks={false}
                />
              </Tab>
              :
              null
            }
          </Tabs>
        </div>
      );

      const sortPane = (
        <RadioGroup
          defaultValue={appliedSortOption}
          id="filters-panel-sort-by"
          name="filters-panel-sort-by"
          onChange={applySortOption}
          radios={sortOptions}
        />
      );

      panelEl = (
        <Modal
          footer={modalFooterEl}
          header={sortOptions ? modalHeaderEl : null }
          noContentPadding={this.state.showFilters}
          noContentScroll
          fillViewport>
          {
            this.state.showFilters
            ?
            filtersPane
            :
            sortPane
          }
        </Modal>
      );
    }

    return (
      <div className={classNames.join(' ')}>
        <div className={`${baseClassName}__status`}>
          <span className={`${baseClassName}__count`}>
            {`${resultsCount === null ? 0 : resultsCount} ${itemTypeLabel}`}
          </span>
        </div>
        {panelEl}
      </div>
    );
  }
}

FiltersPanel.propTypes = {
  viewport: PropTypes.object.isRequired
};

export default FiltersPanel;