import React, { Component } from 'react';
import { translate } from 'react-polyglot';

import ButtonGroup from '../ButtonGroup';
import Button from '../Button';
import Modal from '../Modal';
import Picklist from '../Picklist';
import LoaderBlock from '../LoaderBlock';

class RelevelModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      level: this.props.level
    };
  }

  onRelevelClicked = () => {
    const { 
      postRelevelWorkflow,
      slug,
      onCloseClicked
     } = this.props;
    
    postRelevelWorkflow(slug ,this.state.level).then(onCloseClicked);
  }

  onChangeLevelClicked = (value, checked) => {
    if(checked) {
      this.setState({ level : value })
    }
  }

  componentDidMount() {
    // First fetch available filters, then fetch the books.
    this.props.fetchAllBooksFiltersWorkflow();
  }

  render () {
    const { 
      isVisible,
      onCloseClicked,
      level,
      isFetchingFilters,
      filters,
      viewport,
      isReleveling,
      t
    } = this.props;

    if (!isVisible) {
      return null;
    }

    const header = (
      <h2>{t('Book.re-level')}</h2>
    );

    const footer = (
      <ButtonGroup mergeTop mergeBottom={!viewport.large} mergeSides>
        <Button
          disabled={level === this.state.level}
          variant="primary"
          fullWidth
          label={t('Book.re-level')}
          onClick={this.onRelevelClicked}
          loading={isReleveling}
        />
        <Button
          fullWidth
          label={t('global.close')}
          onClick={onCloseClicked}
          disabled={false}
        />
      </ButtonGroup>
    );
    const levelOptions = filters.level.queryValues.map(levelOption => {
      return (
        {
          name: levelOption.name,
          legend: levelOption.description,
          queryValue: levelOption.queryValue
        }
      )
    });

    return (
      <Modal header={header} footer={footer} onClose={onCloseClicked}>
        {
          isFetchingFilters
          ?
          <LoaderBlock />
          :
          <Picklist
            id="relevel-modal"
            options={levelOptions}
            hideSearchBar
            onChange={this.onChangeLevelClicked}
            multiplePicks={false}
            checkedValues={[this.state.level]}
            fontWeight='bold'
            autoFocus
          />
        }
      </Modal>
    );
  }
};

export default translate()(RelevelModal);
