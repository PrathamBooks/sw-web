import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoaderBlock from '../LoaderBlock';
import CategoryCard from '../CategoryCard';
import {fetchCardsWorkflow} from '../../redux/homeActions';
import { recordGaEvents } from '../../redux/googleAnalyticsActions';
import {
  gaEventCategories,
  gaEventActions
} from '../../lib/constants';
import './CategoryContainer.scss';
import HorizontalGrid from '../HorizontalGrid';
import Grid from '../Grid';

const mapStateToProps = ({ viewport, home, user }) => {
  return {
    viewport: viewport,
    cards: home.homeCards,
    profile: user.profile
  }
}

const mapDispatchToProps = {
  fetchCardsWorkflow,
  recordGaEvents
};


class CategoryContainer extends Component {

  componentDidMount() {
    this.props.fetchCardsWorkflow();
  }

  categoryCardClicked = (categoryCard) => 
    this.props.recordGaEvents({
      eventCategory: gaEventCategories.categoryCard,
      eventAction: gaEventActions.opened,
      userEmail: this.props.profile.email,
      eventLabel: categoryCard
    });

  render() {
    const {
      viewport,
      cards      
    } = this.props;


    if (!cards || cards.length === 0 ) {
      return <LoaderBlock />;
    }
    else{
      const baseClassName = "pb-category-container";
      return (
        <div className={baseClassName}>
          {
            viewport.medium
            ?
            <Grid variant="3up">
              {cards.map((category) => {
                return (
                  <div key={ category.name }>
                    <CategoryCard
                      category={category.name}
                      categoryEngName={category.queryValue}
                      image={category.imageUrls}
                      categoryCardClicked={this.categoryCardClicked}
                      cardUrl={category.cardUrl}
                    />
                  </div>
                );
              })}
            </Grid>
            :
            <HorizontalGrid rows={1} cellWidth="category-card">
              {cards.map((category) => {
                return (
                  <div key={ category.name }>
                    <CategoryCard
                      category={category.name}
                      categoryEngName={category.queryValue}
                      image={category.imageUrls}
                      categoryCardClicked={this.categoryCardClicked}
                      cardUrl={category.cardUrl}
                    />
                  </div>
                );
              })}
            </HorizontalGrid>
          }
        </div>
      );
    }
  }
}

CategoryContainer.propTypes = {
  categories: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryContainer);
