import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';

import FiltersPanel from '.';

const mapStateToProps = ({ viewport }) => ({
  viewport
});

@connect(mapStateToProps)
class FiltersPanelWithViewport extends Component {
  render() {
    return <FiltersPanel viewport={this.props.viewport} {...this.props} />
  }
}

setAddon(JSXAddon);

const stories = storiesOf('FiltersPanel', module);

stories.addWithJSX('Default', () => {

  return <FiltersPanelWithViewport />
});
