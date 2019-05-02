import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { flatMap, pick } from 'lodash';
import Pill from '../Pill';
import SelectField from '../SelectField';
import Inliner from '../Inliner';
import Caret from '../Caret';
import Picklist from '../Picklist';
import Dropdown from '../Dropdown';
import Link from '../Link';
import List from '../List';
import Stat from '../Stat';
import {  gaEventWhitelistedFilters } from '../../lib/constants';
import './FiltersBar.scss';

@translate()
class FiltersBar extends Component {
  static defaultProps = {
    resultsCount: 0
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

  render() {
    const baseClassName = 'pb-filters-bar';

    const {
      t,
      noTopBorder,
      isContentManager,
      pullUp,
      filters,
      levelSearchValue,
      styleSearchValue,
      typeSearchValue,
      publisherSearchValue,
      categorySearchValue,
      languageSearchValue,
      storyStatusSearchValue,
      storyTypeSearchValue,
      updateTypeSearchValue,
      updateLevelSearchValue,
      updateStyleSearchValue,
      updateCategorySearchValue,
      updatePublisherSearchValue,
      updateLanguageSearchValue,
      updateStoryStatusSearchValue,
      updateStoryTypeSearchValue,
      appliedFilters,
      resultsCount,
      sortOptions,
      applySortOption,
      appliedSortOption,
      bulkDownloadOptions,
      removeFilter,
      itemTypeLabel,
      readCount,
      disablePublisherFilter
    } = this.props;

    const { publisher, category, level, language, style, derivation_type, status, story_type } = filters;
    const filtersBarFilters = pick(appliedFilters, ['level', 'publisher', 'category', 'language', 'style', 'status' , 'derivation_type', 'story_type']);

    const shouldDisplayLevelSelector = (
      typeof filtersBarFilters.level !== 'undefined' &&
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

    const shouldDisplayTypeSelector = (
      typeof filtersBarFilters.story_type !== 'undefined' &&
      typeof filters.story_type !== 'undefined'
    );
    let typeOptions = [];
    if (story_type) {
      typeOptions = story_type.queryValues;
    }

    const shouldDisplayPublisherSelector = (
      typeof filtersBarFilters.publisher !== 'undefined' &&
      typeof filters.publisher !== 'undefined'
    );

    let publisherOptions = [];
    if (publisher) {
      publisherOptions = publisher.queryValues;
    }

    const shouldDisplayCategorySelector = (
      typeof filtersBarFilters.category !== 'undefined' &&
      typeof filters.category !== 'undefined'
    );
    let categoryOptions = [];
    if (category) {
      categoryOptions = category.queryValues;
    }

    const shouldDisplayLanguageSelector = (
      typeof filtersBarFilters.language !== 'undefined' &&
      typeof filters.language !== 'undefined'
    );

    let languageOptions = [];
    if (language) {
      languageOptions = language.queryValues;
    }

    const shouldDisplayStyleSelector = (
      typeof filtersBarFilters.style !== 'undefined' &&
      typeof filters.style !== 'undefined'
    );
    let styleOptions = [];
    if (style) {
      styleOptions = style.queryValues;
    }

    const shouldDisplayStoryStatusSelector = (
      typeof filtersBarFilters.status !== 'undefined' &&
      typeof filters.status !== 'undefined'
    );
    let storyStatusOptions = [];
    if (status) {
      storyStatusOptions = status.queryValues;

    }
    const shouldDisplayStoryTypeSelector = (
        typeof filtersBarFilters.derivation_type !== 'undefined' &&
        typeof filters.derivation_type !== 'undefined'
      );
      let storyTypeOptions = [];
      if (derivation_type) {
        storyTypeOptions = derivation_type.queryValues;
      
    }
    const hasFilters = flatMap(filtersBarFilters, filters => filters).length;
   
    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--no-top-border`]: noTopBorder,
      [`${baseClassName}--pull-up`]: pullUp,
      [`${baseClassName}--has-filter`]: hasFilters
    };

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__action-wrapper`}>
          <div className={`${baseClassName}__actions ${baseClassName}__actions--primary`}>
            <span className={`${baseClassName}__section-label`}>{t("global.filter-by")}:</span>
            <List inline>
              {
                shouldDisplayTypeSelector
                  ?
                  <Dropdown
                    align="left"
                    toggleEl={
                      <Link>{t("Book.type", 1)} <Caret parentClassName={`${baseClassName}__caret`} direction="down" /></Link>
                    }
                  >
                    <Picklist
                      id="filers-bar-story-types"
                      searchValue={typeSearchValue}
                      onSearchChange={updateTypeSearchValue}
                      options={typeOptions}
                      onChange={this.handlePicklistChange.bind(this, 'story_type')}
                      checkedValues={filtersBarFilters.story_type}
                    />
                  </Dropdown>
                  :
                  null
              }
              {
                shouldDisplayLevelSelector
                ?
                <Dropdown
                  align="left"
                  toggleEl={
                    <Link>{t("global.level", 2)} <Caret parentClassName={`${baseClassName}__caret`} direction="down" /></Link>
                  }
                  minWidth='xxl'
                >
                  <Picklist
                    id="filers-bar-levels"
                    searchValue={levelSearchValue}
                    onSearchChange={updateLevelSearchValue}
                    options={levelOptions}
                    onChange={this.handlePicklistChange.bind(this, 'level')}
                    checkedValues={filtersBarFilters.level}
                    hideSearchBar
                    fontWeight='bold'
                  />
                </Dropdown>
                :
                null
              }
              {
                shouldDisplayPublisherSelector
                ?
                <Dropdown
                  align="left"
                  disabled={disablePublisherFilter}
                  toggleEl={
                    <Link>{t("global.publisher", 2)} <Caret parentClassName={`${baseClassName}__caret`} direction="down" /></Link>
                  }
                >
                  <Picklist
                    id="filers-bar-publishers"
                    searchValue={publisherSearchValue}
                    onSearchChange={updatePublisherSearchValue}
                    options={publisherOptions}
                    onChange={this.handlePicklistChange.bind(this, 'publisher')}
                    checkedValues={filtersBarFilters.publisher}
                  />
                </Dropdown>
                :
                null
              }
              {
                shouldDisplayCategorySelector
                ?
                <Dropdown
                  align="left"
                  toggleEl={
                    <Link>{t("global.category", 2)} <Caret parentClassName={`${baseClassName}__caret`} direction="down" /></Link>
                  }
                >
                  <Picklist
                    id="filers-bar-categories"
                    searchValue={categorySearchValue}
                    onSearchChange={updateCategorySearchValue}
                    options={categoryOptions}
                    onChange={this.handlePicklistChange.bind(this, 'category')}
                    checkedValues={filtersBarFilters.category}
                  />
                </Dropdown>
                :
                null
              }
              {
                shouldDisplayLanguageSelector
                ?
                <Dropdown
                  align="left"
                  toggleEl={
                    <Link>{t("global.language", 2)} <Caret parentClassName={`${baseClassName}__caret`} direction="down" /></Link>
                  }
                >
                  <Picklist
                    id="filers-bar-languages"
                    searchValue={languageSearchValue}
                    onSearchChange={updateLanguageSearchValue}
                    options={languageOptions}
                    onChange={this.handlePicklistChange.bind(this, 'language')}
                    checkedValues={filtersBarFilters.language}
                  />
                </Dropdown>
                :
                null
              }
              {
                shouldDisplayStyleSelector
                ?
                <Dropdown
                  align="left"
                  toggleEl={
                    <Link>{t("global.style", 2)} <Caret parentClassName={`${baseClassName}__caret`} direction="down" /></Link>
                  }
                >
                  <Picklist
                    id="filers-bar-style"
                    searchValue={styleSearchValue}
                    onSearchChange={updateStyleSearchValue}
                    options={styleOptions}
                    onChange={this.handlePicklistChange.bind(this, 'style')}
                    checkedValues={filtersBarFilters.style}
                  />
                </Dropdown>
                :
                null
              }
              {
                (isContentManager && shouldDisplayStoryTypeSelector)
                ?
                <Dropdown
                  align="left"
                  toggleEl={
                    <Link>{t("global.story-type", 1)} <Caret parentClassName={`${baseClassName}__caret`} direction="down" /></Link>
                  }
                >
                  <Picklist
                    id="filers-bar-style"
                    searchValue={storyTypeSearchValue}
                    onSearchChange={updateStoryTypeSearchValue}
                    options={storyTypeOptions}
                    onChange={this.handlePicklistChange.bind(this, 'derivation_type')}
                    checkedValues={filtersBarFilters.derivation_type}
                  />
                </Dropdown>
                :
                null
              }
              {
                (isContentManager && shouldDisplayStoryStatusSelector )
                ?
                <Dropdown
                  align="left"
                  toggleEl={
                    <Link>{t("global.story-status", 1)} <Caret parentClassName={`${baseClassName}__caret`} direction="down" /></Link>
                  }
                >
                  <Picklist
                    id="filers-bar-style"
                    searchValue={storyStatusSearchValue}
                    onSearchChange={updateStoryStatusSearchValue}
                    options={storyStatusOptions}
                    onChange={this.handlePicklistChange.bind(this, 'status')}
                    checkedValues={filtersBarFilters.status}
                  />
                </Dropdown>
                :
                null
              }
              {
                bulkDownloadOptions
                ?
                <Dropdown
                  align="left"
                  toggleEl={
                    <Link>{t("global.bulk-download")} <Caret parentClassName={`${baseClassName}__caret`} direction="down" /></Link>
                  }
                >
                  <Picklist
                    id="filers-bar-bulk-download"
                    options={bulkDownloadOptions}
                    onChange={this.handlePicklistChange.bind(this, 'bulk_download')}
                    checkedValues={appliedFilters.bulk_download}
                    multiplePicks={false}
                  />
                </Dropdown>
                :
                null
              }
            </List>
          </div>
          {
            sortOptions
            ?
            <div className={`${baseClassName}__actions ${baseClassName}__actions--secondary`}>
              <span className={`${baseClassName}__section-label`}>{t("global.sort-by")}:</span>
              <Inliner isChildInput>
                <SelectField
                  value={appliedSortOption}
                  id="filters-bar-sort-by"
                  name="filters-bar-sort-by"
                  onChange={applySortOption}
                  options={sortOptions}
                />
              </Inliner>
            </div>
            :
            null
          }
        </div>
        <div className={`${baseClassName}__status`}>
          <span className={`${baseClassName}__count`}>
            {`${resultsCount === null ? 0 : resultsCount } ${itemTypeLabel}`}
          </span>
          {
            readCount
            ?
            (<Stat
              parentClassName={`${baseClassName}__read-count`}
              label={t('global.list-read', readCount)}
              value={readCount}
            />)
            :
            null
          }
          {
            hasFilters
            ?
            <span className={`${baseClassName}__section-label`}>{t("global.showing-only")}:</span>
            :
            null
          }
          {
            flatMap(filtersBarFilters, (appliedFiltersForType, type) => {
              return appliedFiltersForType.map(filter => {
                return (
                  <Pill
                    parentClassName={`${baseClassName}__pill`}
                    label={filters[type].queryValues.find(filterObj => filterObj.queryValue === filter).name}
                    onClose={removeFilter.bind(this, type, filter)}
                  />
                )
              })
            })
          }
          {
            appliedFilters.bulk_download
            ?
            <Pill
              parentClassName={`${baseClassName}__pill`}
              label={appliedFilters.bulk_download}
              onClose={removeFilter.bind(this, 'bulk_download', appliedFilters.bulk_download)}
            />
            :
            null
          }
        </div>
      </div>
    );
  }
}

FiltersBar.propTypes = {
  noTopBorder: PropTypes.bool,
  pullUp: PropTypes.bool
};

export default FiltersBar;
