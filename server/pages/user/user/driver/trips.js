const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const functions = require('../../../../functions/functions');
const auth = require('../../../../functions/auth');

module.exports = (router, database) => 
{
    const usedTokens = new Set();

    router.get('/conductor/vehiculos/view/:id', async (req, res) => {
        const user = auth.getUser(functions.getCookie(req, 'token'));
        if (user.group != 'conductor') return res.status(404);

        const params = req.params;
        if (params.id == undefined) return res.status(404);
        
        const con = mysql.createConnection(database);
        
        try {
            const [results2] = await con.promise().query('SELECT o.id, s.address, o.status FROM trips t JOIN orders o ON o.id = t.order JOIN stores s ON s.id = o.store WHERE t.vehicle = ? ORDER BY o.status DESC', [params.id]);

            req.session.token = uuidv4();
            res.render('user/home', { content: "driver/trips", trips: results2 });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
    router.post('/conductor/vehiculos/check/:id', async (req, res) => {
        console.log("x")
        const params = req.params;
        if (!req.session.token || usedTokens.has(req.session.token) || params.id == undefined) {
            return res.render('user/home', { 
                alert: {
                    title: 'Error',
                    message: 'Invalid session token',
                    icon: 'error',
                    time: 5000,
                    ruta: 'user/conductor/vehiculos'
                }
            });
        } else { usedTokens.add(req.session.token); }

        const user = auth.getUser(functions.getCookie(req, 'token'));
        const con = mysql.createConnection(database);
        const body = req.body

        try {
            if (body.code == 'start')
            {
                const [results_insert2] = await con.promise().query('INSERT INTO orders_logs SET ?', {order: params.id, user: user.id, newStatus: 2, comments: body.comments});
            }

            // const [results_update] = await con.promise().query('UPDATE orders SET status = 2 WHERE id = ?', [params.id]);
            // const [results_insert] = await con.promise().query('INSERT INTO trips SET ?', {order: params.id, vehicle: body.vehicle});
            // const [results_insert2] = await con.promise().query('INSERT INTO orders_logs SET ?', {order: params.id, user: user.id, newStatus: 2, comments: body.comments});
            console.log(body)
            res.render('user/home', { 
                alert: {
                    title: 'Success',
                    message: 'Pedido confirmado exitosamente',
                    icon: 'success',
                    time: 5000,
                    ruta: 'user/conductor/vehiculos/check/' + params.id
                }
            });
        } catch (error) {
            console.error(error);

            res.render('user/home', { 
                alert: {
                    title: 'Error',
                    message: 'Server error',
                    icon: 'error',
                    time: 5000,
                    ruta: 'user/conductor/pedidos'
                }
            });
        } finally {
            con.end();
        }
    });
}