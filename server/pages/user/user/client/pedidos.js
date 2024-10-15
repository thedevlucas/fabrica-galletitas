const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const functions = require('../../../../functions/functions');
const auth = require('../../../../functions/auth');

module.exports = (router, database) => 
{
    router.get('/pedidos', async (req, res) => {
        const user = auth.getUser(functions.getCookie(req, 'token'));
        if (user.group != 'cliente') return res.status(404);
        
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT s.name, o.date, o.status FROM orders o JOIN stores s ON s.id = o.store');

            res.render('user/home', { content: "client/pedidos", orders: results });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
}