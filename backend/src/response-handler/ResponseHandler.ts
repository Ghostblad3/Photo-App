class ResponseHandler<T> {
  constructor(
    private code: number,
    private error: string | null,
    private data: T,
  ) {}

  getCode() {
    return this.code;
  }

  public toJSON() {
    return {
      status: this.error ? "error" : "success",
      data: this.data,
      error: { message: this.error ?? "" },
    };
  }
}
