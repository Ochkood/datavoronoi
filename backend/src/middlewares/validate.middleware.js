const ApiError = require('../utils/api-error');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) {
      const message = parsed.error.issues?.[0]?.message || 'Validation failed';
      return next(new ApiError(400, message));
    }
    req[source] = parsed.data;
    next();
  };
}

module.exports = validate;
