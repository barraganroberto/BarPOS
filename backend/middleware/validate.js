import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array().map((e) => ({
                field: e.param,
                message: e.msg,
            })),
        });
    }
    next();
};
