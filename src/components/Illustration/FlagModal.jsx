import React, { Component } from 'react';
import { translate } from 'react-polyglot';

import ButtonGroup from '../ButtonGroup';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Modal from '../Modal';
import TextField from '../TextField';


class FlagModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flagReasons: [],
      otherReason: ""
    };

    this.onCheckBoxChanged = this.onCheckBoxChanged.bind(this);
    this.onFlagClicked = this.onFlagClicked.bind(this);
    this.onTextBoxChanged = this.onTextBoxChanged.bind(this);
  }

  onCheckBoxChanged({ checked, value }) {
    if (checked) {
      this.setState({
        flagReasons: [].concat(this.state.flagReasons, value)
      });
    } else {
      this.setState({
        flagReasons: this.state.flagReasons.filter(fr => fr !== value)
      });
    }
  }

  onTextBoxChanged(e) {
    this.setState({ otherReason: e.target.value });
  }

  onFlagClicked() {
    const reasons = {
      reasons: this.state.flagReasons
    };

    if (this.state.flagReasons.includes('other') || this.state.flagReasons.includes('copyrighted')) {
      reasons.otherReason = this.state.otherReason;
    }

    this.props.onFlagClicked(reasons);
    this.props.onCloseClicked('flag');
  }

  render () {
    const { isVisible, onCloseClicked, viewport, t } = this.props;

    if (!isVisible) {
      return null;
    }

    const header = (
      <h2>{t('Illustration.flag', 2)}</h2>
    );
    
    const disabledFlag= this.state.flagReasons.length === 0 || 
        (this.state.flagReasons.includes('other') && this.state.otherReason === "");

    const footer = (
      <ButtonGroup mergeTop mergeBottom={!viewport.large} mergeSides>
        <Button
          disabled={disabledFlag}
          variant="primary"
          fullWidth
          label={t('Illustration.flag', 1)}
          onClick={() => this.onFlagClicked(this.state.flagReasons)}
        />
        <Button fullWidth label={t('global.close')} onClick={onCloseClicked} />
      </ButtonGroup>
    );

    // Keys are string constants to be sent back, values are translated versions for the UI.
    const reasons = {
      'copyright-false-attribution': t('Illustration.flag-reason-copyright-attributed'),
      'copyright-belongs-to-me': t('Illustration.flag-reason-copyright-belongs-to-me'),
      'inappropriate': t('Illustration.flag-reason-inappropriate'),
      'pixelated': t('Illustration.flag-reason-pixelated'),
      'other': t('Illustration.flag-reason-other'),
    };

    const checkBoxes = Object.entries(reasons).map(([value, message]) => (
      <Checkbox
        label={message}
        name={`flag-checkbox-${value}`}
        value={value}
        key={value}
        onChange={this.onCheckBoxChanged}
        checked={this.state.flagReasons.includes(value)}
      />
    ));

    return (
      <Modal header={header} footer={footer} onClose={onCloseClicked}>
        {checkBoxes}
        {
          this.state.flagReasons.includes('other') || this.state.flagReasons.includes('copyrighted')
          ?
          <TextField type="multiline" label={t('Illustration.other-reason')} onChange={this.onTextBoxChanged} />
          :
          null
        }
      </Modal>
    );
  }
};

export default translate()(FlagModal);
