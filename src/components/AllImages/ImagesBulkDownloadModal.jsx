import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import Modal from '../Modal';
import Table from '../Table';
import ButtonGroup from '../ButtonGroup';
import Button from '../Button';
import { isEmpty } from 'lodash';

import { imageDownloadFormats } from '../../lib/constants';


class ImagesBulkDownloadModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selection: [],
      selectedImagesWithFormat: {}
    };
  }

  onCheckBoxChanged = (selection) => {
    this.setState({
      selection
    });
  }

  onDownloadButtonClicked = () => {
    let finalImagesSelections = {};
    if (this.props.downloadFormat !== imageDownloadFormats.hiResJpeg) {
      //interpolating a [] at the end of the query , so that in the ids's url the params goes as a array
      finalImagesSelections[`${this.props.downloadFormat}[]`] = this.state.selection
    }
    else {
      const selectedImagesWithFormat = this.state.selectedImagesWithFormat;
      Object.keys(selectedImagesWithFormat).forEach(format => {
        if (selectedImagesWithFormat[format] && selectedImagesWithFormat[format].length > 0) {
          //interpolating a [] at the end of the query , so that in the ids's url the params goes as a array
          finalImagesSelections[`${format}[]`] = selectedImagesWithFormat[format].filter(image => this.state.selection.includes(image))
        }
      });
    }
    this.props.bulkDownloadButtonClicked(finalImagesSelections)
  }

  componentDidMount() {
    if (this.props.downloadFormat === imageDownloadFormats.hiResJpeg) {
      this.props.confirmImageFormat({download_format: this.props.downloadFormat, 'ids[]': this.props.imagesSelected})
      .then(response => {
        if (response.data) {
          this.setState({
            selectedImagesWithFormat: response.data
          });
        }
    });
    }
  }

  render(){
    //const baseClassName = 'pb-download-modal';
    const { isVisible,
            onCloseClicked,
            imagesSelected,
            images,
            t,
            downloadLimitReached,
            onFormLinkClicked,
            downloadFormat,
            isfetchingConfirmImageFormat } = this.props;

    if (!isVisible) {
      return null;
    }
    
    if (images === null || images[0] === null || imagesSelected === null) {
      return;
    }

    const columns = [{
        header: t('ImageDownloadModal.table-title-column'),
        accessor: 'title',
      },
      {
        header: t('DownloadModal.table-format-column'),
        accessor: 'format'
      }
    ]

    let data = []

    const selectedImagesWithFormat = this.state.selectedImagesWithFormat ;

    if (isEmpty(selectedImagesWithFormat) && downloadFormat !== imageDownloadFormats.hiResJpeg) {
      images.filter(image => imagesSelected.includes(parseInt(image.id, 10)))
      .forEach(image => {data.push({
                          id: image.id,
                          title: image.title,
                          format: downloadFormat})
                       });
    }
    else {
      Object.keys(selectedImagesWithFormat).forEach(format => {
        if (selectedImagesWithFormat[format] && selectedImagesWithFormat[format].length > 0) {
          images.filter(image => selectedImagesWithFormat[format].includes(image.id))
          .forEach(image => {data.push({
                              id: image.id,
                              title: image.title,
                              format: format})
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
            loading={isfetchingConfirmImageFormat}
            isSelectable
            defaultSelectAll
            onCheckBoxChanged={this.onCheckBoxChanged}
          />
        }
      </Modal>
    );
  }
};

export default translate()(ImagesBulkDownloadModal);
