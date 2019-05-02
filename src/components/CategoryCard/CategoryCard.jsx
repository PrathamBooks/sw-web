import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';
import Img from '../Img';
import './CategoryCard.scss';
import SvgIcon from '../SvgIcon';

function toDashCase(str) {
  return str.replace(/[^A-Z0-9]+/ig, "-").toLowerCase();
}


class CategoryCard extends Component {

  static defaultProps = {}

  onClick = () => {
    this.props.categoryCardClicked(this.props.category);
  }

  render() {
    const baseClassName = "pb-category-card";
    const {
      category,
      categoryEngName,
      image,
      cardUrl
    } = this.props;

      return (
        <div className={baseClassName}>
          {
            <div className={`${baseClassName}__image-wrapper`}>
              <div className={`${baseClassName}__image`}>
                <Link href={cardUrl} onClick={this.onClick}>
                  <Img image={image} parentClassName={`${baseClassName}__img`} alt={category}/>
                  <div className={`${baseClassName}__image-overlay`}></div>
                  <div className={`${baseClassName}__content`}>
                    <div className={`${baseClassName}__icon`}>
                      <SvgIcon name={toDashCase(categoryEngName)} size="xl"/>
                    </div>
                    <h2 className={`${baseClassName}__title`}>{category}</h2>
                  </div>
                </Link>
              </div>
            </div>
          }
        </div>
      );
    }
  }

CategoryCard.propTypes = {
  category: PropTypes.string,
  image: PropTypes.shape(Img.propTypes.image)
};

export default CategoryCard;
