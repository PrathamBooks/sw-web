
import React from "react";
import { translate } from "react-polyglot";

import Modal from "../Modal";
import CenterModeCarousal from "../CenterModeCarousal";

const NextTranslationModal = ({
  t,
  onCloseClicked,
  nextTranslationBooks,
  viewport,
  nextSuggestionsType,
  translateToLanguage
}) => {
  return (
    <Modal
      onClose={onCloseClicked}
      narrow={viewport.xlarge}
      wide={viewport.large && !viewport.xlarge}
      extraWide={viewport.medium && !viewport.large}
    >
      <CenterModeCarousal
        onCloseClicked={onCloseClicked}
        books={nextTranslationBooks}
        nextSuggestionsType={nextSuggestionsType}
        translateToLanguage={translateToLanguage}
        viewport={viewport}
      />
    </Modal>
  );
};

export default translate()(NextTranslationModal);
