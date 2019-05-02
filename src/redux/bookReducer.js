import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './bookActions';
import { receiveCreateReadingList } from './readingListsActions';
import { cloneDeep } from 'lodash';


const initialState = {
  isFetchingBook: false,

  // TODO: save books by slug to avoid race conditions.
  // By extension, everything else gets saved by slug as well.
  book: null,
  isReleveling: false,
  isAddingToOrRemovingFromEditorsPicks: false,

  // TODO: store these booleans keyed by slug. See next comment for
  // more info.
  isFetchingAssets: false,

  // TODO: store assets keyed by slug, so we can store data
  // for multiple books at a time. This is because books can
  // be read from several pages across the app.
  assets: {},

  // Keys are book IDs, values are arrays with list IDs.
  isAddingOrRemovingFromList: { },

  // Just a list of books.
  isAddingOrRemovingFromBookshelf: [],

  isLikingBook: false,

  // Keys are strings, representing book slugs. Values are booleans.
  isFlaggingBook: { },
  isGlobalNextReadSuggestionsVisible: false,
  isGlobalBookReaderVisible: false,
  showAttributionPage: false,
  showAudioBookReader: false,
  globalBookReaderStartPage: 1,
  isGlobalQuickViewVisible: false,
  currentGlobalQuickViewBook: {},
  isFetchingNextReadBooks: false,
  nextReadBooks: null,
  currentGlobalBookReaderBook: {},
  isSubmittingSmileyRating: false,
  isFetchingSmileyRatingBook: false,
  smileyRatingBook: {},
  currentGlobalBookReaderSlug: "",
  isFetchingBookDownloadLimit: false,
  nextTranslationBooks: null,
  isFetchingNextTranslationBooks: false
};


const handleAddOrRemoveFromList = (state, action) => {
  const isAddingOrRemovingFromList = state.isAddingOrRemovingFromList[action.payload.bookSlug] || [];
  const updatedIsAddingOrRemovingFromList = [].concat(isAddingOrRemovingFromList, action.payload.listSlug);

  return u({
    isAddingOrRemovingFromList: {
      [action.payload.bookSlug]: updatedIsAddingOrRemovingFromList
    }
  }, state);
};


export default handleActions({
  [actions.fetchBook]: (state, action) => u({
    isFetchingBook: true,
    book: null,
    nextReadBooks: null
  }, state),

  [actions.receiveBook]: (state, action) => u({
    isFetchingBook: false,
    book: action.payload.book,
    nextReadBooks: action.payload.book.similarBooks
  }, state),
  
  [actions.fetchNextReadBooks]: (state, action) => u({
    isFetchingNextReadBooks: true
  }, state),

  [actions.receiveNextReadBooks]: (state, action) => u({
    isFetchingNextReadBooks: false,
    nextReadBooks: action.payload.nextReadBooks
  }, state),

  [actions.fetchSmileyRatingBook]: (state, action) => u({
    isFetchingSmileyRatingBook: true
  }, state),

  [actions.receiveSmileyRatingBook]: (state, action) => u({
    isFetchingSmileyRatingBook: false,
    smileyRatingBook: action.payload.smileyRatingBook
  }, state),

  [actions.fetchBookDownloadLimit]: (state, action) => u({
    isFetchingBookDownloadLimit: true
  }, state),

  [actions.receiveBookDownloadLimit]: (state, action) => u({
    isFetchingBookDownloadLimit: false
  }, state),

  [actions.addToList]: handleAddOrRemoveFromList,

  [actions.receiveAddToList]: (state, action) => {
    const updates = {};
    const isAddingOrRemovingFromList = state.isAddingOrRemovingFromList[action.payload.bookSlug];

    if (!isAddingOrRemovingFromList) {
      return state;
    }

    const updatedIsAddingOrRemovingFromList = isAddingOrRemovingFromList.filter(
      storySlug => storySlug !== action.payload.listSlug
    );

    updates['isAddingOrRemovingFromList'] = {
      [action.payload.bookSlug]: updatedIsAddingOrRemovingFromList
    };

    // If a book is added from a book card, we won't have list
    // memberships or even a book.
    if (state.book && state.book.lists) {
      const updatedListMemberships = [].concat(
        state.book.lists,
        { slug: action.payload.listSlug }
      );

      updates['book'] = {
        lists: updatedListMemberships
      };
    }

    return u(updates, state);
  },

  [actions.removeFromList]: handleAddOrRemoveFromList,

  [actions.receiveRemoveFromList]: (state, action) => {
    const isAddingOrRemovingFromList = state.isAddingOrRemovingFromList[action.payload.bookSlug];

    if (!isAddingOrRemovingFromList) {
      return state;
    }

    const updatedIsAddingOrRemovingFromList = isAddingOrRemovingFromList.filter(
      storySlug => storySlug !== action.payload.listSlug
    );

    const updatedListMemberships = state.book.lists.filter(({ slug }) => slug !== action.payload.listSlug);

    return u({
      isAddingOrRemovingFromList: {
        [action.payload.bookSlug]: updatedIsAddingOrRemovingFromList
      },
      book: {
        lists: updatedListMemberships
      }
    }, state);
  },

  [actions.postRelevel]: (state, action) => u({
    isReleveling: true
  }, state),

  [actions.receivePostRelevel]: (state, action) => {
    let updatedTranslations = state.book.translations.map((translation) => {
      let updatedTranslation = cloneDeep(translation);
      updatedTranslation.level = action.payload.newLevel
      return (updatedTranslation);
    });

    return u({
      isReleveling: false,
      book: {
        level: action.payload.newLevel,
        translations: updatedTranslations
      }
    }, state);
  },

  [actions.fetchBookAssets]: (state, action) => u({
    isFetchingAssets: true,
    currentGlobalBookReaderSlug: action.payload.slug
  }, state),

  [actions.receiveBookAssets]: (state, action) => {
    const updatesList = {
      isFetchingAssets: false,
      assets: action.payload.assets
    };

    if (state.book && state.book.readsCount) {
      updatesList.book = {
        readsCount: state.book.readsCount + 1
      }
    }

    return u(updatesList, state);
  },

  [actions.addToEditorsPicks]: (state, action) => u({
    isAddingToOrRemovingFromEditorsPicks: true,
  }, state),

  [actions.receiveAddToEditorsPicks]: (state, action) => u({
    isAddingToOrRemovingFromEditorsPicks: false,
    book: {
      editorsPick: true
    }
  }, state),

  [actions.removeFromEditorsPicks]: (state, action) => u({
    isAddingToOrRemovingFromEditorsPicks: true,
  }, state),

  [actions.receiveRemoveFromEditorsPicks]: (state, action) => u({
    isAddingToOrRemovingFromEditorsPicks: false,
    book: {
      editorsPick: false
    }
  }, state),

  [receiveCreateReadingList]: (state, action) => {
    // If no book is loaded, do nothing.
    if (!state.book) {
      return state;
    }

    // If a book is loaded, but the newly created list doesn't have it
    // in its `lists` array, do nothing.
    const isBookInList = Boolean(
      action.payload.readingList.books.find(b => b.id === state.book.id)
    );
    if (!isBookInList) {
      return state;
    }

    // Otherwise, update list membership.
    return u({
      book: {
        lists: state.book.lists.concat({ slug: action.payload.readingList.slug })
      }
    }, state);
  },

  [actions.likeBook]: (state, action) => u({
    isLikingBook: true
  }, state),

  [actions.receiveLikeBook]: (state, action) => u({
    isLikingBook: false,
    book: {
      liked: true,
      likesCount: state.book.likesCount + 1
    }
  }, state),

  [actions.postFlagBook]: (state, action) => u({
    isFlaggingBook: {
      [action.payload.bookSlug]: true
    }
  }, state),

  [actions.receivePostFlagBook]: (state, action) => u({
    book: {
      isFlagged: true
    },
    isFlaggingBook: {
      [action.payload.bookSlug]: false
    }
  }, state),

  [actions.postFlagBookError]: (state, action) => u({
    isFlaggingBook: {
      [action.payload.bookSlug]: false
    }
  }, state),

  [actions.postSmileyRating]: (state, action) => u({
    isSubmittingSmileyRating: true
  }, state),

  [actions.receivePostSmileyRating]: (state, action) => u({
    isSubmittingSmileyRating: false
  }, state),

  [actions.postSmileyRatingError]: (state, action) => u({
    isSubmittingSmileyRating: false
  }, state),

  [actions.openGlobalBookReader]: (state, action) => u({
    isGlobalBookReaderVisible: true,
    currentGlobalBookReaderBook: action.payload.book,
    showAudioBookReader: action.payload ? action.payload.showAudioBookReader : false,
    showAttributionPage: action.payload ? action.payload.showAttributionPage : false,
    globalBookReaderStartPage: (action.payload && action.payload.startPage) || 1
  }, state),

  [actions.closeGlobalBookReader]: (state, action) => u({
    isGlobalBookReaderVisible: false,
    showAudioBookReader: false,
    assets: null,
    globalBookReaderStartPage: 1
  }, state),
  
  [actions.openNextReadSuggestions]: (state, action) => u({
    isGlobalNextReadSuggestionsVisible: true
  }, state),

  [actions.closeNextReadSuggestions]: (state, action) => u({
    isGlobalNextReadSuggestionsVisible: false
  }, state),

  [actions.fetchNextTranslationBooks]: (state, action) => u({
    isFetchingNextTranslationBooks: true,
  }, state),

  [actions.receiveNextTranslationBooks]: (state, action) => u({
    isFetchingNextTranslationBooks : false,
    nextTranslationBooks: action.payload.nextTranslationBooks
  }, state),

  [actions.openGlobalQuickView]: (state, action) => u({
    isGlobalQuickViewVisible: true,
    currentGlobalQuickViewBook: action.payload.book
  }, state),

  [actions.closeGlobalQuickView]: (state, action) => u({
    isGlobalQuickViewVisible: false,
    currentGlobalQuickViewBook: null
  }, state),

  [actions.addToBookshelf]: (state, action) => u({
    isAddingOrRemovingFromBookshelf: [].concat(state.isAddingOrRemovingFromBookshelf, action.payload.bookSlug)
  }, state),

  [actions.receiveAddToBookshelf]: (state, action) => u({
    isAddingOrRemovingFromBookshelf: state.isAddingOrRemovingFromBookshelf.filter(
      slug => slug !== action.payload.bookSlug
    )
  }, state),

  [actions.removeFromBookshelf]: (state, action) => u({
    isAddingOrRemovingFromBookshelf: [].concat(state.isAddingOrRemovingFromBookshelf, action.payload.bookSlug)
  }, state),

  [actions.receiveRemoveFromBookshelf]: (state, action) => u({
    isAddingOrRemovingFromBookshelf: state.isAddingOrRemovingFromBookshelf.filter(
      slug => slug !== action.payload.bookSlug
    )
  }, state)
}, initialState);
