const { Pool } = require('pg');

const conectionUrl = 'postgresql://peluqueriaweb_user:aZffbZQwqiizWrD7mYWLiSGDXlswJMDx@dpg-ct0vict2ng1s73e2pimg-a.oregon-postgres.render.com/peluqueriaweb';

// Configuración del pool usando el connection string
const pool = new Pool({
    connectionString: conectionUrl,
    ssl: {
        rejectUnauthorized: false, // Necesario para conexiones con Render
    }
});

// Probar la conexión
pool.connect()
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch(err => {
      console.error('Error conectando a la base de datos:', err);
  });


module.exports = pool;