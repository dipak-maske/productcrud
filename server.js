
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const { log, error } = require('console');



const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Default page for project
app.get('/index', (req, res) => {
    res.render('index');
  });

// MySQL Database connection.......
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Nimap',
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('your-password', 'latin1'),
  },
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});



//========== CRUD operations for Category========================//

// 1. API to insert category................
app.post('/insert', (req, res) => {
  const { categoryName } = req.body;
  const query = 'INSERT INTO categories (categoryName) VALUES (?)';

  connection.query(query, [categoryName], (err, results) => {
    if (err) throw error 
     else {
        res.render
        const query = 'SELECT * FROM categories';
        connection.query(query, (err, result) => {
          if (err) {
            console.error('Error fetching categories:', err.message);
            res.status(500).send('Error fetching categories');
          } else {
            res.render("category.ejs",{data : result});
          }
        });
    }
  });
});

// 2. To fetch all categories..........
app.get('/categories', (req, res) => {
  const query = 'SELECT * FROM categories';

  connection.query(query, (err, result) => {
    if (err) throw error
    else {
        const query = 'SELECT * FROM categories';
        connection.query(query, (err, result) => {
          if (err) throw error
           else {
            res.render("category.ejs",{data : result});
          }
        });
    }
  });
});


// 3. update category on category update page............
app.post('/cUpdate/:categoryId', (req, res) => {
  const id = req.params.categoryId;
  const name= req.body.categoryName;
  const query = `UPDATE categories SET categoryName="${name}" WHERE categoryId = ${id}`;

  connection.query(query, (error,result) => {
    if (error) throw error;
     else {

        const query = 'SELECT * FROM categories';
        connection.query(query, (err, result) => {
          if (err) throw error
           else {
            res.render("category.ejs",{data : result});
          }
        });
    }
  });
});


// 4, category update for select............
app.get('/update/:categoryId', (req, res) => {
    const id = req.params.categoryId;
    const query = `Select * From categories WHERE categoryId = ${id}`;
  
    connection.query(query, (error,result) => {
      if (error) throw error;
       else {
       res.render('categoryUpdate',{data : result})
       console.log(result)      
    }
    });
  });
  


// 4. API for Delete a category 
app.get('/delete/:categoryId', (req, res) => {
  const id = req.params.categoryId;
  const query = `DELETE FROM categories WHERE categoryId = ${id}`;

  connection.query(query, (err,result) => {
    if (err) throw err;
     else {

        const query = 'SELECT * FROM categories';
        connection.query(query, (err, result) => {
          if (err) throw error
           else {
            res.render("category.ejs",{data : result});
          }
        });
    }
  });
});



// APIS for rendering pages.......



// 1. To rend product page...
app.get('/product', (req, result) => {
    result.render('product', {data : result} );
  });

  // To rend category page...
app.get('/category', (req, result) => {
    result.render('category', {data : result} );
  });


  // To rend product page...
app.get('/home', (req, result) => {
    result.render('index');
  });

  

//APIs For product crud opeartion.......................

// 1. API for insert product..................
app.post('/insertproduct', (req, res) => {
 
    const id = req.body.fk_column_name;
    const name = req.body.productName;

    const query = `INSERT INTO product (fk_column_name, productName ) VALUES (${id}, "${name}")`;
    connection.query(query, (error, result) => {
      if (error) throw error
       else {
        const query = 'SELECT product.productId, product.productName, categories.categoryId, categories.categoryName FROM product INNER JOIN categories ON product.fk_column_name = categories.categoryId';
        connection.query(query, (error, result) => {
          if (error) throw error
           else {
            res.render("product.ejs",{data : result});
          }
        });
      }
    });
  });
  

  // 2. API to fetch Product......................
  app.get('/fetch', (req, res) => {
    const query = 'SELECT product.productId, product.productName, categories.categoryId, categories.categoryName FROM product INNER JOIN categories ON product.fk_column_name = categories.categoryId';

    connection.query(query, (err, results) => {
      if (err) throw error
       else {
        res.render("allProduct",{data : results});
      }
    });
  });
  


  
  // 4. API for delete product..............
  app.get('/productdelete/:productId', (req, res) => {
    const id = req.params.productId;
    const query = `DELETE FROM product WHERE productId = ${id}`;
  
    connection.query(query, (err,result) => {
      if (err) throw error
       else {
        const query = 'SELECT product.productId, product.productName, categories.categoryId, categories.categoryName FROM product INNER JOIN categories ON product.fk_column_name = categories.categoryId';
        connection.query(query, (err, result) => {
          if (err) throw error
           else {
            res.render("product.ejs",{data : result});
          }
        }); 
        }
    });
  });


// 5. API for update product on productUpdate page..................
  app.post('/pUpdate/:productId', (req, res) => {
    const id = req.params.productId;
    const name= req.body.productName;
    const cid = req.body.fk_column_name;
    const query = `UPDATE product SET productName="${name}",fk_column_name=${cid} WHERE productId = ${id}`;
  
    connection.query(query, (error,results) => {
      if (error) throw error;
       else {
  
          const query = 'SELECT product.productId, product.productName, categories.categoryId, categories.categoryName FROM product INNER JOIN categories ON product.fk_column_name = categories.categoryId';
          connection.query(query, (err, result) => {
            if (err) throw error
             else {
              res.render("product.ejs",{data : result});
            }
          });
      }
    });
  });
  
  
  // 5. API for update as select.............
  app.get('/uupdate/:productId', (req, res) => {
      const id = req.params.productId;
      const query = `Select * From product WHERE productId = ${id}`;
    
      connection.query(query, (error,result) => {
        if (error) throw error;
         else {
         res.render('productUpdate.ejs',{data : result})
         console.log(result)      
      }
      });
    });





// API for pagination
app.get('/pagination/:pageNumber', (req, res) => {
  const pageSize = 10;
  const pageNumber = req.query.pageNumber || 1;
  const offset = (pageNumber - 1) * pageSize;

  const query = `
    SELECT product.productId, product.productName, categories.categoryId, categories.categoryName
    FROM product
    INNER JOIN categories ON product.fk_column_name = categories.categoryId
    LIMIT ${pageSize} OFFSET ${offset};
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Assuming totalRecords is the total number of records in your database
    const totalRecords = 100; // Replace with the actual total number of records
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.render('allProduct.ejs', { data: results, totalPages });
  });
});


/*
// Disconnect from MySQL when the server is closed
app.on('close', () => {
  connection.end((err) => {
    if (err) {
      console.error('Error disconnecting from MySQL:', err);
      return;
    }
    console.log('Disconnected from MySQL');
  });
});
*/


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


