import React, { Component } from 'react';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import ReactTable from 'react-table';
import checkboxHOC from "react-table/lib/hoc/selectTable";
import 'react-table/react-table.css';
import './Table.scss';
//import "react-table/react-table.css";

const CheckboxTable = checkboxHOC(ReactTable);

class Table extends Component {

  static defaultProps = {
    pageSize: 10,
    isSelectable: false,
    showPagination: true,
    showPaginationTop: false,
    showPaginationBottom: true,
    sortable: true,
    multiSort: true,
    resizable: true,
    filterable: false,
    loading: false
  }


  constructor(props) {
    super(props);
    this.state = {
      selection: [],
      selectAll: props.defaultSelectAll ? props.defaultSelectAll : false
    };
  }

  componentDidMount(){
    if (this.state.selectAll) {
      let selection = [];
        // we need to get at the internals of ReactTable
        const wrappedInstance = this.checkboxTable.getWrappedInstance();
        // the 'sortedData' property contains the currently accessible records based on the filter and sort
        const currentRecords = wrappedInstance.getResolvedState().sortedData;
        // we just push all the IDs onto the selection array
        currentRecords.forEach(item => {
          selection.push(item._original.id);
        });
      this.setState({ selection });

      if (this.props.onCheckBoxChanged && typeof this.props.onCheckBoxChanged === 'function') {
        this.props.onCheckBoxChanged(selection);
      }
      
    }
  };

  toggleSelection = (key, shift, row) => {
    let selection = [...this.state.selection];
    // check to see if the key exists
    if (selection.includes(key)) {
      // it does exist so we will remove it using destructing
      selection = selection.filter(val => val !== key);
    } else {
      // it does not exist so add it
      selection.push(key);
    }
    // update the state
    this.setState({ selection });

    if (this.props.onCheckBoxChanged && typeof this.props.onCheckBoxChanged === 'function') {
      this.props.onCheckBoxChanged(selection);
    }
  };

  toggleAll = () => {

    const selectAll = this.state.selectAll ? false : true;
    const selection = [];
    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach(item => {
        selection.push(item._original.id);
      });
    }
    this.setState({ selectAll, selection });

    if (this.props.onCheckBoxChanged && typeof this.props.onCheckBoxChanged === 'function') {
      this.props.onCheckBoxChanged(selection);
    }
  };

  isSelected = key => {
    return this.state.selection.includes(key);
  };

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.data, nextProps.data)) {
      //if data coming to table changes, recalculate select All / selection
      if (this.state.selectAll) {
        let selection = [];
          // we just push all the IDs onto the selection array
          nextProps.data.forEach(item => {
            selection.push(item.id);
          });
        this.setState({ selection });
  
        if (this.props.onCheckBoxChanged && typeof this.props.onCheckBoxChanged === 'function') {
          this.props.onCheckBoxChanged(selection);
        }
      }
    }
  }


  render() {
    const {
      data,
      defaultSorted,
      pageSize,
      isSelectable,
      showPagination,
      showPaginationTop,
      showPaginationBottom,
      sortable,
      resizable,
      filterable,
      loading
    } = this.props;

    const baseClassName = 'pb-table';
    const { toggleSelection, toggleAll, isSelected } = this;
    const { selectAll } = this.state;

    let columns = []

    this.props.columns.forEach(column => {columns.push({
                                  Header: column.header,
                                  accessor: column.accessor,
                                  headerClassName: `${baseClassName}__header`})
                              });

    const classes = {
      [baseClassName]: true
    };

    const checkboxProps = {
      selectAll,
      isSelected,
      toggleSelection,
      toggleAll,
      selectType: "checkbox"
    };

    const tableProps = {
      data: data,
      columns: columns,
      defaultSorted: defaultSorted ,
      defaultPageSize: pageSize,
      showPagination: showPagination,
      showPaginationTop: showPaginationTop,
      showPaginationBottom: showPaginationBottom,
      sortable: sortable,
      resizable: resizable,
      filterable: filterable,
      loading: loading,
      //Not showing any message if data is empty, it was messing with Loader message
      NoDataComponent: () => { return null },
      getTrProps: (state, rowInfo, column) => {
                    return {
                      className: (rowInfo && rowInfo.index && rowInfo.index % 2) === 0
                                  ?
                                  `${baseClassName}__tr--even`
                                  :
                                  `${baseClassName}__tr--odd`
                    };
                  } ,

      getTrGroupProps: (state, rowInfo, column) => {
                          return {
                            className: `${baseClassName}__tr-group`
                          };
                        } ,

      getTdProps: (state, rowInfo, column) => {
                    return {
                      className: `${baseClassName}__td`
                    };
                  }
    };

    return (
      <div className={classNames(classes)}>
        {
          isSelectable
          ?
          <CheckboxTable
            ref={r => (this.checkboxTable = r)}
            keyField="id"
            {... tableProps}
            {... checkboxProps}
          />
          :
          <ReactTable
            {... tableProps}
          />
        }
      </div>
    );
  }
};

export default Table;
