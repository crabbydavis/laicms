export class User {
  constructor(
    public email: string = '',
    public firstName: string = '',
    public lastName: string = '',
    public planID: string = '',
    public planName: string = '',
    public planType: string = '',
    public signUpDate: string = '',
    public status: string = '',
    // public type: UserType = null,
    // public uid: string = ''
  ) {}
}

export enum UserType {
  Quality = 0,
  ProductionManager = 1,
  Super = 2,
  Worker = 3,
  Customer = 4
}
