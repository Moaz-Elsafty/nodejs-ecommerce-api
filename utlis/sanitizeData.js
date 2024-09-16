exports.sanitizeSingnUpUser = function (user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

exports.sanitizeLogInUser = function (user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};
