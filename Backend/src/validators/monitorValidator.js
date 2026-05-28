import { body, validationResult } from "express-validator";

export const validateMonitor = [
  body("name")
    .optional()
    .isString()
    .trim(),

  body("url")
    .notEmpty()
    .withMessage("URL is required")
    .isURL()
    .withMessage("Valid URL is required"),

  body("method")
    .optional()
    .isIn(["GET", "POST"])
    .withMessage("Only GET and POST are supported"),

  body("headers")
    .optional()
    .isObject()
    .withMessage("Headers must be an object"),

  body("body")
    .optional()
    .isObject()
    .withMessage("Body must be an object"),

  body("expectedStatus")
    .optional()
    .isInt({ min: 100, max: 599 })
    .withMessage("Expected status must be valid"),

  body("timeout")
    .optional()
    .isInt({ min: 100 })
    .withMessage("Timeout must be >= 100ms"),

  body("interval")
    .optional()
    .isInt({ min: 5 })
    .withMessage("Interval must be at least 5 seconds"),

  body("nextRunAt")
    .optional()
    .isDate()
    .withMessage("Next run time must be a valid date"),

  //  validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }
    next();
  }
];