const pg = require('pg')
const express = require('express')

const app = express();

app.get('/', async(req, res, next)=>{
    try{
        const response = await client.query('SELECT * FROM Brand;')
        const brands = response.rows;
        res.send(`
            <html>
                <head>
                </head>
                <body>
                    <h1>
                        Sneaker World
                    </h1>
                    <h2>
                        Brands
                    </h2>
                    <ul>
                    ${
                        brands.map(brand =>{
                            return(`
                                <li>
                                    <a href='/brands/${brand.id}'>
                                        ${brand.name}
                                    </a>
                                </li>
                            `)
                        }).join('')
                    }
                    </ul>
                </body>
            </html>
        `)
    }
    catch(err){
        next(err);
    }
})




const port = process.env.PORT || 3000;


const client = new pg.Client('postgress://localhost/sneaker_world_db');


const syncAndSeed = async() =>{
    const SQL = `
        DROP TABLE IF EXISTS Sneaker;
        DROP TABLE IF EXISTS Brand;
        CREATE TABLE Brand(
            id INTEGER PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );
        
        CREATE TABLE Sneaker(
            id INTEGER PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            brand_id INTEGER REFERENCES Brand(id)
            );
        INSERT INTO Brand(id, name) VALUES (1, 'Nike');
        INSERT INTO Brand(id, name) VALUES (2, 'Converse');
        INSERT INTO Brand(id, name) VALUES (3, 'Addidas');
        INSERT INTO Sneaker(id, name, brand_id) VALUES(1, 'Air Jordan', 1);
        INSERT INTO Sneaker(id, name, brand_id) VALUES(2, 'Air Max', 1);
        INSERT INTO Sneaker(id, name, brand_id) VALUES(3, 'Chuck Taylor', 2);
        INSERT INTO Sneaker(id, name, brand_id) VALUES(4, 'One Star', 2);

    `;
    await client.query(SQL);
}


const setUp = async()=>{
    try{
       await client.connect();
       await syncAndSeed();
       console.log('connected to db')
       app.listen(port, () => console.log(`listening on port ${port}`))
    }
    catch(err){
        console.log(err)
    }    
}

setUp();