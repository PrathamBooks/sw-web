import React, { Component } from 'react';
import classNames from 'classnames';
import { translate } from 'react-polyglot';
import DocumentTitle from 'react-document-title';
import NoResults from '../NoResults';
import { links } from '../../lib/constants';
import ReadingLists from '../ReadingLists';
import LoaderBlock from '../LoaderBlock';
import Pagination from '../Pagination';
import Block from '../Block';
import PageHeader from '../PageHeader';

import './AllLists.scss';

@translate()
class AllLists extends Component {
  static defaultProps = {
    headerBgUrl: 'https://storage.googleapis.com/storyweaver-sw2-full/illustrations/2136/large/Illustration-7.jpg?1443543843'
  } //replace with All Lists image later


  render() {
    const baseClassName = 'pb-all-lists';

    const {
      t,
      isFetchingAllLists,
      lists,
      listsInfo,
      headerBgUrl,
      loadedPages,
      loadMore,
      filtersComponent
    } = this.props;

    const classes = {
      [baseClassName]: true
    };

    const breadcrumbPaths = [{
      title: t('global.home'),
      href: links.home(),
      isInternal: true
    }];


    return (
      <div className={classNames(classes)}>
        <DocumentTitle title={`${t('global.all-lists')} - ${t('global.site-title')}`} />
        <PageHeader
          image={headerBgUrl}
          pullInBottom
          title= {t('global.all-lists')}
          breadcrumbPaths={breadcrumbPaths}/>
        <Block>
          {filtersComponent}
          <ReadingLists lists={lists} owner />
            { 
               loadedPages === 0 ? <LoaderBlock /> : null
            }
          {
           (lists.length < listsInfo.hits) && (loadedPages > 0) ?  
              <Pagination 
                onClick={loadMore}
                loading={isFetchingAllLists} />
            :
            null
          }
          {
            isFetchingAllLists || lists.length ? null : <NoResults />
          }
        </Block>
      </div>
    );
  }
}

AllLists.propTypes = {};

export default AllLists;
