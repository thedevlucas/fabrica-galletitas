const mysql = require('mysql2');

const functions = require('../../../../functions/functions');
const auth = require('../../../../functions/auth');

module.exports = (router, database) => 
{
    router.get('/pedidos/view/:id', async (req, res) => {
        const user = auth.getUser(functions.getCookie(req, 'token'));
        if (user.group != 'cliente') return res.status(404);
        
        const con = mysql.createConnection(database);
        
        try {
            // const [results] = await con.promise().query(`SELECT u.id, u.group, u.username, c.name AS course, p.date FROM users u LEFT JOIN purchases p ON u.id = p.userId LEFT JOIN courses c ON p.courseId = c.id`);

            res.render('user/home', {content: "client/pedidos-view" });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
}