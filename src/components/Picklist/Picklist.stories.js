import React, {Component} from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Picklist from '.';

setAddon(JSXAddon);

class PicklistTestContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: undefined,
      checkedValues: []
    }
  }

  handleSearchChange = (e) => {
    if (e.target.value !== this.state.searchValue) {
      this.setState({
        searchValue: e.target.value
      })

      if (this.props.onSearchChange) {
        this.props.onSearchChange(e);
      }
    }
  }

  handleChange = (value, checked) => {
    if (checked) {
      if (this.props.multiplePicks) {
        this.setState({
          checkedValues: [...this.state.checkedValues, value]
        })
      } else {
        this.setState({
          checkedValues: [value]
        })
      }
    } else {
      if (this.props.multiplePicks) {
        const filteredValues = this.state.checkedValues.filter(v => {
          return v !== value;
        });

        this.setState({
          checkedValues: filteredValues
        });
      } else {
        this.setState({
          checkedValues: []
        })
      }
    }

    if (this.props.onChange) {
      this.props.onChange(value, checked);
    }
  }

  handleClear = e => {
    this.setState({
      checkedValues: []
    });

    if (this.props.onClear) {
      this.props.onClear(e);
    }
  }

  render() {
    return <Picklist
      {...this.props}
      onSearchChange={this.handleSearchChange}
      onChange={this.handleChange}
      onClear={this.props.onClear ? this.handleClear : null}
      searchValue={this.state.searchValue}
      checkedValues={this.state.checkedValues}
      />;
  }
}

const stories = storiesOf('Picklist', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('Default', () => {
  const clearable = boolean('Clearable?');
  const multiplePicks = boolean('Multiple Picks?', true);
  const fitToContainer = boolean('Fit to Container?');
  const sortByChecked = boolean('Sort by Checked?');
  const hideSearchBar = boolean('Hide Search Bar?');
  const labelBold = boolean('Make label bold?');

  const options = Array.apply(null, {length: 20}).map((n, i) => {
    return {
      name: `Option ${i}`,
      queryValue: `value-${i}`
    };
  });

  return (
    <div style={fitToContainer ? {margin: 0, height: '300px'} : null}>
      <PicklistTestContainer
          options={options}
          id="storybook-picklist"
          sortByChecked={sortByChecked}
          fitToContainer={fitToContainer}
          onClear={clearable ? action('picklist-clear-all') : null}
          onChange={action('on-change')}
          onSearchChange={action('on-search-change')}
          multiplePicks={multiplePicks}
          hideSearchBar={hideSearchBar}
          fontWeight={labelBold ? 'bold' : null}
          />
    </div>
  );
});
