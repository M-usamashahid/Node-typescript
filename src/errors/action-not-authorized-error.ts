import { CustomError } from "./custom-error";

export class ActionNotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor(
    public message: string = "You are not authorized to perform this action."
  ) {
    super(message);

    Object.setPrototypeOf(this, ActionNotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
