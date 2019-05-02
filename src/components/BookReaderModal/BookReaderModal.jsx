import React from 'react';
import { translate } from 'react-polyglot';

import Modal from '../Modal';
import BookReader from '../BookReader';

const BookReaderModal = ({ onCloseClicked, assets, t, viewport, offline, userEmail, userRoles, book, recordBookReadCompleted, recordGaEvents, windowDimensions, showAudioBookReader, openNextReadSuggestions, addSmileyRatingModal, startPage, fetchSmileyRatingBook, slug , showAttributionPage, addSlimNotification }) => {

  if(!(assets && assets.pages))
  return null;
  let attributionPages = [...assets.pages];
  let index = attributionPages.findIndex(page => page.isLastStoryPage === true);
  attributionPages = attributionPages.splice(index+1, attributionPages.length-index)
  return (
    <Modal
      noContentPadding
      noDimensionRestrictions>
      <BookReader 
        pages={ showAttributionPage ? attributionPages : assets.pages}
        cssHref={assets.css}
        viewport={viewport}
        orientation={assets.orientation}
        onClose={onCloseClicked}
        language={assets.language}
        level={assets.level}
        offline={offline}
        userEmail={userEmail}
        userRoles={userRoles}
        book={book}
        startPage={startPage}
        recordBookReadCompleted={recordBookReadCompleted}
        recordGaEvents={recordGaEvents}
        windowDimensions={windowDimensions}
        openNextReadSuggestions={openNextReadSuggestions}
        showAudioBookReader={showAudioBookReader}
        addSmileyRatingModal={addSmileyRatingModal}
        fetchSmileyRatingBook={fetchSmileyRatingBook}
        assets={assets}
        slug={slug}
        addSlimNotification={addSlimNotification}
      />
    </Modal>
  );
};

export default translate()(BookReaderModal);
