const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class User {
  constructor(name, email, cart, id) {
    (this.name = name),
      (this.email = email),
      (this.cart = cart),
      (this._id = id);
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => console.log(err));
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const db = getDb();
    const updatedCartItems = [...this.cart.items];
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = { items: updatedCartItems };
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }
}
module.exports = User;
