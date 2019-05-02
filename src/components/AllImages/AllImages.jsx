import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import NoResults from '../NoResults';
import u from 'updeep';
import { isEqual } from 'lodash';

import ActionBar, {ActionBarSection} from '../ActionBar';
import Block from '../Block';
import Button from '../Button';
import Grid from '../Grid';
import ImageCard from '../ImageCard';
import PageHeader from '../PageHeader';
import Pagination from '../Pagination';
import LoaderBlock from '../LoaderBlock';
import Checkbox from '../Checkbox';
import SelectField from '../SelectField';
import Inliner from '../Inliner';
import SelectableGrid from '../SelectableGrid';

import IllustrationUploadModal from '../IllustrationUploadModal';
import ImagesBulkDownloadModal from './ImagesBulkDownloadModal';
import Link from '../Link';
import { MAX_BULK_DOWNLOAD_IMAGES_COUNT,
         links,
         gaEventCategories,
         gaEventActions,
         sectionClicked,
         bulkDownloadOptions,
         defaultBulkDownloadFormat,
         imageDownloadFormats,
         roles as availableRoles } from '../../lib/constants';

import './AllImages.scss';

const ImageCardsGridEl = ({images, onProfileLinkClicked, isSelectable, onChangeCheckedValues, allSelected}) => {
  const imageCardEls = images.map((image, i) => {
      return <ImageCard
                key={image.slug}
                id={image.id}
                title={image.title}
                subTitle={image.subTitle}
                slug={image.slug}
                artists={image.illustrators}
                image={image.imageUrls[0]}
                onProfileLinkClicked={onProfileLinkClicked}
                hasOverlay={isSelectable ? image.illustrationDownloaded : false }
              />;
  });
  if (isSelectable) {
    return (
      <SelectableGrid
        id="images-bulk-download-selectable-grid"
        variant="4up"
        roundedCorners
        onChange={onChangeCheckedValues}
        allSelected={allSelected}
        theme="primary"
        maxSelectAllowed={MAX_BULK_DOWNLOAD_IMAGES_COUNT}
      >
        {imageCardEls}
      </SelectableGrid>
    )
  }    
  else
    return <Grid variant="4up">{imageCardEls}</Grid>
};


@translate()
class AllImages extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isUploadNotificationVisible: false,
      isUploadFormOpen: false,
      // If bulk_download/image_bulk_download_format filter is already applied, will make the BulkDownload Tab visible(to take care of reload issue)
      isBulkDownloadTabClicked: this.props.appliedFilters.bulk_download ,
      checkedValues: [],
      allChecked: false,
      downloadFormat: defaultBulkDownloadFormat.images,
      isDownloadModalVisible: false,
    };

  }

  openUploadNotification = () => {
    const {
      isLoggedIn,
      addNotificationModal,
      t
    } = this.props;

    const notificationContent = [t("Illustration.upload-msg-2"),
    <Link href={links.ccLicense()} shouldOpenNewPage normal>{t("Illustration.upload-msg-3")}</Link>];
    this.setState({isUploadNotificationVisible: true});

    if ( isLoggedIn ) {
      addNotificationModal({
        title: t("Illustration.upload-msg-1"),
        content: notificationContent,
        additionalActions: [{
          label: t("global.yes"),
          primary: true,
          onClick: this.onConfirmNotification
        }, {
          label: t("global.no"),
          onClick: this.closeUploadNotification
        }]
      })
    }
    else
    {
      addNotificationModal({
        title: t("global.log-in"),
        content: t("illustrationUpload.please-log-in"),
        additionalActions: [{
          label: t('global.log-in'),
          primary: true,
          onClick: () => { window.location.href = links.login(); }
        }, {
          label: t('global.sign-up'),
          onClick: () => { window.location.href = links.signup(); }
        }
      ]
      })
    }
  }

  closeUploadNotification = () => {
    this.setState({isUploadNotificationVisible: false});
    this.props.removeNotificationModal();
  }

  openUploadForm = () => {
    this.setState({isUploadFormOpen: true});
  }

  closeUploadForm = () => {
    this.setState({isUploadFormOpen: false});
  }

  onConfirmNotification = () => {
    this.openUploadForm();
    this.closeUploadNotification();
  }

  onLoginClicked = () => {
    process.env.REACT_APP_FEATURE_AUTH
    ?
    this.props.openAuthModal()
    :
    window.location.href = links.login();
    this.closeUploadNotification();
  }

  onProfileLinkClicked = (profileSlug) => {
    const {
      recordGaEvents,
      userEmail,
    } = this.props;
  
    recordGaEvents({
      eventCategory: gaEventCategories.profile,
      eventAction: gaEventActions.opened,
      eventLabel: sectionClicked.allImagesPage,
      userEmail: userEmail,
      dimension5: profileSlug
    });
  }

  onChangeCheckedValues = (checkedValues) => {
    if(checkedValues.length >= MAX_BULK_DOWNLOAD_IMAGES_COUNT ) {
      this.props.addSlimNotification({
        type: 'info',
        content: this.props.t('Images.bulk-download-limit-text', MAX_BULK_DOWNLOAD_IMAGES_COUNT),
      });
    }

    this.setState(
      {checkedValues: checkedValues});
  }

  applyDownloadFormatOption = (value) => {

    if (value === imageDownloadFormats.hiResJpeg) {
      const isContentManager = this.props.userRoles && this.props.userRoles.includes(availableRoles.CONTENT_MANAGER)
    
      if (!isContentManager){
        this.props.addSlimNotification({
          type: 'info',
          content: this.props.t('Images.bulk-download-hi-res-warning'),
        });
      }
    }

    this.setState(
      { downloadFormat: value });

  };

  openBulkImagesDownload = () => {
    this.setState({isBulkDownloadTabClicked: true});
    this.props.onBulkDownloadOptionsChanged(true);
    //Adding filter All Images as default whenever DOWNNLOAD MULTIPLE Images button is clicked
    this.props.applyFilter('bulk_download', bulkDownloadOptions.allImages);
  }

  closeBulkImagesDownload = () => {
    const {
      onBulkDownloadOptionsChanged,
      clearFilter
    } = this.props;

    this.setState(u(
      { isBulkDownloadTabClicked: false,
        checkedValues: [],
        allChecked: false,
        downloadFormat: defaultBulkDownloadFormat.images }, this.state));
    //Removing bulkDownload filter whenever CANCEL button is clicked
    onBulkDownloadOptionsChanged(false);
    clearFilter('bulk_download');
  }

  allCheckedChange = (allChecked) => {
    this.setState({ allChecked: allChecked.checked });
  }

  downloadBulkImagesDownload= () => {
    this.props.fetchMeWorkflow()
    .then(response => {
      if(this.state.checkedValues.length > 0 ) {
        this.setState({isDownloadModalVisible: true});
      }
    })
  }

  bulkDownloadButtonClicked = (selectedValues) => {
    window.open(links.bulkImagesDownload(selectedValues));
    this.props.recordGaEvents({
      eventCategory: gaEventCategories.imageBulkDownload,
      eventAction: gaEventActions.download,
      userEmail: this.props.userEmail,
      metric4: selectedValues.length
    });
  this.setState({isDownloadModalVisible: false});
}

onCloseDownloadModal = () => {
  this.setState({isDownloadModalVisible: false});
}

onFormLinkClicked = () => {
  const {
    userEmail,
    name,
    organisation,
    country
  } = this.props;
  window.open(links.googleFormIllustrationDownloadLink({userEmail, name, organisation, country}));
  //closing the modal after opening the form
  this.setState({isDownloadModalVisible: false});
}

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.appliedFilters, nextProps.appliedFilters)) {
      // Reset all checked images on changing /applying new filters
      if(this.state.isBulkDownloadTabClicked) {
        this.setState({checkedValues: [], allChecked: false})
      }
    }
  }


  render() {
    const baseClassName = 'pb-all-images';

    const {
      t,
      images,
      isFetchingAllIllustrations,
      illustrationsInfo,
      isFirstPage,
      loadMore,
      filtersComponent,
      uploadIllustration,
      fetchAllIllustrations,
      appliedFilters,
      initializeIllustrations,
      isUploadingIllustration,
      firstName,
      userRoles,
      autocompleteTags,
      tags,
      autocompleteIllustrators,
      illustratorSuggestions,
      fetchNewIllustrationFormData,
      newFormData,
      organizationRoles,
      isLoggedIn,
      hasOwnIllustrations,
      bulkDownloadFormatOptions,
      downloadLimitReached,
      isOrganisationMember,
      confirmImageFormat,
      isfetchingConfirmImageFormat,
      isFetchingMe
    } = this.props;

    const breadcrumbPaths = [{
      title: t('global.home'),
      href: '/'
    }];

    const classes = {
      [baseClassName]: true
    };

    let buttonEl = (<Button 
                      fullWidth 
                      label={t("AllImages.cta-upload")} 
                      variant="primary" 
                      onClick={this.openUploadNotification}
                    />);

    let bulkDownloadComponent = null;

    const isContentManager = userRoles && userRoles.includes(availableRoles.CONTENT_MANAGER)
    
    const isPublisher = organizationRoles && organizationRoles.includes(availableRoles.PUBLISHER)
    
    const shouldShowBulkDownload = isLoggedIn && (isContentManager || isPublisher || isOrganisationMember || hasOwnIllustrations);

    if ( shouldShowBulkDownload ) {
      if (this.state.isBulkDownloadTabClicked) {
        bulkDownloadComponent = (
          <div className={`${baseClassName}`} >
            <ActionBar noTopBorder parentClassName={`${baseClassName}__bulk-download-action-bar`} >
              <ActionBarSection>
                <Checkbox	
                  label={t('global.bulk-download-images-select-all')}	
                  id="bulk-download-images-select-all"	
                  onChange={this.allCheckedChange}	
                  checked={this.state.allChecked}	
                  inline	
                />
              </ActionBarSection>
              <ActionBarSection forceAlignRight >
                <Inliner width='l'>
                  <SelectField
                    parentClassName={`${baseClassName}__select-format`}
                    value={this.state.downloadFormat}
                    id="bulk-download-select-format"
                    name="bulk-download-select-format"
                    onChange={this.applyDownloadFormatOption}
                    options={bulkDownloadFormatOptions}
                  />
                </Inliner>
                <Button
                  label={t("global.bulk-download-all")}
                  variant="primary"
                  onClick={this.downloadBulkImagesDownload}
                  disabled={this.state.checkedValues.length === 0 || this.state.downloadFormat === ""}
                  loading={isFetchingMe}
                  />
                <Button
                  label={t("global.cancel")}
                  onClick={this.closeBulkImagesDownload}
                />
              </ActionBarSection>
            </ActionBar>
            <div className={`${baseClassName}__bulk-download-count`}>
              <span className={`${baseClassName}__count`}>
                {`${t('global.bulk-download-count', {selectedCount: this.state.checkedValues.length, totalCount: images.length })} ${t('Images.bulk-download-images-warning')}`}
              </span>
            </div>
          </div>
        );
      }
      else
      {
        bulkDownloadComponent = (
          <ActionBar noTopBorder parentClassName={`${baseClassName}__bulk-download-action-bar`} >
            <ActionBarSection forceAlignRight >
              <Button
                label={t("global.images-bulk-download-button")}
                variant="primary"
                onClick={this.openBulkImagesDownload}
              />
            </ActionBarSection>
          </ActionBar>
        );
      }
    }
    
    

    return (
      <div className={classNames(classes)}>
        <PageHeader
          title={t("global.all-images")}
          breadcrumbPaths={breadcrumbPaths}
          actions={buttonEl}
          />
        { this.state.isDownloadModalVisible
          ?
          <ImagesBulkDownloadModal
            isVisible={this.state.isDownloadModalVisible}
            onCloseClicked={this.onCloseDownloadModal}
            bulkDownloadButtonClicked={this.bulkDownloadButtonClicked}
            imagesSelected={this.state.checkedValues}
            images={images}
            downloadLimitReached={downloadLimitReached}
            onFormLinkClicked={this.onFormLinkClicked}
            downloadFormat={this.state.downloadFormat}
            confirmImageFormat={confirmImageFormat}
            isfetchingConfirmImageFormat={isfetchingConfirmImageFormat}
          />
          :
          null
        }
        <Block>
          {filtersComponent}
          { bulkDownloadComponent }
          <ImageCardsGridEl 
            images={images} 
            onProfileLinkClicked={this.onProfileLinkClicked}
            isSelectable={this.state.isBulkDownloadTabClicked && shouldShowBulkDownload}
            onChangeCheckedValues={this.onChangeCheckedValues}
            allSelected={this.state.allChecked}/>
          { 
             isFirstPage ? <LoaderBlock /> : null
          }
          {
           (images.length < illustrationsInfo.hits) && !isFirstPage?  
              <Pagination 
                onClick={loadMore}
                loading={isFetchingAllIllustrations} />
            :
            null
          }
          {
            isFetchingAllIllustrations || images.length ? null : <NoResults />
          }
        </Block>
        {
          this.state.isUploadFormOpen
          ?
          <IllustrationUploadModal 
            onClose={this.closeUploadForm}
            uploadIllustration={uploadIllustration}
            fetchAllIllustrations={fetchAllIllustrations}
            appliedFilters={appliedFilters}
            initializeIllustrations={initializeIllustrations}
            isUploadingIllustration={isUploadingIllustration}
            firstName={firstName}
            userRoles={userRoles}
            organizationRoles={organizationRoles}
            autocompleteTags={autocompleteTags}
            tags={tags}
            autocompleteIllustrators={autocompleteIllustrators}
            illustratorSuggestions={illustratorSuggestions}
            fetchNewIllustrationFormData={fetchNewIllustrationFormData}
            newFormData={newFormData}
          />
          :
          null
        }
      </div>
    );
  }
}

AllImages.propTypes = {
  //images: PropTypes.arrayOf(PropTypes.shape(ImageCard.propTypes)),
  onClickUpload: PropTypes.func
};

export default AllImages;
