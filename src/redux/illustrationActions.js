import {
  createAsyncActions,
  runAsyncWorkflow
} from '../lib/reduxHelpers';

import { Illustration } from '../api';

export const [
  fetchIllustration,
  receiveIllustration,
  fetchIllustrationError
] = createAsyncActions(
  'ILLUSTRATION',
  slug => ({ slug }),
  ({ data }) => ({ illustration: data })
);

export const fetchIllustrationWorkflow = slug => {
  const fetchPromise = Illustration.fetch(slug);

  return runAsyncWorkflow({
    fetch: fetchIllustration,
    receive: receiveIllustration,
    error: fetchIllustrationError
  }, fetchPromise);
};

export const [
  fetchIllustrationDownloadLimit,
  receiveIllustrationDownloadLimit,
  fetchIllustrationDownloadLimitError
] = createAsyncActions(
  'ILLUSTRATION_DOWNLOAD_LIMIT',
  slug => ({ slug })
);

export const fetchIllustrationDownloadLimitWorkflow = slug => {
  const fetchPromise = Illustration.fetch(slug);

  return runAsyncWorkflow({
    fetch: fetchIllustrationDownloadLimit,
    receive: receiveIllustrationDownloadLimit,
    error: fetchIllustrationDownloadLimitError
  }, fetchPromise);
};

export const [
  likeIllustration,
  receiveLikeIllustration,
  likeIllustrationError
] = createAsyncActions(
  'LIKE_ILLUSTRATION',
  ({ slug }) => ({ slug })
);

export const likeIllustrationWorkflow = (slug) => {
  const likeIllustrationPromise = Illustration.like(slug);

  return runAsyncWorkflow(
    {
      fetch: likeIllustration,
      receive: receiveLikeIllustration,
      error: likeIllustrationError
    },
    likeIllustrationPromise
  );
};


export const [
  postFlagIllustration,
  receivePostFlagIllustration,
  postFlagIllustrationError
] = createAsyncActions(
  'FLAG_ILLUSTRATION',
  ({ slug, reasons }) => ({ slug, reasons })
);

export const postFlagIllustrationWorkflow = (slug, reasons) => {
  const fetchPromise = Illustration.flag(slug, reasons);

  return runAsyncWorkflow(
    {
      fetch: postFlagIllustration,
      receive: receivePostFlagIllustration,
      error: postFlagIllustrationError
    },
    fetchPromise,
    { slug, reasons }
  );
};

export const [
  fetchIllustrationFormData,
  receiveIllustrationFormData,
  fetchIllustrationFormDataError
] = createAsyncActions(
  'NEW_ILLUSTRATION_FORM_DATA',
  () => {},
  ({ data }) => ({ data })
);

export const fetchNewIllustrationFormDataWorkflow = () => {
  const fetchPromise = Illustration.fetchNewFormData();

  return runAsyncWorkflow({
    fetch: fetchIllustrationFormData,
    receive: receiveIllustrationFormData,
    error: fetchIllustrationFormDataError
  }, fetchPromise);
};

export const [
  uploadIllustration,
  receiveUploadIllustration,
  uploadIllustrationError
] = createAsyncActions(
  'UPLOAD_ILLUSTRATION',
  ({formData }) => ({ formData })
);

export const uploadIllustrationWorkflow = (formData) => {
  const fetchPromise = Illustration.upload(formData);

  return runAsyncWorkflow(
    {
      fetch: uploadIllustration,
      receive: receiveUploadIllustration,
      error: uploadIllustrationError
    },
    fetchPromise,
    { formData }
  );
};

export const [
  fetchAutoCompleteTag,
  receiveAutoCompleteTag,
  fetchAutoCompleteTagError
] = createAsyncActions(
  'AUTOCOMPLETE_TAG',
  () => {},
  ({ data }) => ({ data: data })
);

export const autocompleteTagsWorkflow = (searchValue) => {
  const fetchPromise = Illustration.tagsAutocomplete(searchValue)

  return runAsyncWorkflow({
    fetch: fetchAutoCompleteTag,
    receive: receiveAutoCompleteTag,
    error: fetchAutoCompleteTagError
  }, fetchPromise)
}


export const [
  fetchAutoCompleteIllustrators,
  receiveAutoCompleteIllustrators,
  fetchAutoCompleteIllustratorsError
] = createAsyncActions(
  'AUTOCOMPLETE_ILLUSTRATORS',
  () => {},
  ({ data }) => ({ data: data })
);

export const autocompleteIllustratorsWorkflow = (searchValue) => {
  const fetchPromise = Illustration.illustratorsAutocomplete(searchValue)

  return runAsyncWorkflow({
    fetch: fetchAutoCompleteIllustrators,
    receive: receiveAutoCompleteIllustrators,
    error: fetchAutoCompleteIllustratorsError
  }, fetchPromise)
}

export const [
  fetchConfirmImageFormat,
  receiveConfirmImageFormat,
  fetchConfirmImageFormatError
] = createAsyncActions(
  'CONFIRM_SELECTED_IMAGE_FORMAT',
  () => ({}),
  ({ data }) => ({ data })
);

export const fetchConfirmImageFormatWorkflow = (selectedStories) => {
  const fetchPromise = Illustration.fetchConfirmImageFormat(selectedStories);
  
  return runAsyncWorkflow({
    fetch: fetchConfirmImageFormat,
    receive: receiveConfirmImageFormat,
    error: fetchConfirmImageFormatError
  }, fetchPromise);
};
