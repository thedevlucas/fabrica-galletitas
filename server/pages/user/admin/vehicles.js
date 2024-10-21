const mysql = require('mysql2');

module.exports = (router, database) => 
{
    router.get('/vehicles', async (req, res) => {
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT id, patent FROM vehicles');

            res.render('admin/home', { content: "vehicles", vehicles: results });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
    router.get('/vehicles/delete/:id', async (req, res) => {
        const params = req.params;
        if (params.id == undefined) return res.status(404);

        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('DELETE FROM vehicles WHERE id = ?', [params.id]);

            res.render('admin/home', { 
                alert: {
                    title: 'Success',
                    message: 'Vehiculo eliminado exitosamente',
                    icon: 'success',
                    time: 5000,
                    ruta: 'admin/vehicles'
                }
            });
        } catch (error) {
            console.error(error);
            res.render('admin/home', { 
                alert: {
                    title: 'Error',
                    message: 'Server error',
                    icon: 'error',
                    time: 5000,
                    ruta: 'admin/vehicles'
                }
            });
        } finally {
            con.end();
        }
    });
}