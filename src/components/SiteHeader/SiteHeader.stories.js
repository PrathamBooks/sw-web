import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import SiteHeader from '.';

const mapStateToProps = ({ viewport }) => ({
  viewport
});

@connect(mapStateToProps)
class SiteHeaderWithViewport extends Component {
  render() {
    return <SiteHeader viewport={this.props.viewport} {...this.props} />
  }
}

setAddon(JSXAddon);

const stories = storiesOf('SiteHeader', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const isOpen = boolean('Menu Open');
  const user = object('User Object', {
    firstName: 'Ankur',
    links: {
      'Dashboard': '#dashbaord',
      'Logout': '#logout'
    }
  });

  return <SiteHeaderWithViewport
    menuOpen={isOpen}
    user={user}
    onMenuToggle={action("site-header-menu-toggle-clicked")} />
});
