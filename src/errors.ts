export class PersonnummerError extends Error {
  constructor() {
    super('Invalid swedish personal identity number');
  }
}
