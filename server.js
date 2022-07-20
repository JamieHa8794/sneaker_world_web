const pg = require('pg')

const client = new pg.Client('postgress://localhost/sneaker_world_db');


const syncAndSeed = async() =>{
    const SQL = `
        CREATE TABLE Brand(
            id INTEGER PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );
    `;
    await client.query(SQL);
}


const setUp = async()=>{
    try{
       await client.connect();
       await syncAndSeed();
       console.log('connected to db')
    }
    catch(err){
        console.log(err)
    }    
}

setUp();