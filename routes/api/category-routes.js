import express from 'express';
import { Category, Product } from '../../models';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product, as: 'products' }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoryDataById = await Category.findByPk(req.params.id, {
      include: [{ model: Product, as: 'products' }],
    });

    if (!categoryDataById) {
      res.status(404).json({ message: 'No category with that id.' });
      return;
    }

    res.status(200).json(categoryDataById);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newCategoryData = await Category.create(req.body);
    res.status(200).json(newCategoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [rowsUpdated] = await Category.update(
      { category_name: req.body.category_name },
      { where: { id: req.params.id } }
    );

    if (rowsUpdated === 0) {
      res.status(400).json({ message: 'No category found with this ID' });
      return;
    }

    res.status(200).json(rowsUpdated);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const rowsDeleted = await Category.destroy({
      where: { id: req.params.id },
    });

    if (rowsDeleted === 0) {
      res.status(400).json({ message: 'No category found with this ID' });
      return;
    }

    res.status(200).json(rowsDeleted);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default router;
