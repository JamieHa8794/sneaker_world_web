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

app.get('/brands/:id', async(req, res, next)=>{
    try{
        const promises = [
            client.query('SELECT * FROM Brand WHERE id=$1;', [req.params.id]),
            client.query('SELECT * FROM Sneaker WHERE brand_id=$1;', [req.params.id]) 
        ];
        const [brandsResponse, sneakersResponse]= await Promise.all(promises)
        const brand = brandsResponse.rows[0]
        const sneakers = sneakersResponse.rows;
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
                        <a href='/'>Brands</a> (${brand.name})
                    </h2>
                    <ul>
                    ${sneakers.map(sneaker =>{
                        return(`
                            <li>
                                ${sneaker.name}
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