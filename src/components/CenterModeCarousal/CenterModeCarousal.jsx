import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { translate } from 'react-polyglot';
import BookCard from "../BookCard";
import Button from "../Button";
import LoaderBlock from "../LoaderBlock";
import Link from "../Link";
import SvgIcon from "../SvgIcon";
import {sectionClicked} from '../../lib/constants';
import Slider from "react-slick";
import "./CenterModeCarousal.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { links, nextSuggestionsTypes} from '../../lib/constants';

function CustomArrow(props) {
  const { className, style, onClick, direction } = props;

  return (
    <div className={className} style={style} onClick={onClick}>
      <Link theme="dark">
        <SvgIcon
          name={direction === "next" ? "chevron-right" : "chevron-left"}
        />
      </Link>
    </div>
  );
}

class CenterModeCarousal extends Component {
  static defaultProps = {
    nextSuggestionsType: nextSuggestionsTypes.nextRead
  }
  constructor(props) {
    super(props);

    this.state = {
      suggestedBooks: this.props.books,
      currentCardIdx: 0
    };
  }

  onReadClicked(book, sectionClicked) {
    this.props.nextSuggestionsType === nextSuggestionsTypes.nextTranslation
    ?
    window.location.href = links.translateBookToLanguage(book.slug, this.props.translateToLanguage)
    :
    this.props.onReadClicked(book, sectionClicked);
  }

  render() {
    const baseClassName = "pb-center-mode-carousal";
    const {
      t,
      parentClassName,
      isFetchingBookAssets,
      viewport,
      nextSuggestionsType
    } = this.props;
    const { suggestedBooks, currentCardIdx } = this.state;

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName
    };
    let settings = {
      className: "center",
      centerMode: true,
      infinite: true,
      slidesToShow: 1,
      speed: 500,
      nextArrow: <CustomArrow direction={"next"} />,
      prevArrow: <CustomArrow direction={"prev"} />,
      beforeChange: (currentIdx, nextIdx) => setTimeout(() => { this.setState({ currentCardIdx: nextIdx })} , 250) 
    };

    if (viewport.medium) {
      settings.slidesToShow = 3;
    }

    let simBookEls, bookTitle, bookDesc;

    if (suggestedBooks.length > 0) {
      simBookEls = suggestedBooks.map((book, index) => {
        return (
          <div
            className={currentCardIdx !== index ? `${baseClassName}__card` : ""}
            key={book.id}
          >  
            <BookCard
              hasLightOverlay={currentCardIdx !== index}
              shouldDisplayMenu={false}
              key={book.id}
              book={book}
              onClick={() => this.onReadClicked(book, sectionClicked.nextReadCard)}
            />
          </div>
        );
      });
      bookTitle = suggestedBooks[currentCardIdx].title;
      bookDesc = suggestedBooks[currentCardIdx].description;
    } else {
      simBookEls = <LoaderBlock />;
    }
    let title;
    if (nextSuggestionsType === nextSuggestionsTypes.nextRead) {
      title = <h1 className={`${baseClassName}__title`}>{t("Book.next-read-title")}</h1>
    }
    else {
      title = <h1 className={`${baseClassName}__title`}>
        {t("Translate.next-translation-title")}</h1>
    }
    return (
      <div className={classNames(classes)}>
        {title}
        <div className={`${baseClassName}__container`}>
          <Slider {...settings}> {simBookEls} </Slider>
          <div className={`${baseClassName}__card-desc`}>
            <div className={`${baseClassName}__card-title`}>{bookTitle}</div>
            <div className={`${baseClassName}__card-summary`}>{bookDesc}</div>
            <div className={`${baseClassName}__cta-wrapper`}>
              <Button
                fullWidth
                label={nextSuggestionsType === nextSuggestionsTypes.nextRead ? t("Book.read") : t("global.translate")}
                variant="primary"
                loading={isFetchingBookAssets}
                onClick={() => this.onReadClicked(suggestedBooks[currentCardIdx], sectionClicked.nextReadButton)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CenterModeCarousal.propTypes = {
  parentClassName: PropTypes.string,
  nextSuggestionsType: PropTypes.string,
  onReadClicked: PropTypes.func
};
export default translate()(CenterModeCarousal);