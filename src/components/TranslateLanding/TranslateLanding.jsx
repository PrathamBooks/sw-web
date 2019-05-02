import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import DocumentTitle from 'react-document-title';

import Link from '../Link';
import Stuffer from '../Stuffer';
import Block from '../Block';
import Grid from '../Grid';
import BookShelf from '../BookShelf';
import ContentStyler from '../ContentStyler';
import VideoEmbed from '../VideoEmbed';
import PageHeader from '../PageHeader';
import SectionBlock from '../SectionBlock';
import SectionCallToAction from '../SectionCallToAction';
import BookCard from '../BookCard';
import SelectField from '../SelectField';
import SearchableSelectField from '../SearchableSelectField';
import Columnizer from '../Columnizer';
import TranslateFiltersContainer from '../TranslateFiltersContainer';
import NoResults from '../NoResults';
import { links, mailIds } from '../../lib/constants';

import './TranslateLanding.scss';

@translate()
class TranslateLanding extends Component {


  render() {
    const baseClassName = 'pb-translate-landing';
    const classNames = [baseClassName];
    const {
      t,
      viewport,
      books,
      sourceLanguage,
      targetLanguage,
      changeSourceLanguage,
      changeTargetLanguage,
      filters
    } = this.props;

    const breadcrumbPaths = [{
      title: t('global.home'),
      href: links.home(),
      isInternal: true
    }];

    const bookEls = books.map(book => {
      return (
        <BookCard key={book.id} book={book} sectionClicked='Translate Page' showTranslateButton/>
      );
    });
    let booksHolderEl;

    if (viewport.medium) {
      booksHolderEl = <Grid variant="2up-6up">{bookEls}</Grid>;
    } else {
      booksHolderEl = <BookShelf books={books} viewport={viewport} />;
    }

    const { language } = filters;
    let sourceOptions;
    let targetOptions;
    if (language) {
      sourceOptions = [{ name: `${t('Translate.choose-language')}`, queryValue: '' }, ...language.sourceQueryValues];
      targetOptions = [{ name: `${t('Translate.choose-language')}`, queryValue: '' }, ...(language.targetQueryValues.filter(language => language.name !== sourceLanguage))];
    } else {
      sourceOptions = [{ name: `${t('Translate.choose-language')}`, queryValue: '' }];
      targetOptions = [{ name: `${t('Translate.choose-language')}`, queryValue: '' }];
    }

    let selectLanguageEl = null;

    if (viewport.medium) {
      selectLanguageEl = 
        <Columnizer>
          <div className={`${baseClassName}__select-language-wrapper`}>
            <span className={`${baseClassName}__label`}>{t('global.from')}</span>
            <SearchableSelectField
              parentClassName={`${baseClassName}__select-language`}
              id="pb-translate-landing-from-lang"
              value={sourceLanguage}
              options={sourceOptions}
              onChange={changeSourceLanguage}
              />
          </div>
          <div className={`${baseClassName}__select-language-wrapper`}>
            <span className={`${baseClassName}__label`}>{t('global.to')}</span>
            <SearchableSelectField
              parentClassName={`${baseClassName}__select-language`}
              id="pb-translate-landing-to-lang"
              value={targetLanguage}
              options={targetOptions}
              onChange={changeTargetLanguage}
              />
          </div>
        </Columnizer>
    }
    else {
      selectLanguageEl = 
        [ <div className={`${baseClassName}__select-language-wrapper`}>
            <span className={`${baseClassName}__label`}>{t('global.from')}</span>
            <SelectField
              parentClassName={`${baseClassName}__select-language`}
              id="pb-translate-landing-from-lang"
              value={sourceLanguage}
              options={sourceOptions}
              onChange={changeSourceLanguage}
              theme='blue'
              />
          </div> ,
          <div className={`${baseClassName}__select-language-wrapper`}>
            <span className={`${baseClassName}__label`}>{t('global.to')}</span>
            <SelectField
              parentClassName={`${baseClassName}__select-language`}
              id="pb-translate-landing-to-lang"
              value={targetLanguage}
              options={targetOptions}
              onChange={changeTargetLanguage}
              theme='blue'
              />
          </div> ]
    }

    return (
      <div className={classNames.join(' ')}>
        <DocumentTitle title={`${t('global.translate')} - ${t('global.site-title')}`} />
        <PageHeader title={t("global.story-weaver-translator")} breadcrumbPaths={breadcrumbPaths} />
        <Block>
          <Stuffer>
            <ContentStyler>
              <p>{t("TranslateLanding.introduction")}<br/>
                {t("TranslateLanding.language-not-found-tip")}
                <Link href={links.mailToLink(mailIds.helpMailId)}>
                  {mailIds.helpMailId}
                </Link>
                {t("TranslateLanding.language-not-found-tip-1")}
              </p>
            </ContentStyler>
          </Stuffer>
          {selectLanguageEl}
        </Block>

        <TranslateFiltersContainer />

        <SectionBlock
          noContentHorizontalPadding={viewport.medium ? false : true}>
          {booksHolderEl}
          {
            books.length
            ?
            <SectionCallToAction
              label={t("TranslateLanding.view-all-translation-suggestions")}
              href={links.allTranslate()}
              isInternal
              borderBottom
            />
            :
            null
          }
          {
            books.length ? null : <NoResults />
          }
        </SectionBlock>

        <Block>
          <Grid variant="2up">
            <div>
              <VideoEmbed
                aspectRatio="16-by-9"
                src="https://www.youtube.com/watch?v=iSVnjFN-Qs0"
              />
            </div>
            <Stuffer horizontalSpacing={'m'}>
              <ContentStyler>
                <h2 className="pb-left">{t("TranslateLanding.translating-with-storyweaver")}</h2>
                <p>{t("TranslateLanding.translating-with-storyweaver-content-p01")}</p>
              </ContentStyler>
            </Stuffer>
          </Grid>

          <ContentStyler>
            <h2 className="pb-left">{t("TranslateLanding.translating-tips")}</h2>
            <ol>
              <li>{t("TranslateLanding.translating-tip-1-pre-link")} {t("global.reading-level", 1)} {t("TranslateLanding.translating-tip-1-post-link")}</li>
              <li>{t("TranslateLanding.translating-tip-2")}</li>
              <li>{t("TranslateLanding.translating-tip-3")}</li>
              <li>{t("TranslateLanding.translating-tip-4")}</li>
              <li>{t("TranslateLanding.translating-tip-5")}</li>
              <li>{t("TranslateLanding.translating-tip-6")}</li>
            </ol>
          </ContentStyler>
          <SectionCallToAction
            label={t("TranslateLanding.for-more-tips")}
            href={"#translation"}
            isInternal
            borderBottom
          />
        </Block>
      </div>
    );
  }
}

TranslateLanding.propTypes = {
  viewport: PropTypes.object.isRequired,
  books: PropTypes.arrayOf(PropTypes.shape(BookCard.propTypes)),
};

export default TranslateLanding;
