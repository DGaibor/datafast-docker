export class Order {
  constructor(
    public id: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public price: number,
    public quantity: number
  ) {}
}
