const initState = {
  loading: false
}

function reducer(prevState = initState, action) {
  switch(action.type) {
    case 'change-loading':
      return { ...prevState, loading: action.payload }
    default:
      return prevState
  }
}

export default reducer