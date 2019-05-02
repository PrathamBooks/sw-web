import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';

import Block from '../Block';
import BookCard from '../BookCard';
import FiltersBar from '../FiltersBar';
import FiltersPanel from '../FiltersPanel';
import Grid from '../Grid';
import PageHeader from '../PageHeader';
import ProfileCard from '../ProfileCard';
import Tab from '../Tab';
import Tabs from '../Tabs';

import { links } from '../../lib/constants';

import './Search.scss';

const Filters = ({viewport}) => {
  if (viewport.large) {
    return <FiltersBar noTopBorder/>
  } else {
    return <FiltersPanel />
  }
};

const Books = ({books}) => {
  return (
    <Grid variant="2up-6up">
      {
        books.map(book => {
          return (
            <BookCard book={book} />
          );
        })
      }
    </Grid>
  );
};

const Profiles = ({profiles}) => {
  return (
    <Grid variant="2up">
      {
        profiles.map(profile => {
          return (
            <ProfileCard
              title={profile.title}
              slug={profile.slug}
              imageUrl={profile.profileImage}
              type={profile.type}
              description={profile.description}
              />
          )
        })
      }
    </Grid>
  );
};

class Search extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-search';

    const {
      t,
      viewport,
      books,
      profiles
    } = this.props;

    const breadcrumbPaths = [{
      title: t('global.home'),
      href: links.home()
    }];

    const classes = {
      [baseClassName]: true
    };

    return (
      <div className={classNames(classes)}>
        <PageHeader title="“dragons planes”" breadcrumbPaths={breadcrumbPaths} />
        <Block noHorizontalPadding>
          <Tabs>
            <Tab title="Books">
              <Filters viewport={viewport}/>
              <Books books={books}/>
            </Tab>
            <Tab title="Lists">
              <Filters viewport={viewport}/>
              Lists
            </Tab>
            <Tab title="Images">
              <Filters viewport={viewport}/>
              Images
            </Tab>
            <Tab title="People">
              <Filters viewport={viewport}/>
              <Profiles profiles={profiles} />
            </Tab>
          </Tabs>
        </Block>
      </div>
    );
  }
}

Search.propTypes = {
  viewport: PropTypes.object,
  books: PropTypes.arrayOf(PropTypes.shape(BookCard.propTypes)),
  profiles: PropTypes.arrayOf(PropTypes.object)
};

export default translate()(Search);
