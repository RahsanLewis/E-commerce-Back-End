import Product from './Product';
import Category from './Category';
import Tag from './Tag';
import ProductTag from './ProductTag';

Product.belongsTo(Category, {
  foreignKey: 'category_id',
});

Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE'
});

Product.belongsToMany(Tag, {
  through: { model: ProductTag, unique: false },
  foreignKey: 'product_id',
  as: 'tagIds'
});

Tag.belongsToMany(Product, {
  through: { model: ProductTag, unique: false },
  foreignKey: 'tag_id',
  as: 'taggedProduct'
});

export { Product, Category, Tag, ProductTag };
