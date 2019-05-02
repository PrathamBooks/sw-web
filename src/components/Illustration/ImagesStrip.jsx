import React from 'react';

import Block from '../Block';
import CardsCarousel from '../CardsCarousel';
import ImgCanvas from '../ImgCanvas';
import Link from '../Link';

import { links } from '../../lib/constants';

const ImagesStrip = ({
  baseClassName,
  t,
  collection,
  currentIndex,
  viewport
}) => {
  if (collection && collection.length > 0) {
    return (
      <Block noHorizontalPadding noVerticalPadding>
        <CardsCarousel
          viewport={viewport}
          cardsInFrame={{
            small: 4,
            medium: 8,
            large: 12,
          }}
          highlightCurrent
          currentIndex={currentIndex}
          >
            {
              collection.map((image, i) => {
                return (
                  <Link
                    isInternal
                    href={links.image(image.slug)}>
                    <ImgCanvas
                      key={i}
                      image={image.image}
                      alt={image.title}
                      />
                  </Link>
                );
              })
            }
        </CardsCarousel>
      </Block>
    );
  }

  return null;
};

export default ImagesStrip;
