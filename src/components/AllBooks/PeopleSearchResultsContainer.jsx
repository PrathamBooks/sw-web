import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import { isEqual } from 'lodash';

import LoaderBlock from '../LoaderBlock';
import Pagination from '../Pagination';
import ProfileCard from '../ProfileCard';
import Grid from '../Grid';

import { fetchSearchPeopleWorkflow } from '../../redux/expandedSearchActions';
import { profileTypes } from '../../lib/constants';

import './PeopleSearchResultsContainer.scss';


const PeopleGridEl = ({ people }) => {
  const peopleEls = people.map(person => {
    return (
      <ProfileCard
        key={person.slug}
        type={person.type}
        title={person.name}
        imageUrl={person.profileImage}
        slug={person.slug}
      />
    );
  });

  return <Grid variant="2up">{peopleEls}</Grid>
};


// TODO: Move this out or fix it.
const NoResults = translate()(({ t }) => (
  <span>
    <p>{t("global.no-result-warning-1")}</p>
    <p>{t("global.no-result-warning-2")}</p>
    <ul>
      <li>{t("global.no-result-warning-3")}</li>
      <li>{t("global.no-result-warning-4")}</li>
      <li>{t("global.no-result-warning-5")}</li>
      <li>{t("global.no-result-warning-6")}</li>
    </ul>
  </span>
));


const mapDispatchToProps = {
    fetchSearchPeopleWorkflow,
};

const mapStateToProps = ({ expandedSearch, viewport, allFilters }) => ({
  ...expandedSearch,
  viewport,
  appliedFilters: allFilters[ allFilters.filterType ] // people/organisation different filters select from redux
});

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class PeopleSearchResultsContainer extends Component {
  static defaultProps = {
    variant: profileTypes.USER
  }

  onLoadMore = () => this.props.fetchSearchPeopleWorkflow(
    this.props.variant,
    this.props.appliedFilters,
    this.props.loadedPages + 1
  );

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.appliedFilters, nextProps.appliedFilters)) {
      this.props.fetchSearchPeopleWorkflow(nextProps.variant, nextProps.appliedFilters);
    }
  }

  componentDidMount() {
    const {
      fetchSearchPeopleWorkflow,
      appliedFilters,
      variant,
    } = this.props;

    fetchSearchPeopleWorkflow(variant, appliedFilters);
  }

  render() {
    const {
      t,
      isFetchingSearchPeople,
      people,
      totalSearchUsersCount,
      variant,
    } = this.props;

    const baseClassName = 'pb-people-search-results';

    // TODO: nested ternary operators are BAD!
    const shouldShowLoadMore = people && people.length !== 0 ? (people.length < totalSearchUsersCount ? true : false) : false;

    let countLabel = totalSearchUsersCount;
    if (variant === profileTypes.USER) {
      countLabel += ` ${t('global.person', totalSearchUsersCount)}`;
    } else if (variant === profileTypes.ORGANISATION) {
      countLabel += ` ${t('global.organisation', totalSearchUsersCount)}`;
    }

    return (
      <div>
        {
          isFetchingSearchPeople || !people
          ?
          <LoaderBlock />
          :
          <div>
            <div className={`${baseClassName}__status`}>
              <div className={`${baseClassName}__count`}>
                { countLabel }
              </div>
            </div>
            <PeopleGridEl people={people}/>
            {
              shouldShowLoadMore
              ?
              <Pagination
                onClick={this.onLoadMore}
                loading={this.props.isFetchingMorePeople}
              />
              :
              null
            }
            {
              totalSearchUsersCount
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

PeopleSearchResultsContainer.propTypes = {
};

export default PeopleSearchResultsContainer;
