const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: Tag,
          as: 'tags',
          through: {
            model: ProductTag,
            unique: false,
          },
        },
      ],
    });
    res.status(200).json(productData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const productDataById = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: Tag,
          as: 'tags',
          through: {
            model: ProductTag,
            unique: false,
          },
        },
      ],
    });
    if (!productDataById) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    res.status(200).json(productDataById);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const productData = await Product.create(req.body);
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: productData.id,
          tag_id,
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json(productTagIds);
    } else {
      res.status(200).json(productData);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const productData = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    await ProductTag.destroy({
      where: {
        product_id: req.params.id,
      },
    });
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json(productTagIds);
    } else {
      res.status(200).json(productData);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleteProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deleteProduct) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    res.status(200).json(deleteProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
