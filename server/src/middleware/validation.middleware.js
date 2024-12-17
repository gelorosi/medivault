export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.validateAsync(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      req.body = validated;
      next();
    } catch (error) {
      if (error.isJoi) {
        const errors = error.details.map((detail) => ({
          field: detail.context.key,
          message: detail.message,
        }));
        return res.status(400).json({ errors });
      }
      next(error);
    }
  };
};
