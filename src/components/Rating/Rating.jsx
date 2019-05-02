import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SvgIcon from '../SvgIcon';
import './Rating.scss';

class Rating extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rating: this.props.rating || null,
      temp_rating: null
    };
  }
  rate(ratings) {
    this.setState({ rating: ratings, temp_rating: ratings });
  }

  star_over(ratings) {
    this.setState({ rating: ratings, temp_rating: this.state.rating });
  }

  star_out() {
    this.setState({ rating: this.state.temp_rating });
  }

  render() {
    const baseClassName = 'pb-rating';

    const { parentClassName, disabled } = this.props;

    let stars = [];

    for (let i = 0; i < 5; i++) {
      let klass = 'pb-rating__star';

      if (this.state.rating > i && this.state.rating != null) {
        klass += ' is-selected';
      }

      stars.push(
        <span
          className={klass}
          // onClick={this.rate.bind(this, i)}
          // onMouseOver={this.star_over.bind(this, i)}
          // onMouseOut={this.star_out.bind(this)}
        >
          <SvgIcon name="grey-star" size="m" pushRight/>
        </span>
      );
    }

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName,
      [`${baseClassName}--disabled`]: disabled
    }

    return (
      <div className={classNames(classes)}>
        {stars}
      </div>
    );
  }

}

Rating.propTypes = {
  disabled: PropTypes.bool
};

export default Rating;
