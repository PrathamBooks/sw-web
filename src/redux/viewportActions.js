import { getUiConfig } from '../lib/ui';

// TODO: Move this to redux-actions
const VIEWPORT_WIDTH_MATCHED = 'VIEWPORT_WIDTH_MATCHED'
const VIEWPORT_WIDTH_NOT_MATCHED = 'VIEWPORT_WIDTH_NOT_MATCHED'

export const mediaMatched = (media) => ({
  type: VIEWPORT_WIDTH_MATCHED,
  payload: { media }
});

export const mediaNotMatched = (media) => ({
  type: VIEWPORT_WIDTH_NOT_MATCHED,
  payload: { media }
});

const viewports = getUiConfig('ui-breakpoints');

const pxToEm = (px, baseFontSize) => {
  let base = 16;

  if (baseFontSize !== undefined) {
    base = baseFontSize;
  }

  return `${parseInt(px, 10) / base}em`;
};

export const initViewport = () =>
  (dispatch) => {
    Object.keys(viewports)
      .map((k) => {
        const query = `(min-width: ${pxToEm(viewports[k])})`;
        const mql = window.matchMedia(query);

        if (mql.matches) {
          dispatch(mediaMatched(k));
        } else {
          dispatch(mediaNotMatched(k));
        }

        mql.addListener((q) => {
          if (q.matches) {
            dispatch(mediaMatched(k));
          } else {
            dispatch(mediaNotMatched(k));
          }
        });

        return ({ media: k, query: mql });
      });
  };
