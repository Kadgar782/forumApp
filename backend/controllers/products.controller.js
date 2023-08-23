const Product = require('../models/product.model.js')


class productController {
  
  async getProducts(req, res) {
    const page = parseInt(req.query.page || 0);
    const limit = parseInt(req.query.limit || 3);
    const endIndex = page + limit;
    try {
      const posts = await Product.find();
      const dividedPosts = posts.slice(page, page + limit);
      const hasMore = posts.length > endIndex;
      res.send({ posts: dividedPosts, hasMore });
    } catch (error) {
      res.status(404).json({ msg: "Post not found" });
    }
  }

  getProduct = async (req, res) => {
    try{
      const result = await Product.findOne({ _id: req.params.productID })
      if (!result) {
        throw new Error('Product not found'); 
      }
       return  res.status(200).json({ result });
    } catch (error) {
      res.status(404).json({ msg: "Post not found" });
    }
 
  };

  createProduct = (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    Product.create(req.body)
      .then((result) => res.status(200).json({ result }))
      .catch((error) => res.status(500).json({ msg: error }));
  };

  updateProduct = (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    Product.findOneAndUpdate({ _id: req.params.productID }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((result) => res.status(200).json({ result }))
      .catch((error) => res.status(404).json({ msg: "Product not found" }));
  };

  deleteProduct = (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    Product.findOneAndDelete({ _id: req.params.productID })
      .then((result) => res.status(200).json({ result }))
      .catch((error) => res.status(404).json({ msg: "Product not found" }));
  };
}

module.exports = new productController()