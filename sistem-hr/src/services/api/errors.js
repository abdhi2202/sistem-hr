export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status ?? 500;
    this.payload = options.payload;
    this.errors =
      options.payload && typeof options.payload === 'object' && options.payload.errors
        ? options.payload.errors
        : {};
  }
}
