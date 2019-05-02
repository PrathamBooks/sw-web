import React, { Component } from 'react';
import classNames from 'classnames';
import { translate } from 'react-polyglot';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import u from 'updeep';

import Block from '../Block';
import BookCard from '../BookCard';
import BookCardOutline from '../BookCardOutline';
import Button from '../Button';
import CollapsibleSection from '../CollapsibleSection';
import ContentStyler from '../ContentStyler';
import DocumentClass from '../DocumentClass';
import Grid from '../Grid';
import PageHeader from '../PageHeader';
import SectionBlock from '../SectionBlock';
import SelectableGrid from '../SelectableGrid';
import Stuffer from '../Stuffer';
import SvgIcon from '../SvgIcon';
import DeleteModal from './DeleteModal';

import { links } from '../../lib/constants';

import './OfflineBooks.scss';

@translate()
class OfflineBooks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: {
        delete: false
      }
    }

    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  onOpenModal(modalName) {
    this.setState(u({
      isModalVisible: {
        [modalName]: true
      }
    }, this.state));
  }

  onCloseModal(modalName) {
    this.setState(u({
      isModalVisible: {
        [modalName]: false
      }
    }, this.state));
  }

  renderBookEls() {
    const { books, online } = this.props;

    return books.map(book => {
      return (
        <BookCard
          key={book.id}
          id={book.id}
          book={book}
          shouldDisplayMenu={true}
          hideQuickViewBtn={true}
          shouldShowReadIcon={true}
          noSrcSet={!online}
          hideReadCountStat={true}
        />
      );
    });
  }

  renderHeader(baseClassName) {
    const {
      t,
      editActive,
      onManage,
      online,
      books
    } = this.props;

    return (
      <PageHeader
        icon="offline"
        image="https://storage.googleapis.com/storyweaver-sw2-full/illustrations/4112/large/storyweaver.jpg?1478600179"
        pullInBottom
        overlayVariant="mid-night-gradient"
        actions={
          books.length
          ?
            editActive ? null : <Button onClick={onManage} label={t("OfflineBooks.manage-books")} variant="primary" fullWidth />
          :
          null
        }
        title={process.env.REACT_APP_FEATURE_OFFLINE ? t("global.offline-library") : t("global.offline-library-coming-soon")}>
        {
          editActive
          ?
          null
          :
          (
            process.env.REACT_APP_FEATURE_OFFLINE
            ?
            (
              online
              ?
              [
                <p key="1">{t("OfflineBooks.legend-online-p1")}</p>,
                <p>{t("OfflineBooks.legend-online-p2")}</p>,
                <CollapsibleSection
                  key="2"
                  disableCollapse
                  title={t("OfflineBooks.adding-to-offline-library-title")}
                  upperCaseTitle
                  theme="light"
                >
                  <ol>
                    <li>{t("OfflineBooks.adding-to-offline-step-1")}</li>
                    <li>{t("OfflineBooks.adding-to-offline-step-2-pre-icon")}<SvgIcon name="offline"/>{t("OfflineBooks.adding-to-offline-step-2-post-icon")}</li>
                    <li>{t("OfflineBooks.adding-to-offline-step-3")}</li>
                    <li>{t("OfflineBooks.adding-to-offline-step-4")}</li>
                    <li>{t("OfflineBooks.adding-to-offline-step-5")}</li>
                  </ol>
                </CollapsibleSection>
              ]
              :
              <p>{t("OfflineBooks.legend-offline")} <SvgIcon name="offline"/></p>
            )
            :
            <p>{t("OfflineBooks.coming-soon")}</p>
          )
        }
      </PageHeader>
    );
  }

  renderEditToolbar(baseClassName) {
    const {
      t,
      editActive,
      viewport,
      onCancel,
      isSomethingSelected
    } = this.props;

    if(editActive) {
      return (
        <Block background="transparent">
          <Stuffer horizontalSpacing={viewport.medium ? "l" : null}>
            <ContentStyler theme="light">
              <p className="pb-center">{t("OfflineBooks.edit-legend")}</p>
            </ContentStyler>
            <div className={`${baseClassName}__edit-actions`}>
              <Button
                iconLeft="bin"
                label="Delete"
                onClick={() => this.onOpenModal('delete')}
                variant="danger"
                disabled={!isSomethingSelected}
              />
              <Button
                iconLeft="close-circle"
                label="Cancel"
                onClick={onCancel}
              />
            </div>
          </Stuffer>
        </Block>
      );
    }
  }

  render() {
    const baseClassName = 'pb-offline-books';

    const {
      t,
      books,
      editActive,
      onChangeCheckedValues,
      online,
      viewport,
      onDelete,
      checkedValues
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--offline`]: !online
    }

    return (
      <div className={classNames(classes)}>
        <DocumentClass className={`${baseClassName}-document`} />
        <DocumentTitle title={`${t('global.offline-library')} - ${t('global.site-title')}`} />
        {this.renderHeader(baseClassName)}
        {
          process.env.REACT_APP_FEATURE_OFFLINE
          ?
          this.renderEditToolbar(baseClassName)
          :
          null
        }
        {
          process.env.REACT_APP_FEATURE_OFFLINE
          ?
          <SectionBlock
            title={`${t("global.showing")} ${books.length} ${t("global.story", books.length)}`}
            theme="light"
            separateHeader>
            {
              editActive?
              <SelectableGrid
                id="offline-book-selectable-grid"
                variant="2up-6up"
                label={t("OfflineBooks.select-for-delete-label")}
                rotateOnActive
                roundedCorners
                onChange={onChangeCheckedValues}
                theme="danger">
                {this.renderBookEls()}
              </SelectableGrid>
              :
              <div className={`${baseClassName}--offline__grid`}>
                <Grid variant="2up-6up">
                  {this.renderBookEls()}
                  {
                    online
                    ?
                    <BookCardOutline
                      icon="plus-circle"
                      label={`${t("OfflineBooks.adding-to-offline-library")}`}
                      href={links.allBooks()}
                      theme="light"
                      />
                    :
                    null
                  }
                </Grid>
              </div>
            }
          </SectionBlock>
          :
          null
        }
        {
          this.state.isModalVisible.delete
          ?
          <DeleteModal
            onConfirm={onDelete}
            onClose={() => this.onCloseModal('delete')}
            viewport={viewport}
            count={checkedValues.length}
            baseClassName={baseClassName}
          />
          :
          null
        }
      </div>
    );
  }
}

OfflineBooks.propTypes = {
  viewport: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  books: PropTypes.arrayOf(PropTypes.shape(BookCard.propTypes)).isRequired,
  editActive: PropTypes.bool,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func,
  onManage: PropTypes.func,
  online: PropTypes.bool,
  isSomethingSelected: PropTypes.bool
};

export default OfflineBooks;
