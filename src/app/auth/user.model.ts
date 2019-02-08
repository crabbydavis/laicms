export class User {
  constructor(
    public name: string = '',
    public email: string = '',
    public type: UserType = null,
    public uid: string = ''
  ) {}
}

export enum UserType {
  Quality = 0,
  ProductionManager = 1,
  Super = 2,
  Worker = 3,
  Customer = 4
}
