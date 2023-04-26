const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// Using async/await for my routes
router.get('/', async (req, res) => {
  try {
    // Using the findAll method to collect all stored categories
    const categories = await Category.findAll({
      //Joining with the Product model
      include: [{ model: Product }],
    });
    // Return the categoties if successful, else return a 500 error
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for finding a category by id
router.get('/:id', async (req, res) => {
  try {
    // Using findBy Primary Key this time for specific id search
    const category = await Category.findByPk(req.params.id, {
      // Joining Product model here as well
      include: [{ model: Product }],
    });
    //Sending a 400 error if the user enters an incorrect id
    if (!category) {
      res.status(400).json({ message: 'No category found with this id!' });
      return;
    }
    // If succesfull, send a 200 status with the searched category
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Post route to create a new category
router.post('/', async (req, res) => {
  try {
    // using the create method to take in the inputted data
    const newCategory = await Category.create(req.body);
    // respond with the newly created data, else return a user error
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Put route for updating a category by id
router.put('/:id', async (req, res) => {
  try {
    // Using the update method to update the selected id in the peramaters
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    // Checking to see if the update method affected any rows
    // The updatedCategory [0] index returns the amount of affected rows. If this is zero, then the category Id wasnt found.
    // We can then return an error message if the id is not found
    if (!updatedCategory[0]) {
      res.status(400).json({ message: 'No category found with this id!' });
      return;
    }
    // If successful, we return a 200 status
    res.status(200).json({ message: 'Category updated successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete route for deleting a category by id
router.delete('/:id', async (req, res) => {
  try {
    // Using the destroy method to delete a specified category by id
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    // If category id does not exist return a 400 error and a message to the user.
    if (!deletedCategory) {
      res.status(400).json({ message: 'No category found with this id!' });
      return;
    }
    // Return a 200 status and message of succesful
    
    res.status(200).json({ message: 'Category deleted successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
