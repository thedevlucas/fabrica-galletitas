const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcryptjs");

module.exports = (router, database) => 
{
    const usedTokens = new Set();

    router.get('/vehicles/create', async (req, res) => {
        //const con = mysql.createConnection(database);
        
        try {
            //const [results] = await con.promise().query(`SELECT u.id, u.group, u.username, c.name AS course, p.date FROM users u LEFT JOIN purchases p ON u.id = p.userId LEFT JOIN courses c ON p.courseId = c.id`);
            req.session.token = uuidv4();
            res.render('admin/home', { content: "vehicles-create" });
        } catch (error) {
            console.error(error);
        } finally {
            //con.end();
        }
    });
    router.post('/vehicles/create', async (req, res) => {
        if (!req.session.token || usedTokens.has(req.session.token)) {
            return res.render('admin/home', { 
                alert: {
                    title: 'Error',
                    message: 'Invalid session token',
                    icon: 'error',
                    time: 5000,
                    ruta: 'admin/vehicles/create'
                }
            });
        } else { usedTokens.add(req.session.token); }

        const body = req.body;
        const con = mysql.createConnection(database);
        
        try { 
            const [results_insert] = await con.promise().query('INSERT INTO vehicles SET ?', {patent: body.patent});

            res.render('admin/home', { 
                alert: {
                    title: 'Success',
                    message: 'Vehiculo creado exitosamente',
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
                    ruta: 'admin/vehicles/create'
                }
            });
        } finally {
            con.end();
        }
    });
}