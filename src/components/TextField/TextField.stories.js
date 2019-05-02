import React, {Component} from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, select, array, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import backgrounds from "@storybook/addon-backgrounds";
import { gbDarkDefault } from '../../../.storybook/backgrounds.js'

import TextField from '.';

setAddon(JSXAddon);

const stories = storiesOf('TextField', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const label = text('Label', 'A Nice Label');
  const type = select('Field Type', {
    text: 'Text',
    email: 'Email',
    password: 'Password',
    multiline: 'Multiline',
    number: 'Number',
    tel: 'Tel'
  }, 'text');

  const size = select('Size', {
    m: 'M',
    l: 'L',
  }, 'm');
  const theme = select('Theme', {
    default: 'Default',
    dark: 'Dark',
    light: 'Light',
  }, 'default');

  const fontFamily = select('Font Family', {
    default: 'Default',
    alt: 'Alt',
    monospace: 'Monospace',
  }, 'default');
  const icon = text('Icon');
  const disabled = boolean('Disabled?');

  return <TextField
            id="test-text-field"
            type={type}
            label={label}
            size={size}
            onKeyPress={action('key-pressed')}
            onChange={action('value-changed')}
            onBlur={action('blurred')}
            onFocus={action('focused')}
            onIconClick={action('icon-clicked')}
            fontFamily={fontFamily}
            icon={icon}
            theme={theme}
            disabled={disabled}
            />
});

stories.addWithJSX('Error', () => {
  const label = text('Label', 'A Nice Label');
  const error = text('Error', 'This is a required field.');
  const type = select('Field Type', {
    text: 'Text',
    email: 'Email',
    password: 'Password',
    multiline: 'Multiline',
    number: 'Number',
    tel: 'Tel',
    file: 'File'
  }, 'text');

  return <TextField
            id="test-text-field-error"
            type={type}
            label={label}
            error={error}
            />
});

class TextFieldWithState extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    }
  }

  onChangeHandler = (e) => {
    if (this.state.value !== e.target.value) {
      this.setState({
        value: e.target.value
      });
    }

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  onOptionSelectHandler = (value) => {
    if (this.state.value !== value) {
      this.setState({
        value: value
      });
    }

    if (this.props.onOptionSelect) {
      this.props.onOptionSelect(value);
    }
  }

  render() {
    return <TextField
      {...this.props}
      value={this.state.value}
      onChange={this.onChangeHandler}
      onOptionSelect={this.onOptionSelectHandler}
      />
  }
}

stories.addWithJSX('Suggestions', () => {
  const label = text('Label', 'Countries starting with ‘A’');
  const options = array('Options', [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Australia',
    'Austria',
    'Azerbaijan',
  ]);

  const type = select('Field Type', {
    text: 'Text',
    email: 'Email',
    password: 'Password',
    multiline: 'Multiline',
    number: 'Number',
    tel: 'Tel',
    file: 'File'
  }, 'text');

  return <TextFieldWithState
            id="test-text-field-suggestions"
            type={type}
            label={label}
            options={options}
            onChange={action('value-changed')}
            onOptionSelect={action('option-select')}
            />
});

stories.addDecorator(backgrounds(gbDarkDefault));

stories.addWithJSX('Light', () => {
  const label = text('Label', 'A Nice Label');

  const type = select('Field Type', {
    text: 'Text',
    email: 'Email',
    password: 'Password',
    multiline: 'Multiline',
    number: 'Number',
    tel: 'Tel',
    file: 'File'
  }, 'text');

  return <TextField
            id="test-text-field"
            type={type}
            label={label}
            onKeyPress={action('key-pressed')}
            onChange={action('value-changed')}
            onBlur={action('blurred')}
            onFocus={action('focused')}
            theme="light"/>
});
