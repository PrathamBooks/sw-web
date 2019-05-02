import { createActions } from "redux-actions";

export const { addNotification, removeNotification } = createActions({
  'ADD_NOTIFICATION': notification => ({ notification }),
  'REMOVE_NOTIFICATION': index => ({ index })
})

export const notify = options => {
  return dispatch => dispatch(
    addNotification(options)
  )
}

export const dismiss = index => {
  return dispatch => dispatch(
    removeNotification(index)
  )
}
