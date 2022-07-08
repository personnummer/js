export class PersonnummerError extends Error {
  constructor() {
    super('Invalid swedish personal identity number');
  }
}

export class PersonnumerFormatError extends Error {
  constructor() {
    super('Invalid format type');
  }
}
