import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';

import Button from '../Button';
import Modal from '../Modal';
import Overlay from '../Overlay';
import Stuffer from '../Stuffer';
import TextField from '../TextField';

import { keyCodes } from '../../lib/constants';

import './SearchModal.scss';

class SearchModal extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props);

    this.state = {
      query: ''
    };
  }

  componentDidMount() {
    if (this.textField) {
      this.textField.focus();
    }
  }

  onChange = (e) => this.setState({ query: e.target.value })
  onSubmit = () => this.props.onSubmit(this.state.query)
  onKeyPress = (e) => {
    if (e.charCode === keyCodes.return) {
      this.onSubmit();
    }
  };

  render() {
    const baseClassName = 'pb-search-modal';

    const {
      t,
      viewport,
      onClose,
    } = this.props;

    const classes = {
      [baseClassName]: true
    };

    return (
      <div className={classNames(classes)}>
        <Modal
          background="transparent"
          onClose={onClose}
          overlayTheme="light">
          <div className={`${baseClassName}__search-box`}>
            <TextField
              ref={textField => this.textField = textField}
              id="search-modal-input"
              name="q"
              label={t("SearchModal.input-label")}
              size="l"
              fontFamily="alt"
              theme="dark"
              onChange={this.onChange}
              onKeyPress={this.onKeyPress}
              />
          </div>
          <Stuffer horizontalSpacing={viewport.medium ? 'xl' : null}>
            <Button
              parentClassName={`${baseClassName}__submit`}
              label={t("SearchModal.submit-label")}
              onClick={this.onSubmit}
              variant="accent"
              fullWidth/>
          </Stuffer>
        </Modal>
        <Overlay theme="light" />
      </div>
    );
  }
}

SearchModal.propTypes = {
  viewport: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
};

export default translate()(SearchModal);
