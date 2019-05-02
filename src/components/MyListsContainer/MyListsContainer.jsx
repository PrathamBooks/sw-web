import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import { fetchUserListsWorkflow, deleteUserListWorkflow } from '../../redux/userActions'

import Block from '../Block';
import PageHeader from '../PageHeader';
import ReadingLists from '../ReadingLists';
import LoaderBlock from '../LoaderBlock';
import ConfirmModal from '../ConfirmModal';

import { links } from '../../lib/constants';


const mapStateToProps = ({ user, viewport }) => ({
  isFetchingLists: user.isFetchingLists,
  lists: user.lists,
  viewport
});

const mapDispatchToProps = {
  fetchUserListsWorkflow,
  deleteUserListWorkflow
};


@translate()
@connect(mapStateToProps, mapDispatchToProps)
class MyListsContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isConfirmModalVisible: false
    };

  }

  closeModal = () => {
    this.setState({isConfirmModalVisible: false});
  }

  deleteList = () => {
    this.props.deleteUserListWorkflow(this.state.listId);
    this.closeModal();
  }
  
  componentWillMount() {
    this.props.fetchUserListsWorkflow();
  }
  
  handleOptionsClick = (listSlug, type, evt) => {

    let listId = listSlug.split('-')[0];

    switch(type) {
      case "DELETE":
        this.setState({
          isConfirmModalVisible: !this.state.isConfirmModalVisible,
          listId: listId
        });
        break;
      default: 
        console.log("No valid options match found!");
    }
  }

  render() {
    const baseClassName = 'pb-my-lists-container';

    const {
      isFetchingLists,
      lists,
      t,
      viewport
    } = this.props;
    
    const breadcrumbPaths = [{
      title: t('global.home'),
      href: links.home()
    },{
      title: t("global.my-lists")
    }
    ];
    
    if (isFetchingLists || !lists) {
      return <LoaderBlock />;
    }

     if (!isFetchingLists && !lists) {
      return <Block><h1>Error fetching Lists</h1></Block>;
    }

    return (
      <div >
        <DocumentTitle title={`${t('global.my-lists')} - ${t('global.site-title')}`} />
        <PageHeader title={t("global.my-lists")} breadcrumbPaths={breadcrumbPaths} />
        <Block>
          <div className={`${baseClassName}__lists ${baseClassName}__lists--narrow`}>
            <ReadingLists lists={lists} 
            showDescription 
            menuOpt= {true}
            handleOptionsClick={this.handleOptionsClick} />
          </div>
        </Block>
        {
        this.state.isConfirmModalVisible
        ?
        <ConfirmModal
             text= {t("global.list-del-confirm")} 
             onConfirm={this.deleteList}
             onClose={this.closeModal}
             viewport={viewport}
            />
          :
          null
        }
       </div>
    );
  }
}

export default MyListsContainer;