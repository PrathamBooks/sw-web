import React from 'react';
import { uniq } from 'lodash';

import CollapsibleSection from '../CollapsibleSection';
import Link from '../Link';
import List from '../List';
import Sizer from '../Sizer';
import SvgIcon from '../SvgIcon';
import LazyFontLoader from '../LazyFontLoader';

import { links } from '../../lib/constants';


export default ({ translations, versionCount, languageCount, offline, t }) => {
  let el = null;
  let recommendedTranslations = [];
  let nonRecommendedTranslations = [];
  let orderedTranslations = [];

  translations.forEach((translation) => {
    translation.recommended ? recommendedTranslations.push(translation) : nonRecommendedTranslations.push(translation)
  })
  
  orderedTranslations = [...recommendedTranslations, ...nonRecommendedTranslations];

  if (!offline && (translations && translations.length)) {
    const uniqueLanguages = uniq(translations.map(t => t.language));

    el = (
      <CollapsibleSection title={`${t('Book.available-in-version',versionCount)} ${t('Book.available-in-language',languageCount)}`}>
        <LazyFontLoader languages={uniqueLanguages} />
        <Sizer
          maxHeight="l"
          scrollY
        >
          <List alignLeft>
            {
              orderedTranslations.map((r, i) => {
                return <Link
                  isInternal={true}
                  key={i}
                  href={links.bookDetails(r.slug)}
                >
                  {i + 1}. {r.title} ({r.language} - L{r.level}) {r.recommended ? <SvgIcon name="recommended" /> : null}
                </Link>
              })
            }
          </List>
        </Sizer>
      </CollapsibleSection>
    );
  }

  return el;
};
