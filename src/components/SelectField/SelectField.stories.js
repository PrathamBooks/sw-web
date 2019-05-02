import React, {Component} from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import backgrounds from "@storybook/addon-backgrounds";
import { gbDarkDefault } from '../../../.storybook/backgrounds.js'

import SelectField from '.';

setAddon(JSXAddon);

export class SelectFieldStateWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null
    }
  }

  onChangeHandler = (value) => {
    if (this.state.value !== value) {
      this.setState({
        value: value
      });

      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }

  render() {
    const options = [
      { name: '', queryValue: '' },
      { name: 'January', queryValue: 'jan' },
      { name: 'February', queryValue: 'feb' },
      { name: 'March', queryValue: 'mar' }
    ];

    return <SelectField
              {...this.props}
              options={options}
              value={this.state.value}
              onChange={this.onChangeHandler}/>
  }
}

const stories = storiesOf('SelectField', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const id = text('ID', 'storybook-select-field');
  const label = text('Label', 'Begins In');
  const name = text('Name');
  const disabled = boolean('Disabled?');
  const loading = boolean('Loading?');

  return <SelectFieldStateWrapper
    id={id}
    label={label}
    name={name}
    disabled={disabled}
    loading={loading}
    onChange={action('select-field-value-changed')}/>
});


stories.addDecorator(backgrounds(gbDarkDefault));

stories.addWithJSX('Light', () => {
  const id = text('ID', 'storybook-select-field');
  const label = text('Label', 'Begins In');
  const name = text('Input name', 'begins-in');

  return <SelectFieldStateWrapper
    id={id}
    label={label}
    name={name}
    onChange={action('select-field-value-changed')}
    theme="light"
    />
});
