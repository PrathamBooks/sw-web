import { createActions } from "redux-actions";

export const { addSlimNotification, removeSlimNotification } = createActions({
  'ADD_SLIM_NOTIFICATION': slimNotification => ({ slimNotification }),
  'REMOVE_SLIM_NOTIFICATION': index => ({ index })
})

export const notify = options => {
  return dispatch => dispatch(
    addSlimNotification(options)
  )
}

export const dismiss = index => {
  return dispatch => dispatch(
    removeSlimNotification(index)
  )
}
