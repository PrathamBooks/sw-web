import React, { Component } from 'react';
import { translate } from 'react-polyglot';

import ButtonGroup from '../ButtonGroup';
import Button from '../Button';
import Modal from '../Modal';
import TextField from '../TextField';


class CreateListModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: ''
    };
  }

  onTitleChange = (e) => this.setState({ title: e.target.value })
  onDescriptionChange = (e) => this.setState({ description: e.target.value })

  onCreateClick = () => {
    let createPromise;
    if (this.props.bookSlug) {
      createPromise = this.props.onCreate(
        this.state.title,
        this.state.description,
        [ this.props.bookSlug ]
      );
    } else {
      createPromise = this.props.onCreate(this.state.title, this.state.description);
    }

    createPromise.then(this.props.onClose);
  }

  render() {
    const { onClose, viewport, t, isCreatingReadingList } = this.props;
    
    const header = (
      <h2>{t('ReadingList.create')}</h2>
    );

    const footer = (
      <ButtonGroup mergeTop mergeBottom={!viewport.large} mergeSides>
        <Button
          fullWidth
          label={t('global.close')}
          onClick={onClose}
          disabled={isCreatingReadingList}
        />
        <Button
          loading={isCreatingReadingList}
          variant="primary"
          fullWidth
          label={t('global.create')}
          onClick={this.onCreateClick}
          disabled={this.state.title.length <= 0}
        />
      </ButtonGroup>
    );

    return (
      <Modal header={header} footer={footer} onClose={onClose}>
        <p>{t('ReadingList.create-list-modal-legend')}</p>
        <TextField
          label={t('ReadingList.title')}
          value={this.state.title}
          onChange={this.onTitleChange}
        />
        <TextField
          type="multiline"
          label={t('ReadingList.description')}
          value={this.state.description}
          onChange={this.onDescriptionChange}
        />
      </Modal>
    );
  }
};

export default translate()(CreateListModal);
