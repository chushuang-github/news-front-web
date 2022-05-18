export const collapsedAction = () => {
  return {
    type: 'change-collapsed'
  }
}

export const loadingAction = (payload) => {
  return {
    type: "change-loading",
    payload
  }
}