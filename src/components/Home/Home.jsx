import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import DocumentTitle from 'react-document-title';

import Block from '../Block';
import BlogPosts from '../BlogPosts';
import BookCard from '../BookCard';
import ContentStyler from '../ContentStyler';
import Grid from '../Grid';
import BookShelf from '../BookShelf';
import SectionCallToAction from '../SectionCallToAction';
import Tab from '../Tab';
import Tabs from '../Tabs';
import HeroCarousel from '../HeroCarousel';
import StatsBar from '../StatsBar';
import CategoryContainer from '../CategoryContainer';
import { links, sortOptions, sectionClicked } from '../../lib/constants';
import StructuredDataMarkup from './StructuredDataMarkup';

import './Home.scss';

const BooksGridEl = ({ books, horizontal, viewport, isFetchingAssets, onReadClicked, t, sectionClicked }) => {
  if (!books || books.length === 0) {
    return null;
  }

  const bookEls = books.map(book => {
    return (
      <BookCard key={book.id} book={book} sectionClicked={sectionClicked}/>
    );
  });

  if (horizontal) {
    return (
      <BookShelf
        viewport={viewport}
        books={books}
        isFetchingAssets={isFetchingAssets}
        onReadClicked={onReadClicked}
        sectionClicked={sectionClicked}
      />
    )
  }

  return <Grid variant="2up-6up">{bookEls}</Grid>
};

const BookSelectionsEl = (props) => {
  const {
    t,
    editorsPick,
    newArrivals,
    mostRead,
    viewport,
    onReadClicked,
    isFetchingAssets,
  } = props;

  return (
    <div>
      <Block background="transparent">
      </Block>
      <Block noHorizontalPadding noVerticalPadding>
        <Tabs align="left" noPadding>
          <Tab title={t("global.editors-pick", 2)} key="editors-pick">
            <BooksGridEl
              books={editorsPick.results}
              viewport={viewport}
              t={t}
              onReadClicked={onReadClicked}
              isFetchingAssets={isFetchingAssets}
              sectionClicked={sectionClicked.editorPicks}
            />
            <SectionCallToAction
              label={`${t("global.view-all-editors-picks")}`}
              href={links.allBooks(sortOptions.editorsPicks)}
              isInternal
            />
          </Tab>
          <Tab title={t("global.most-read")} key="most-read">
            <BooksGridEl
              books={mostRead.results}
              viewport={viewport}
              t={t}
              onReadClicked={onReadClicked}
              isFetchingAssets={isFetchingAssets}
              sectionClicked={sectionClicked.mostReads}
            />
            <SectionCallToAction
              label={`${t("global.view-all-most-read")}`}
              href={links.allBooks(sortOptions.mostRead)}
              isInternal
            />
          </Tab>
          <Tab title={t("global.new-arrival", 2)} key="new-arrivals">
            <BooksGridEl
              books={newArrivals.results}
              viewport={viewport}
              t={t}
              onReadClicked={onReadClicked}
              isFetchingAssets={isFetchingAssets}
              sectionClicked={sectionClicked.newArrivals}
            />
            <SectionCallToAction
              label={`${t("global.view-all-new-arrivals")}`}
              href={links.allBooks(sortOptions.newArrivals)}
              isInternal
            />
          </Tab>
        </Tabs>
      </Block>
    </div>
  );
};

const BookSuggestionsEl = (props) => {
  const { t, books, viewport, onReadClicked, isFetchingAssets, hasUserHistory } = props;

  // This is only for signed-in users
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div>
      <Block background="transparent">
        <ContentStyler>
          <h3>{hasUserHistory ? t("Home.book-suggestions-title") : t("Home.book-suggestions-title-no-history")}</h3>
        </ContentStyler>
      </Block>
      <Block noHorizontalPadding noVerticalPadding background="transparent">
        <BooksGridEl
          horizontal
          books={books}
          viewport={viewport}
          t={t}
          onReadClicked={onReadClicked}
          isFetchingAssets={isFetchingAssets}
          sectionClicked={sectionClicked.homeRecommendation}
        />
      </Block>
    </div>
  );
};


const BookCategoriesEl = () => {
    return (
      <div>
        <Block noHorizontalPadding background="transparent">
          <CategoryContainer
          />
        </Block>
      </div>
    );
  };


const StatsBarEl = ({t, baseClassName, statistics}) => {
  const statsArray = [];

  if (statistics) {
    if (statistics.storiesCount) {
      statsArray.push({
        label: t('global.story', statistics.storiesCount),
        value: statistics.storiesCount
      });
    }

    if (statistics.readsCount) {
      statsArray.push({
        label: t('global.read-home', statistics.readsCount),
        value: statistics.readsCount
      });
    }

    if (statistics.languagesCount) {
      statsArray.push({
        label: t('global.language', statistics.languagesCount),
        value: statistics.languagesCount
      });
    }
  }

  return <StatsBar stats={statsArray} />
};

@translate()
class Home extends Component {

  render() {
    const baseClassName = 'pb-home';

    const {
      t,
      heroCarouselSlides,
      editorsPick,
      newArrivals,
      mostRead,
      blogPosts,
      bookSuggestions,
      viewport,
      isFetchingAssets,
      hasUserHistory,
      statistics
    } = this.props;

    const classes = {
      [baseClassName]: true
    };

    return (
      <div className={classNames(classes)}>
        <DocumentTitle title={`${t('global.site-title')}`} />
        <StructuredDataMarkup />
        <HeroCarousel
          slides={heroCarouselSlides}
          wrapAround
          autoplay
          />
        <StatsBarEl
          t={t}
          baseClassName={baseClassName}
          statistics={statistics}
          />
        <BookSuggestionsEl
          t={t}
          baseClassName={baseClassName}
          books={bookSuggestions}
          viewport={viewport}
          onReadClicked={this.onReadClicked}
          isFetchingAssets={isFetchingAssets}
          hasUserHistory={hasUserHistory}
        />
        <BookSelectionsEl
          t={t}
          baseClassName={baseClassName}
          editorsPick={editorsPick}
          newArrivals={newArrivals}
          mostRead={mostRead}
          viewport={viewport}
          onReadClicked={this.onReadClicked}
          isFetchingAssets={isFetchingAssets}
        />
        <BookCategoriesEl
          t={t}
          baseClassName={baseClassName}
          viewport={viewport}
          isFetchingAssets={isFetchingAssets}
        />
        <BlogPosts posts={blogPosts} />
      </div>
    );
  }
}

Home.propTypes = {
  viewport: PropTypes.object,
  heroCarouselSlides: PropTypes.array,
  blogPosts: PropTypes.array,
  bookSuggestions: PropTypes.arrayOf(PropTypes.shape(BookCard.propTypes)),
  bookSelections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    href: PropTypes.string,
    isInternal: PropTypes.bool,
    books: PropTypes.arrayOf(PropTypes.shape(BookCard.propTypes))
  })),
  hasUserHistory: PropTypes.bool,
  statistics: PropTypes.object
};

export default Home;
