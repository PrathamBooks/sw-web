import formurlencoded from 'form-urlencoded'
import queryString from 'query-string'

import { pagination } from './lib/constants';

const API_URL = process.env.REACT_APP_API_URL || 'https://dev.pbees.party/api/v1'


const getWithCredentials = url => fetch(url, { credentials: 'include' });
const postWithCredentials = (url, body, contentType = 'application/json') => fetch(url, {
  method: 'POST',
  body,
  credentials: 'include',
  headers: {
    'Content-Type': contentType
  }
});

// for 'multipart/form-data' 'content-type' will be undefined so
// that the browser auto detects data field boundaries.

const postMultiPartWithCredentials = (url, body) => fetch(url, {
  // mod: 'no-cors', // enable for posting to localhost:xxxx
  method: 'POST',
  body,
  credentials: 'include',
});


// Converts filters from a form supplied by our filter bar/filter panel
// into a form expected by the backend.
// Why? Because like idiots we hardcoded a bunch of these keys in the
// filters component, which is really complex. Changing one thing
// breaks a million other things, so it's easiest to do the translation
// here. If you're reading this in the future, pliss fix the filters
// bar and filters panel.
const sanitizeFilters = (appliedFilters) => {
  const query = { };

  if (!appliedFilters) {
    return query;
  }

  const optionalFilters = {
    category: 'categories',
    publisher: 'publishers',
    level: 'levels',
    language: 'languages',
    story_type: 'story_type',
    query: 'query',
    tags: 'tags',
    sort: 'sort',
    derivation_type: 'derivation_type',
    status: 'status',
    style: 'styles',
    // This query string is passed to the URL, when a user clicks on 
    // 'More Stories' link from Image details page.
    illustration_slug: 'illustration_slug', 
    bulk_download: 'bulk_download'
  };

  Object.keys(optionalFilters).forEach(filterKey => {
    if (appliedFilters[filterKey] && appliedFilters[filterKey].length > 0) {
      query[optionalFilters[filterKey]] = appliedFilters[filterKey];
    }
  });

  return query;
}


export class User {
  static fetchProfile(slug, perPage = 24, page = 1) {
    return getWithCredentials(
      `${API_URL}/users/${slug}?${queryString.stringify({perPage: perPage, page: page})}`
    );
  }

  static fetchMore(profileName, slug, collection, page, perPage) {
    if (collection === 'illustrations') {
      return getWithCredentials(
        `${API_URL}/illustrations-search?search[illustrator_slugs]=${slug}&page=${page}&per_page=${perPage}`
      );
    }
  }

  static fetchMe() {
    return getWithCredentials(`${API_URL}/me`);
  }

  static fetchNotifications() {
    return getWithCredentials(`${API_URL}/flash_notice`);
  }

  static login(email, password, rememberMe) {
    return fetch(`${API_URL}/users/sign_in`, {
      method: 'POST',
      credentials: 'include',
      body: formurlencoded({
        'api_v1_user[email]': email,
        'api_v1_user[password]': password,
        'api_v1_user[remember_me]': rememberMe
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  static logout() {
    //Using /users/sign_out for old sign-out (so that we can display flash messages), else use /api/v1/users/sign_out
    return fetch(`${process.env.REACT_APP_FEATURE_AUTH ? API_URL : ''}/users/sign_out`, {
      method: 'DELETE',
      credentials: 'include'
    })
  }

  static signup(details) {
    return fetch(`${API_URL}/users`, {
      method: 'POST',
      credentials: 'include',
      body: queryString.stringify(details),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  static forgotPassword(email) {
    return fetch(`${API_URL}/users/password`, {
      method: 'POST',
      credentials: 'include',
      body: `api_v1_user[email]=${email}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  static resetPassword(password, confirmPassword, resetPasswordToken) {
    return fetch(`${API_URL}/users/password`, {
      method: 'PUT',
      credentials: 'include',
      body: queryString.stringify({
        'api_v1_user[password]': password,
        'api_v1_user[password_confirmation]': confirmPassword,
        'api_v1_user[reset_password_token]': resetPasswordToken
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  static resendConfirmationLink(email) {
    return fetch(`${API_URL}/users/confirmation`, {
      method: 'POST',
      credentials: 'include',
      body: `api_v1_user[email]=${email}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  static emailConfirmation(confirmationToken) {
    const qs = queryString.stringify({ confirmation_token: confirmationToken });
    return getWithCredentials(`${API_URL}/users/confirmation/?${qs}`);
  }

  static facebookAuth(name, email, uid) {
    return fetch(`${API_URL}/auth/facebook/callback`, {
      method: 'PATCH',
      credentials: 'include',
      body: queryString.stringify({
        'auth[name]': name,
        'auth[email]': email,
        'auth[uid]': uid
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  static googleAuth(name, email, uid) {
    return fetch(`${API_URL}/auth/google_oauth2/callback?auth[name]=${name}&auth[email]=${email}&auth[uid]=${uid}`, {
      method: 'PATCH',
      credentials: 'include',
      body: queryString.stringify({
        'auth[name]': name,
        'auth[email]': email,
        'auth[uid]': uid
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  static fetchLists() {
    return getWithCredentials(`${API_URL}/me/lists`);
  }

  static deleteList(listId) {
    return fetch(`${API_URL}/lists/${listId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
  }

  static changeLanguage(newLanguage) {
    return fetch(`${API_URL}/set-locale/${newLanguage}`, {
      method: 'POST',
      credentials: 'include'
    })
  }

  static fetchEmailStatus(email) {
    return fetch(`${API_URL}/user/status?email=${email}`)
  }

  static changeOfflinePopUpStatus() {
    return fetch(`${API_URL}/user/offline-book-popup-seen`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
  }

  static changeUserFeedbackModalStatus(feedbackType) {
    return fetch(`${API_URL}/user/popup-seen?popupType=${feedbackType}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
  }

  static updateConsent() {
    return fetch(`${API_URL}/update_consent_flag`, {
      method: 'POST',
      credentials: 'include'
    })
  }
}

export class Organisation {
  static fetchProfile(slug, perPage) {
    return getWithCredentials(`${API_URL}/organisations/${slug}?perPage=${perPage}`);
  }

  static search(searchValue) {
    return fetch(`${API_URL}/organizations/autocomplete?query=${searchValue}`)
  }

  static fetchAll(appliedFilters, page = 1, perPage = pagination.organisationsSearch) {
    const sanitizedFilters = sanitizeFilters(appliedFilters);

    const query = Object.assign({
      page,
      per_page: perPage
    }, sanitizedFilters);

    const qs = queryString.stringify(query, { arrayFormat: 'bracket' });
    return getWithCredentials(`${API_URL}/org-search?${qs}`);
  }
}

export class Publisher {
  static fetchProfile(slug, perPage = 24, page = 1) {
    return getWithCredentials(
      `${API_URL}/publishers/${slug}?${queryString.stringify({perPage: perPage, page: page})}`
    );
  }

  static fetchMore(profileName, slug, collection, page, perPage) {
    if (collection === 'editorsPick') {
      return getWithCredentials(
        `${API_URL}/books-search?${queryString.stringify({'publishers[]': profileName, page: page, per_page: perPage, sort: "Editor's Picks" })}`
      );
    } else {
      return getWithCredentials(
        `${API_URL}/books-search?${queryString.stringify({'publishers[]': profileName, page: page, per_page: perPage, sort: "New Arrivals" })}`
      );
    }
  }
}


export class Newsletter {
  static subscribe(email) {
    return fetch(`${API_URL}/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formurlencoded({
        email
      })
    });
  }
}


export class ReadingList {
  static fetchDetails(slug) {
    return getWithCredentials(`${API_URL}/lists/${slug}`);
  }

  static update(readingList) {
    return fetch(`${API_URL}/lists/${readingList.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(readingList)
    });
  }

  static postLike(slug) {
    return postWithCredentials(`${API_URL}/lists/${slug}/like`, '');
  }

  static create(title, description, books = []) {
    return postWithCredentials(`${API_URL}/lists`, JSON.stringify({
      title,
      description,
      books
    }));
  }

  static fetchAllFilters() {
    return getWithCredentials(`${API_URL}/lists/filters`);
  }

  static search(appliedFilters, page = 1, perPage = pagination.allLists) {
    const sanitizedFilters = sanitizeFilters(appliedFilters);

    const query = Object.assign({
      page,
      per_page: perPage
    }, sanitizedFilters);

    const qs = queryString.stringify(query, { arrayFormat: 'bracket' });
    return getWithCredentials(`${API_URL}/lists-search?${qs}`);
  }
}


export class Translation {
  static fetchBooks(sourceLanguage, targetLanguage, filters, page, perPage) {
    const options = {
      source_language: sourceLanguage,
      target_language: targetLanguage,
      page: page,
      per_page: perPage
    }

    if (filters.level.length) {
      options.reading_levels = filters.level;
    }
    if (filters.category.length) {
      options.categories = filters.category;
    }
    if (filters.publisher.length) {
      options.publishers = filters.publisher;
    }

    return getWithCredentials(
      `${API_URL}/books-for-translation?${queryString.stringify(options, {arrayFormat: 'bracket'})}`
    )
  }
  static fetchFilters() {
    return getWithCredentials(
      `${API_URL}/books/translate-filters`
    )
  }

  static fetchCheckTranslations(slug, translateToLanguage) {
    return getWithCredentials(
      `${API_URL}/stories/${slug}/check-translations?${queryString.stringify({translateToLanguage: translateToLanguage})}`
    )
  }
}


export class Book {
  static fetch(slug) {
    return getWithCredentials(`${API_URL}/stories/${slug}`);
  }

  static addToList(slug, listSlug) {
    return postWithCredentials(`${API_URL}/lists/${listSlug}/add_story/${slug}`);
  }

  static addToEditorsPicks(slug) {
    return postWithCredentials(`${API_URL}/stories/${slug}/add_to_editor_picks`);
  }

  static removeFromEditorsPicks(slug) {
    return postWithCredentials(`${API_URL}/stories/${slug}/remove_from_editor_picks`);
  }

  static removeFromList(slug, listSlug) {
    return fetch(
      `${API_URL}/lists/${listSlug}/remove_story/${slug}`,
      {
        method: 'DELETE',
        credentials: 'include'
      }
    );
  }

  static flag(slug, reasons) {
    return postWithCredentials(`${API_URL}/stories/${slug}/flag`, JSON.stringify(reasons));
  }

  static submitSmileyRating(storySlug, reaction) {
    return postWithCredentials(`${API_URL}/smiley_ratings`, JSON.stringify({storySlug, reaction}));
  }

  static fetchNextTranslationBooks(slug , translateToLanguage) {
    return getWithCredentials(`${API_URL}/stories/${slug}/translate_recommendations?${queryString.stringify({translateToLanguage})}`);
  }
  
  static relevel(slug, newLevel) {
    return postWithCredentials(`${API_URL}/stories/${slug}/relevel`, JSON.stringify({slug, newLevel}));
  }

  static fetchAssets(slug) {
    return getWithCredentials(`${API_URL}/stories/${slug}/read`);
  }

  static fetchAllFilters() {
    return getWithCredentials(`${API_URL}/books/filters`);
  }

  static fetchAll(appliedFilters, page = 1, perPage = pagination.allBooks) {
    const sanitizedFilters = sanitizeFilters(appliedFilters);

    const query = Object.assign({
      page,
      per_page: perPage
    }, sanitizedFilters);

    const qs = queryString.stringify(query, { arrayFormat: 'bracket' });
    return getWithCredentials(`${API_URL}/books-search?${qs}`);
  }

  static like(slug) {
    return postWithCredentials(`${API_URL}/stories/${slug}/like`);
  }

  static fetchCategoryHeaderImage(slug) {
    return getWithCredentials(`${API_URL}/category-banner/?${queryString.stringify({name: slug})}`);
  }

  static fetchConfirmStoryFormat(query) {
    return getWithCredentials(`${API_URL}/confirm_story_formats?${queryString.stringify(query)}`)
  }

}


export class Home {
  static fetch() {
    return getWithCredentials(`${API_URL}/home`)
  }

  static fetchBannerImages() {
    return fetch(`${API_URL}/home/banners`)
  }

  static fetchRecommendations() {
    return getWithCredentials(`${API_URL}/home/recommendations`)
  }

  static fetchCards() {
    return getWithCredentials(`${API_URL}/home/cards`)
  }

  static updateSubmitStoryNotice(){
    return getWithCredentials(`${API_URL}/disable_notice`)
  }
}


export class Offline {
  static save(slug, imageSize) {
    return fetch(`/offline-books/${slug}&imageSize=${imageSize}`, {
      method: 'POST'
    })
  }
}

export class Image {
  static fetchAllFilters() {
    return getWithCredentials(`${API_URL}/illustrations/filters`);
  }

  static fetchAll(appliedFilters, page = 1, perPage = pagination.images) {
    const sanitizedFilters = sanitizeFilters(appliedFilters);

    const query = Object.assign({
      page,
      per_page: perPage
    }, sanitizedFilters);

    const qs = queryString.stringify(query, { arrayFormat: 'bracket' });
    return getWithCredentials(`${API_URL}/illustrations-search?${qs}`);
  }
}

export class Person {
  static fetchAll(appliedFilters, page = 1, perPage = pagination.images) {
    const sanitizedFilters = sanitizeFilters(appliedFilters);

    const query = Object.assign({
      page,
      per_page: perPage
    }, sanitizedFilters);

    const qs = queryString.stringify(query, { arrayFormat: 'bracket' });
    return getWithCredentials(`${API_URL}/people-search?${qs}`);
  }
}

export class Illustration {

  static fetch(slug) {
    return getWithCredentials(`${API_URL}/illustrations/${slug}`);
  }

  static fetchAllFilters() {
    return getWithCredentials(`${API_URL}/illustrations/filters`);
  }

  static fetchAllIllustrations(appliedFilters, page = 1, perPage = pagination.allIllustrations) {
    const query = {
      page,
      per_page: perPage
    };

    const optionalFilters = {
      category: 'categories',
      publisher: 'publishers',
      style: 'styles',
      illustrator: 'illustrators',
      query: 'query',
      tags: 'tags',
      sort: 'sort',
      bulk_download: 'bulk_download'
    };

    Object.keys(optionalFilters).forEach(f => {
      if (appliedFilters[f] && appliedFilters[f].length > 0) {
        query[optionalFilters[f]] = appliedFilters[f];
      }
    });

    const qs = queryString.stringify(query, { arrayFormat: 'bracket' });
    return getWithCredentials(`${API_URL}/illustrations-search?${qs}`);
  }

  static like(slug) {
    return postWithCredentials(`${API_URL}/illustrations/${slug}/like`);
  }

  static flag(slug, reasons) {
    return postWithCredentials(`${API_URL}/illustrations/${slug}/flag`, JSON.stringify(reasons));
  }

  static upload(formData) {
    return postMultiPartWithCredentials(`${API_URL}/illustration`, formData);
  }

  static tagsAutocomplete(searchValue) {
    return fetch(`${API_URL}/illustrations/autocomplete_tag_name?term=${searchValue}`)
  }

  static illustratorsAutocomplete(searchValue) {
    return fetch(`${API_URL}/illustrations/autocomplete_user_email?term=${searchValue}`)
  }
  
  static fetchNewFormData() {
    return fetch(`${API_URL}/illustration-fields`)
  }

  static fetchConfirmImageFormat(query) {
    return getWithCredentials(`${API_URL}/confirm_illustration_formats?${queryString.stringify(query)}`)
  }
}
