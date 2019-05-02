import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';

import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import Modal from '../Modal';
import TextField from '../TextField';
import Picklist from '../Picklist';
import Dropdown from '../Dropdown';
import SelectField from '../SelectField';
import Link from '../Link';
import MenuContentWrapper from '../MenuContentWrapper';
import Notification from '../Notification';
import Checkbox from '../Checkbox';

import { findKey } from 'lodash';
import u from 'updeep';
import { keyCodes, links, licenses, roles as availableRoles } from '../../lib/constants';

import './IllustrationUploadModal.scss';

const limitList = (list) => {
  let result = '';
  
  if (list.length > 0  && list.length <= 2){
    result = list.join(", ");
  }

  if (list.length > 2 ){
    result = `${list[0]}, ${list[1]} + ${list.length - 2}`
  }

  return result;
}
// If tag search is not available in tags from API, add it in the tags result, else add and remove from the results from API
const tagValues= (tagsSearchValue, tags) => {
  return  [{name: tagsSearchValue, queryValue: tagsSearchValue}].concat(tags.filter(tag => tag.queryValue !== tagsSearchValue));
}

@translate()
class IllustrationUploadModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name:"",
      categorySearchValue: '',
      styleSearchValue: '',
      "category_ids": [],
      "style_ids": [],
      license_type: licenses[0].queryValue,
      image: null,
      isFormValid: false,
      termsOfUse: false,
      child_illustrators_attributes: [],
      illustrators_attributes: [{"email": "", "first_name": "", "last_name": "", "bio": ""}],
      error: null,
      tag_list: "",
      tagsSearchValue: '',
      illustratorSearchValue: '',
      checkedTag: null,
      checkedIllustrator: null,
      image_mode: false
    };
  }
  componentDidMount() {
    this.props.fetchNewIllustrationFormData();
  }

  updateStyleSearchValue = e => this.setState({styleSearchValue: e.target.value });
  updateCategorySearchValue = e => this.setState({categorySearchValue: e.target.value });

  updateTagsSearchValue = e => {
    this.setState({ tagsSearchValue: e.target.value });
    this.props.autocompleteTags(e.target.value);
  }

  handlePicklistChange = (type, value, checked) => {
    const index = this.state[type].indexOf(value);

    if (index !== -1 ) { 
      // item found
      this.setState({
        [type]: this.state[type].filter(style => style !== value)
      }, function() {
        this.isFormValid();
      });
    }
    else {
      this.setState({ 
        [type]: this.state[type].concat([value]) 
      }, function() {
        this.isFormValid();
      });
    }
  }

  handleTagsPicklistChange = (value, checked) => {
    if (checked) {
      this.setState({
        tag_list: this.state.tag_list.length > 0 ? `${this.state.tag_list},${value}` : value ,
        checkedTag: value
      })
    }
  }

  handleIllustratorsPicklistChange = (index, value, checked) => {
    const foundAt = findKey(this.props.illustratorSuggestions, { 'queryValue': value });
    const {firstName, lastName, bio} = this.props.illustratorSuggestions[foundAt];

     this.setState(u({ 
        illustrators_attributes: { [index]: { email: value, first_name: firstName, last_name: lastName, bio: bio }},
        checkedIllustrator:  value
      }, this.state), function() {
      this.isFormValid();
    });

  }

  handleCheckBox = e => this.setState(
      { termsOfUse: e.target.checked }, 
      function() {
        this.isFormValid();
      }
    );

  handleImageMode = imageMode => this.setState({ image_mode: imageMode.checked });

  onChange = (field,e) => {
    this.setState({ [field]: e.target.value }, function() {
      this.isFormValid();
    });
  }
  
  onChildChange = (index,e) => {
    this.setState(u({ 
        child_illustrators_attributes: { [index]: { name: e.target.value }} 
      }, this.state), function() {
      this.isFormValid();
    });
  }

  addChild = () => {
    const newChildIndex = this.state.child_illustrators_attributes.length;
    this.setState(u({ 
        child_illustrators_attributes: { [newChildIndex]: { name: "" }} 
      }, this.state));
  }

  removeChild = (childIndex) => {
    this.setState({
        child_illustrators_attributes: this.state.child_illustrators_attributes.filter((child,index) => index !== childIndex)
    });
  }

  onIllustratorSearchChange = e => {
    this.setState({ illustratorSearchValue: e.target.value });
    this.props.autocompleteIllustrators(e.target.value);
  }

  onIllustratorChange = (index, field ,e) => {
    this.setState(u({ 
        illustrators_attributes: { [index]: { [field]: e.target.value }} 
      }, this.state), function() {
      this.isFormValid();
    });
  }
  
  addIllustrator = () => {
    const newIllustratorIndex = this.state.illustrators_attributes.length;
    this.setState(u({ 
        illustrators_attributes: { [newIllustratorIndex]: { "email": "", "first_name": "", "last_name": "", "bio": "" }} 
      }, this.state));
    // Upon adding new illustrator set illustrator search box value to empty and suggest no illustrators.
    this.setState({ illustratorSearchValue: '' });
    this.props.autocompleteIllustrators('');
  }

  removeIllustrator = (illustratorIndex) => {
    this.setState({
        illustrators_attributes: this.state.illustrators_attributes.filter((illustrator,index) => index !== illustratorIndex)
    });
  }

  handleSelect = (field, value) => {
    this.setState({ [field]: value }, function() {
      this.isFormValid();
    });
  }

  handleFileSelect = (e) => {
    this.setState({ image: e.target.files[0]}, function() {
      this.isFormValid();
    });
  }

  onSubmit = () => {
    const formData = this.toFormData(this.state);

    const {
      onClose,
      uploadIllustration,
      fetchAllIllustrations,
      appliedFilters,
      initializeIllustrations
    } = this.props;


   uploadIllustration(formData).then(
      response => {
        if(response.ok){
          initializeIllustrations();
          fetchAllIllustrations(appliedFilters);
          onClose();
        } else {
          this.setState({ error: response.data});
        }          
      }
    );
  }

  onKeyPress = (e) => {
    if (e.charCode === keyCodes.return && this.state.isFormValid) {
        this.onSubmit();
    }
  };

  toFormData = (obj, form, namespace) => {
    let fd = form || new FormData();
    let formKey;
  
    for(let property in obj) {
      if(obj.hasOwnProperty(property) && obj[property]) {
        if (namespace) {
          formKey = namespace + '[' + property + ']';
        } else {
          formKey = property;
        }
       
        // if the property is an object, but not a File, use recursivity.
        if (obj[property] instanceof Date) {
          fd.append(formKey, obj[property].toISOString());
        }
        else if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
          this.toFormData(obj[property], fd, formKey);
        }
        else if ( formKey.includes("category_ids") || formKey.includes("style_ids") ){
            formKey = formKey.split('[')[0];
            fd.append(formKey + '[]', this.getIds(formKey, obj[property])) 
        } else { // if it's a string or a File object
            fd.append(formKey, obj[property]);
        }
      }
    }
  
    return fd;
  }

  getIds = (type, item) => {
    const { newFormData } = this.props;
    const listType = type === 'style_ids'? newFormData.style:newFormData.category
    const foundAt = findKey(listType.queryValues, { 'queryValue': item });

    return listType.queryValues[foundAt].id;

  }

  isFormValid = () => {

    const {userRoles,organizationRoles} = this.props;

    const isContentManager = userRoles && userRoles.includes(availableRoles.CONTENT_MANAGER)

    const isPublisher = organizationRoles && organizationRoles.includes(availableRoles.PUBLISHER)

    const { name, category_ids, style_ids, license_type, image, termsOfUse,illustrators_attributes } = this.state;
    let commonValidation = (name.length > 0 
      && image 
      && category_ids.length > 0 
      && style_ids.length > 0 
      && license_type.length > 0
      && termsOfUse )
    let adminValidation = true;
    if (isContentManager || isPublisher) {
      let fields = this.state.illustrators_attributes[0];
        if(!(illustrators_attributes.length > 0 &&  fields["email"].length > 0)){
          adminValidation = false;
        }
    }
      this.setState({ isFormValid: commonValidation && adminValidation});
  }

  closeErrorNotification = () => {
    this.setState({ 
      error: null
    });
  }
  handleTextChangeEvent = (e) => {
    this.setState({ tag_list: e.target.value});
  }

  render() {
    const baseClassName = 'pb-illustration-upload-modal';
    const {
      t,
      onClose,
      isUploadingIllustration,
      firstName,
      userRoles,
      tags,
      newFormData,
      illustratorSuggestions,
      organizationRoles
    } = this.props;

    const classes = {
      [baseClassName]: true,
    };

    const acceptEls = [
      t('Illustration.upload-accept-msg-1'),
      <Link 
        href={links.termsOfUse()} 
        shouldOpenNewPage
        normal
        >{t("Illustration.upload-accept-msg-2")}
      </Link>
    ];

    const uploadInstructionsTitleEl = t('Illustration.upload-pre-msg.title', { first_name: firstName });

    const uploadInstructionsEls = [
      t('Illustration.upload-pre-msg.p1'), 
      <Link 
        href={links.uploadGoodPractice()} 
        shouldOpenNewPage
        normal
        >{t('Illustration.upload-pre-msg.p2')}
      </Link>, 
      t('Illustration.upload-pre-msg.p3'),
      <Link 
        href={links.termsOfUse()} 
        shouldOpenNewPage
        normal
        >{t('Illustration.upload-pre-msg.p4')}
      </Link>, 
      t('Illustration.upload-pre-msg.p5'), 
    ];

    const footer = (
      <ButtonGroup>
        <Button
          parentClassName={`${baseClassName}__submit`}
          disabled={!this.state.isFormValid}
          label={t('Illustration.upload-form.submit')}
          onClick={this.onSubmit}
          variant="primary"
          loading={isUploadingIllustration}
          fullWidth/>
        <Button
          parentClassName={`${baseClassName}__cancel`}
          label={t('Illustration.upload-form.cancel')}
          onClick={onClose}
          fullWidth/>
    </ButtonGroup>
    );

    const childIllustratorsEls = this.state.child_illustrators_attributes.map( (child, index) =>{
        return (
          <div>
            <TextField
              id={`child-${index}`}
              label={t('Illustration.upload-form.name-of-child')}
              type='text'
              onChange={this.onChildChange.bind(this, index)}
              value={child.name}
            />
            <Link onClick={this.removeChild.bind(this, index)} normal>{t('Illustration.upload-form.remove-child')}</Link>
          </div>
        )
      }
    );

    const illustratorsEls = this.state.illustrators_attributes.map( (illustrator, index) =>{
        return (
          <MenuContentWrapper id={index} title={t('Illustration.upload-illustrator-heading')}>
            <Dropdown
              align="left"
              toggleEl={
                <TextField
                  label={t('Illustration.upload-form.illustrator-email')}
                  value={illustrator.email}
                />
              }
              minWidth='auto'
            >
              <Picklist
                id="illustration-upload-modal-email"
                label={t('Illustration.upload-form.illustrator-email')}
                parentClassName={`${baseClassName}__text-field}`}
                name="illustration-upload-modal-tag"
                multiplePicks={false}
                options={illustratorSuggestions}
                onSearchChange={this.onIllustratorSearchChange}
                onChange={this.handleIllustratorsPicklistChange.bind(this, index)}
                searchValue={this.state.illustratorSearchValue}
                height="s"
                checkedValues={this.state.checkedIllustrator}
                autoFocus
              />
            </Dropdown>
            <div className={`${baseClassName}__instructions-body`}>
               {t('Illustration.upload-add-illustrator-msg')}
            </div>
            <TextField
              id="illustrator-first-name"
              label={t('Illustration.upload-form.illustrator-firstname')}
              type='text'
              onChange={this.onIllustratorChange.bind(this, index, 'first_name')}
              value={illustrator.first_name || ''}
            />
            <TextField
              id="illustrator-last-name"
              label={t('Illustration.upload-form.illustrator-lastname')}
              type='text'
              onChange={this.onIllustratorChange.bind(this, index, 'last_name')}
              value={illustrator.last_name || ''}
            />
            <TextField
              id="illustrator-bio"
              label={t('Illustration.upload-form.illustrator-bio')}
              type='multiline'
              onChange={this.onIllustratorChange.bind(this, index, 'bio')}
              value={illustrator.bio || ''}
            />
            <div className={`${baseClassName}__instructions-body`}>
               {t('Illustration.upload-bio-msg')}
            </div>
            {
              this.state.illustrators_attributes.length > 1?
              <Link 
                normal
                onClick={this.removeIllustrator.bind(this, index)}>
                {t('Illustration.upload-remove-illustrator')}
              </Link>
            :
              null
            }
          </MenuContentWrapper>
        )
      }
    );



    const isContentManager = userRoles && userRoles.includes(availableRoles.CONTENT_MANAGER)

    const isPublisher = organizationRoles && organizationRoles.includes(availableRoles.PUBLISHER)
    const userImageContentType = isContentManager || isPublisher ? t('illustrationUpload.jpeg-png-gif') : t('illustrationUpload.jpeg-png');
    const illustratorDetailsEls =  (isContentManager || isPublisher) ?
      (<div>
        {
          newFormData?
          <div>
            <SelectField
              label={t('Illustration.upload-form.cm.copyright-year')} 
              options={newFormData.copyrightYear.queryValues}
              onChange={this.handleSelect.bind(this,'copy_right_year')}
              value={this.state.copy_right_year}
              formField
            />
            <SelectField
              label={t('Illustration.upload-form.cm.copyright-holder')}  
              options={newFormData.copyrightHolder.queryValues}
              onChange={this.handleSelect.bind(this,'copy_right_holder_id')}
              value={this.state.copy_right_holder_id}
              formField
            />
            {
              isContentManager
              ?
              <SelectField
                label={t('Illustration.upload-form.cm.org')}
                options={newFormData.publisher.queryValues}
                onChange={this.handleSelect.bind(this,'organization_id')}
                value={this.state.organization_id}
                formField
              />
              :
              null
            }
          </div>
          :
          null
        }
        <TextField
          id="img-attrib-txt"
          label={t('Illustration.upload-form.cm.attrib-txt')}
          type="multiline"
          onChange={this.onChange.bind(this,'attribution_text')}
          value={this.state.attribution_text}
        />
        <Checkbox
          label={t('Illustration.upload-form.cm.make-img-pvt')} 
          id={`${baseClassName}__make-private`}
          onChange={this.handleImageMode}
          checked={this.state.image_mode}
        />
        <div className={`${baseClassName}__illustrator-details`}>
          <div>
            {illustratorsEls}
          </div> 
          <div>
            <Link 
              onClick={this.addIllustrator}
              normal
              > {t('Illustration.upload-form.add-new-illustrator')}
            </Link>
          </div>
        </div> 
      </div>)
      :
      null;



    return (
      <div className={classNames(classes)}>
        <Modal footer={footer} header={<h2>{t('Illustration.upload-form.title')} </h2>}>
          {
            this.state.error ?
              <Notification
                content={this.state.error.errorMessage.map( msg => <p>{msg}</p>)}
                title={t('global.validation-error')}
                type="danger"
                dismissLabel={t('global.dismiss')}
                onDismiss={this.closeErrorNotification}
              />
            :
            null
          }
          <MenuContentWrapper
            title={uploadInstructionsTitleEl}
          >
          <div className={`${baseClassName}__instructions-body`}>
            {uploadInstructionsEls}
          </div>
        </MenuContentWrapper>
          <form onKeyPress={this.onKeyPress}>  
            <TextField
              ref={textField => this.textField = textField}
              id="illustration-modal-file"
              type='file'
              name={this.state.image ? this.state.image.name: null}
              onChange={this.handleFileSelect}
              onKeyPress={this.onKeyPress}
	      placeholder={userImageContentType}
            />
            <TextField
              id="img-name"
              label={t('Illustration.upload-form.name')}
              type='text'
              onChange={this.onChange.bind(this,'name')}
              value={this.state.name}
            />
             
            <Dropdown
              align="left"
              toggleEl={
                <TextField
                  id='illustration-modal-img-style-txt'
                  label={t('Illustration.upload-form.style')}
                  value={limitList(this.state.style_ids)}
                />
              }
              minWidth='auto'
            >
              <Picklist
                id="illustration-modal-img-styles"
                searchValue={this.state.styleSearchValue}
                onSearchChange={this.updateStyleSearchValue}
                options={newFormData? newFormData.style.queryValues: null}
                onChange={this.handlePicklistChange.bind(this, 'style_ids')}
                checkedValues={this.state.style_ids}
              />
            </Dropdown>
            <Dropdown
              align="left"
              toggleEl={
                <TextField
                  id='illustration-modal-img-category-txt'
                  label={t('Illustration.upload-form.category')}
                  value={limitList(this.state.category_ids)}
                />
              }
              minWidth='auto'
            >
              <Picklist
                id="illustration-modal-img-category"
                searchValue={this.state.categorySearchValue}
                onSearchChange={this.updateCategorySearchValue}
                options={newFormData? newFormData.category.queryValues: null}
                onChange={this.handlePicklistChange.bind(this, 'category_ids')}
                checkedValues={this.state.category_ids}
              />
            </Dropdown>
            <SelectField
              label={t('Illustration.upload-form.license')}
              options={licenses}
              onChange={this.handleSelect.bind(this,'license_type')}
              value={this.state.license_type}
            />
            <Dropdown
              align="left"
              toggleEl={
                <TextField
                  label={t('Illustration.upload-form.tags')}
                  onChange={this.handleTextChangeEvent}
                  value={this.state.tag_list}
                />
              }
              minWidth='auto'
            >
              <Picklist
                id="illustration-upload-modal-tags"
                label={t("Illustration.upload-form.tags")}
                parentClassName={`${baseClassName}__text-field}`}
                name="illustration-upload-modal-tag"
                multiplePicks={false}
                options={tagValues(this.state.tagsSearchValue, tags)}
                onSearchChange={this.updateTagsSearchValue}
                onChange={this.handleTagsPicklistChange.bind(this)}
                searchValue={this.state.tagsSearchValue}
                height="s"
                checkedValues={this.state.checkedTag}
                autoFocus
              />
            </Dropdown>
            {illustratorDetailsEls}
            <div className={`${baseClassName}__child-details`}>
              {t('Illustration.upload-add-child-msg')}
              <div>
                {childIllustratorsEls}
              </div> 
              <div>
                <Link 
                  onClick={this.addChild}
                  normal
                  >{t('Illustration.upload-add-child-link')}
                </Link>
              </div>
            </div>            
            
            <div className={`${baseClassName}__accept-clause`}>
              <input type="checkbox" 
                onChange={this.handleCheckBox}
                value={this.state.termsOfUse}
                /> {acceptEls}
            </div>

            </form>  
        </Modal>
      </div>
    );
  }
}

IllustrationUploadModal.propTypes = {
  parentClassName: PropTypes.string
};

export default IllustrationUploadModal;
