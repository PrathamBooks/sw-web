import React, {Component} from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import SearchableSelectField from '.';

export class SearchableSelectFieldTestContainer extends Component {
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
      { name: 'March', queryValue: 'mar' },
      { name: 'April', queryValue: 'apr' },
      { name: 'May', queryValue: 'may' },
      { name: 'June', queryValue: 'jun' },
      { name: 'July', queryValue: 'jul' },
      { name: 'August', queryValue: 'aug' }
    ];

    return <SearchableSelectField
              {...this.props}
              options={options}
              value={this.state.value}
              onChange={this.onChangeHandler}/>
  }
}

setAddon(JSXAddon);

const stories = storiesOf('SearchableSelectField', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const id = text('ID', 'storybook-searchable-select-field');
  const label = text('Label', 'Begins In');
  const disabled = boolean('Disabled?');
  const loading = boolean('Loading?');

  return <SearchableSelectFieldTestContainer
    id={id}
    label={label}
    name="storybook-searchable-select-field"
    disabled={disabled}
    loading={loading}
    onChange={action('searchable-select-field-value-changed')}/>
});

stories.addWithJSX('Error', () => {
  const id = text('ID', 'storybook-searchable-select-field');
  const label = text('Label', 'Begins In');
  const error = text('Error Message', 'This field is required.');

  return <SearchableSelectFieldTestContainer
    id={id}
    label={label}
    error={error}
    name="storybook-searchable-select-field"
    onChange={action('searchable-select-field-value-changed')}/>
});
