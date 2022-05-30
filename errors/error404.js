class Error404 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = Error404;
