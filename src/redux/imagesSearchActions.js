import {
    createAsyncActions,
    runAsyncWorkflow
  } from '../lib/reduxHelpers';
  
  import { Image } from '../api';
  
  
  export const [
    fetchImagesFilters,
    receiveImagesFilters,
    fetchImagesFiltersError
  ] = createAsyncActions(
    'IMAGES_FILTERS',
    () => ({}),
    ({ data, sortOptions }) => ({ filters: data, sortOptions })
  );
  
  export const fetchImagesFiltersWorkflow = () => {
    const fetchPromise = Image.fetchAllFilters();
    
    return runAsyncWorkflow({
      fetch: fetchImagesFilters,
      receive: receiveImagesFilters,
      error: fetchImagesFiltersError
    }, fetchPromise);
  };
  
  
  export const [
    fetchImages,
    receiveImages,
    fetchImagesError
  ] = createAsyncActions(
    'IMAGES',
    ({ page, perPage }) => ({ page, perPage }),
    ({ data, metadata }) => ({ images: data, totalImagesCount: metadata.hits })
  );
  
  export const [
    fetchMoreImages,
    receiveMoreImages,
    fetchMoreImagesError
  ] = createAsyncActions(
    'MORE_IMAGES',
    ({ page, perPage }) => ({ page, perPage }),
    ({ data }) => ({ images: data })
  );
  
  export const fetchImagesWorkflow = (appliedFilters, page, perPage) => {
    const fetchingMore = page && page > 1;
    const fetchPromise = Image.fetchAll(appliedFilters, page, perPage);
    
    return runAsyncWorkflow({
      fetch: fetchingMore ? fetchMoreImages : fetchImages,
      receive: fetchingMore ? receiveMoreImages : receiveImages,
      error: fetchingMore ? fetchMoreImagesError : fetchImagesError
    }, fetchPromise);
  };
