export default (state = null, action: any) => {
  switch (action.type) {
    case "SET_COMMUNITY":
      state = action.payload
      return state
    default:
      return state
  }
}
