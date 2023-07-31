import { CustomError } from "./custom-error";

export class GenericServerError extends CustomError {
  statusCode = 500;

  constructor(public message: string = "Generic Server Error") {
    super(message);

    Object.setPrototypeOf(this, GenericServerError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
