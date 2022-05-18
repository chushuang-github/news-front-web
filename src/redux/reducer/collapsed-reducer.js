const initState = {
  collapsed: false
}

function reducer(prevState = initState, action) {
  switch(action.type) {
    case 'change-collapsed':
      return { ...prevState, collapsed: !prevState.collapsed }
    default:
      return prevState
  }
}

export default reducer