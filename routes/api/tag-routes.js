const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
// Using async/await for all CRUD methods

router.get('/', async (req, res) => {
  // find all tags
  try {
    // Using the finAll method to get all Tags
    const tagsData = await Tag.findAll({
      // Including the Product model using ProductTag as a reference
      include: [{ model: Product, through: ProductTag }],
    });
    // Returning a 200 Status and the data if succesful
    res.status(200).json(tagsData);
    // Returning a 500 error if needed
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  try {
    // Using findbyPK to gather data by specific id
    const tagData = await Tag.findByPk(req.params.id, {
      // Including prodect model again through Product tag
      include: [{ model: Product, through: ProductTag }],
    });
    // If no id is found will return a 400 error and message
    if (!tagData) {
      res.status(400).json({ message: 'No tag found with this id!' });
      return;
    }
    // Return 200 status and data if succesfull
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Post route for creating a new tag
router.post('/', async (req, res) => {
  try {
    // Using the create method to create a new tag
    const newTag = await Tag.create(req.body);
    // return the data if succesfull 
    res.status(200).json(newTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Put route for updating a tag
router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    // Using the update method to update a tag by specific id
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    // Checking the returned array for the amount of changed rows. 
    // This is in the [0] index of the data so if it is zero, then we were unsuccesfull 
    if (!updatedTag[0]) {
      res.status(400).json({ message: 'No tag found with this id!' });
      return;
    }
    // return 200 status and data if succesful
    res.status(200).json(updatedTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete route for a tag by specific id
router.delete('/:id', async (req, res) => {
  try {
    // using the destroy method to remove data by search peramater id
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    // checking if a proper id was queried. If not return a 400 error and message
    if (!deletedTag) {
      res.status(400).json({ message: 'No tag found with this id!' });
      return;
    }
    // return 200 status and data if succesfull
    res.status(200).json(deletedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
