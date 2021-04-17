const db = require("../config/connection");
const collections = require("../config/collections");
module.exports = {
  addProduct: (product, callback) => {
    db.get()
      .collection("products")
      .insertOne(product)
      .then((data) => {
        console.log("database insert " + data);
        callback(data.ops[0]._id);
      });
  },
  getAllProduct: async() => {
    let product =await db.get().collection(collections.PROUDCT_COLLECTION).find().toArray(); 
    return product;
    }
   
    
  
};
