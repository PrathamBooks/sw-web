import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
// import { withKnobs, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import SearchModal from '.';

const mapStateToProps = ({ viewport }) => ({
  viewport
});

@connect(mapStateToProps)
class SearchModalWithViewport extends Component {
  render() {
    return <SearchModal viewport={this.props.viewport} {...this.props} />
  }
}

setAddon(JSXAddon);

const stories = storiesOf('SearchModal', module);

// stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  // const name = text('Label', 'initial value');

  return <SearchModalWithViewport
    onChange={action('search-modal-on-change')}
    onClose={action('search-modal-on-close')}
    onSubmit={action('search-modal-on-submit')}
    />
});
