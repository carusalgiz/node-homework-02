import Joi, { ValidationResult, ObjectSchema } from 'joi';

const schema: ObjectSchema<unknown> = Joi.object({
    login: Joi.string()
        .alphanum()
        .min(6)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp(/\d/))
        .pattern(new RegExp(/[a-zA-Z]/))
        .required(),

    age: Joi.number()
        .min(4)
        .max(130)
        .required()
});

export function validate(data: {login: string, password: string, age: number}): ValidationResult {
    return schema.validate(data, { abortEarly: false });
}
