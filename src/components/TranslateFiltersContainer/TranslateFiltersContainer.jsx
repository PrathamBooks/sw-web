import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';

import FiltersBar from '../FiltersBar';
import FiltersPanel from '../FiltersPanel';
import Block from '../Block';
import { gaEventCategories} from '../../lib/constants';
import { recordGaEvents } from '../../redux/googleAnalyticsActions';
import { applyFilter, removeFilter, clearFilter } from '../../redux/translateActions'

const mapStateToProps = ({ translate , viewport , user}) => {
  return {
    appliedFilters: translate.appliedFilters,
    filters: translate.filters,
    metadata: translate.metadata,
    userEmail: user.profile.email,
    viewport
  }
}

const mapDispatchToProps = {
  applyFilter,
  removeFilter,
  clearFilter,
  recordGaEvents
}

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class TranslateFiltersContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      levelSearchValue: '',
      publisherSearchValue: '',
      categorySearchValue: ''
    };
  }

  updateLevelSearchValue = (event) => {
    this.setState({
      levelSearchValue: event.target.value
    })
  }

  updatePublisherSearchValue = (event) => {
    this.setState({
      publisherSearchValue: event.target.value
    })
  }

  updateCategorySearchValue = (event) => {
    this.setState({
      categorySearchValue: event.target.value
    })
  }

  render() {
    const { filters, viewport, applyFilter, removeFilter, clearFilter, appliedFilters, metadata, t , recordGaEvents, userEmail} = this.props;
    const { levelSearchValue, publisherSearchValue, categorySearchValue } = this.state;

    return (
      <Block>
        {
          viewport.medium
          ?
          <FiltersBar
            noTopBorder={true}
            filters={filters}
            levelSearchValue={levelSearchValue}
            publisherSearchValue={publisherSearchValue}
            categorySearchValue={categorySearchValue}
            updateLevelSearchValue={this.updateLevelSearchValue}
            updateCategorySearchValue={this.updateCategorySearchValue}
            updatePublisherSearchValue={this.updatePublisherSearchValue}
            applyFilter={applyFilter}
            removeFilter={removeFilter}
            appliedFilters={appliedFilters}
            userEmail={userEmail}
            recordGaEvents={recordGaEvents}
            gaEventCategoryType={gaEventCategories.filterTranslate}
            resultsCount={metadata.hits}
            itemTypeLabel={t('global.story', metadata.hits)}
          />
          :

          <FiltersPanel
            viewport={viewport}
            filters={filters}
            levelSearchValue={levelSearchValue}
            publisherSearchValue={publisherSearchValue}
            categorySearchValue={categorySearchValue}
            updateLevelSearchValue={this.updateLevelSearchValue}
            updateCategorySearchValue={this.updateCategorySearchValue}
            updatePublisherSearchValue={this.updatePublisherSearchValue}
            applyFilter={applyFilter}
            removeFilter={removeFilter}
            clearFilter={clearFilter}
            appliedFilters={appliedFilters}
            gaEventCategoryType={gaEventCategories.filterTranslate}
            userEmail={userEmail}
            recordGaEvents={recordGaEvents}
            resultsCount={metadata.hits}
            itemTypeLabel={t('global.story', metadata.hits)}
          />
        }
      </Block>
    );
  }
}

export default TranslateFiltersContainer;
