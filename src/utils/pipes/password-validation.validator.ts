import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ async: true })
export class PasswordIsValidConstraint implements ValidatorConstraintInterface {
    validate(password: string, args: ValidationArguments) {
        const regexValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        const regexValidate = regexValidation.test(password)

        return regexValidate;

    }
}

export function PasswordIsValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: PasswordIsValidConstraint,
        });
    };
}