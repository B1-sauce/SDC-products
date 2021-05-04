DROP DATABASE shoppingDB IF EXISTS;
CREATE shoppingDB;
USE shoppingDB;

CREATE TABLE products(
  product_id INT NOT NULL PRIMARY KEY,
  name VARCHAR(40),
  slogan VARCHAR(40),
  description VARCHAR(100),
  category VARCHAR(50),
  default_price VARCHAR(50)
)
CREATE TABLE related_items(
  id INT NOT NULL PRIMARY KEY,
  product_id INT NOT NULL,
  related_items_id INT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(product_id),
  FOREIGN KEY (related_items_id) REFERENCES products(product_id)
)
CREATE TABLE features(
  feature_id INT NOT NULL PRIMARY KEY,
  feature VARCHAR(40),
  value VARCHAR(40),
  product_id INT NOT NULL ,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
)
CREATE TABLE styles(
  style_id INT NOT NULL PRIMARY KEY,
  name VARCHAR(40),
  original_price VARCHAR(40),
  sale_price VARCHAR(40),
  default BOOLEAN
)
CREATE TABLE productsStylesRelation(
  id INT NOT NULL PRIMARY KEY,
  product_id INT NOT NULL,
  style_id INT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(product_id),
  FOREIGN KEY (style_id) REFERENCES styles(style_id)
)
CREATE TABLE photos(
  photo_id INT NOT NULL PRIMARY KEY,
  thumbnail_pic VARCHAR(200),
  main_pic VARCHAR(200)
  style_id INT NOT NULL,
  FOREIGN KEY (style_id) REFERENCES styles(style_id)
)
CREATE TABLE skus(
  skus_id INT NOT NULL PRIMARY KEY,
  quantity INT,
  size VARCHAR(40) NOT NULL,
  style_id INT NOT NULL,
  FOREIGN KEY (style_id) REFERENCES styles(style_id)
)
