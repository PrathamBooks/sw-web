import React from "react";
import { translate } from "react-polyglot";

import Modal from "../Modal";
import CenterModeCarousal from "../CenterModeCarousal";

const NextReadModal = ({
  t,
  onCloseClicked,
  onReadClicked,
  nextReadBooks,
  isFetchingBookAssets,
  viewport,
  slug
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
        onReadClicked={onReadClicked}
        books={nextReadBooks}
        isFetchingBookAssets={isFetchingBookAssets}
        viewport={viewport}
      />
    </Modal>
  );
};

export default translate()(NextReadModal);
