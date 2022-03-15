import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'ValidatePassword', async: true })
export class ValidatePasswordRule implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    return (/.{8,}/.test(value) && (/[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value)));
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `E3`;
  }
}
