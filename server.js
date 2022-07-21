const {client, syncAndSeed} = require('./db')
const express = require('express');
const path = require('path')

const app = express();

app.use('/public', express.static(path.join(__dirname, 'public')))



app.get('/', async(req, res, next)=>{
    try{
        const response = await client.query('SELECT * FROM Brand;')
        const brands = response.rows;
        res.send(`
            <html>
                <head>
                <link rel='stylesheet' href='/public/styles.css'/>
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