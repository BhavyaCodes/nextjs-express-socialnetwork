const reducer = (state, action) => {
  switch (action.type) {
    case "USER": {
      return { user: action.user };
    }
    case "LOGGED_OUT": {
      return { user: null };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
