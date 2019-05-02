import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import Modal from '../Modal';
import Table from '../Table';
import ButtonGroup from '../ButtonGroup';
import Button from '../Button';
import { isEmpty } from 'lodash';
import { bookDownloadFormats } from '../../lib/constants';

class BulkDownloadModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selection: [],
      selectedBookWithFormat: {}
    };
  }

  onCheckBoxChanged = (selection) => {
    this.setState({
      selection
    });
  }

  onDownloadButtonClicked = () => {
    let finalBooksSelections = {};
    if (this.props.downloadFormat !== bookDownloadFormats.hiResPdf) {
      //interpolating a [] at the end of the query , so that in the ids's url the params goes as a array
      finalBooksSelections[`${this.props.downloadFormat}[]`] = this.state.selection
    }
    else {
      const selectedBookWithFormat = this.state.selectedBookWithFormat;
      Object.keys(selectedBookWithFormat).forEach(format => {
        if (selectedBookWithFormat[format] && selectedBookWithFormat[format].length > 0) {
          //interpolating a [] at the end of the query , so that in the ids's url the params goes as a array
          finalBooksSelections[`${format}[]`] = selectedBookWithFormat[format].filter(book => this.state.selection.includes(book))
        }
      });
    }
    this.props.bulkDownloadButtonClicked(finalBooksSelections)
  }

  componentWillMount() {
    if (this.props.downloadFormat === bookDownloadFormats.hiResPdf) {
      this.props.confirmStoryFormat({download_format: this.props.downloadFormat, 'ids[]': this.props.booksSelected})
      .then(response => {
        if (response.data) {
          this.setState({
            selectedBookWithFormat: response.data
          });
        }
    });
    }
  }

  render() {
    //const baseClassName = 'pb-download-modal';
    const { isVisible,
            onCloseClicked,
            booksSelected,
            downloadFormat,
            books,
            t,
            downloadLimitReached,
            onFormLinkClicked,
            isfetchingConfirmBooksFormat } = this.props;

    if (!isVisible) {
      return null;
    }
    
    if (books === null || books[0] === null || booksSelected === null) {
      return;
    }

    const columns = [{
        header: t('DownloadModal.table-title-column'),
        accessor: 'title',
      },
      {
        header: t('DownloadModal.table-language-column'),
        accessor: 'language'
      },
      {
        header: t('DownloadModal.table-level-column'),
        accessor: 'level'
      },
      {
        header: t('DownloadModal.table-format-column'),
        accessor: 'format'
      }
    ]


    let data = []
    const selectedBookWithFormat = this.state.selectedBookWithFormat ;
    if (isEmpty(selectedBookWithFormat) && downloadFormat !== bookDownloadFormats.hiResPdf) {
      books.filter(book => booksSelected.includes(book.id))
      .forEach(book => {data.push({
                          id: book.id,
                          title: book.title,
                          language: book.language,
                          level: book.level,
                          format: downloadFormat })
                      });
    }
    else {
      Object.keys(selectedBookWithFormat).forEach(format => {
        if (selectedBookWithFormat[format] && selectedBookWithFormat[format].length > 0) {
          books.filter(book => selectedBookWithFormat[format].includes(book.id))
          .forEach(book => {data.push({
                              id: book.id,
                              title: book.title,
                              language: book.language,
                              level: book.level,
                              format: format })
                          });
        }
      });
    }

    const header = (
      <h2>{downloadLimitReached ? t('DownloadModal.link') : t('global.bulk-download')}</h2>
    );

    const footer = downloadLimitReached
                   ?
                   (<ButtonGroup mergeTop mergeBottom mergeSides>
                      <Button
                        fullWidth
                        label={t('DownloadModal.popup-footer')}
                        variant="primary"
                        onClick={onFormLinkClicked}
                      />
                    </ButtonGroup>)
                   :
                   (<ButtonGroup mergeTop mergeBottom mergeSides>
                      <Button
                        disabled={this.state.selection.length === 0}
                        variant="primary"
                        fullWidth
                        label={t('global.download', 1)}
                        onClick={this.onDownloadButtonClicked}
                      />
                      <Button
                        fullWidth
                        label={t('global.cancel')}
                        onClick={onCloseClicked}
                      />
                    </ButtonGroup>)
    

    return (
      <Modal
        header={header}
        onClose={onCloseClicked}
        footer={footer}
      >
        {
          downloadLimitReached
          ?
          <p>{t('DownloadModal.popup')}</p>
          :
          <Table
            data={data}
            columns={columns}
            showPagination={false}
            loading={isfetchingConfirmBooksFormat}
            isSelectable
            defaultSelectAll
            onCheckBoxChanged={this.onCheckBoxChanged}
          />
        }
      </Modal>
    );
  }
};

export default translate()(BulkDownloadModal);
