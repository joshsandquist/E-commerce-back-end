const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint
// Using async await in all routes that need to be completed instead of .catch and .then

// get all products
router.get('/', async (req, res) => {
  try {
    // Using findAll method to find all products
    const products = await Product.findAll({
      // including the Category and Tag models 
      // using the through option to instruct sequelize to join Product and Tag using ProductTag as a reference
      include: [{ model: Category }, { model: Tag, through: ProductTag }],
    });
    // return 200 staus and data if successful
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product by id
router.get('/:id', async (req, res) => {
  try {
    // Using findbyPK here to get the product by specified id
    const product = await Product.findByPk(req.params.id, {
      // Using the same models as in the find all method
      include: [{ model: Category }, { model: Tag, through: ProductTag }],
    });
    // Return an error message if no product is found with a maching id
    if (!product) {
      res.status(400).json({ message: 'No product found with this id!' });
      return;
    }
    // Return 200 status and data if succesful
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// Deleting a single product by id

router.delete('/:id', async (req, res) => {
  try {
    // Using the destroy method to remove a product by id peramater
    const product = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    // Return a 400 error and message to the user if no product id is found
    if (!product) {
      res.status(400).json({ message: 'No product found with this id!' });
      return;
    }
    // Return data and success message
    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
