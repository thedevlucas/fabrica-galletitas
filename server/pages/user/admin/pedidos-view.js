const mysql = require('mysql2');

module.exports = (router, database) => 
{
    router.get('/pedidos/view/:id', async (req, res) => {
        const params = req.params;
        if (params.id == undefined) return res.status(404);
        
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT o.id, s.name, s.address, o.order, o.status FROM orders o JOIN stores s ON s.id = o.store WHERE o.id = ?', [params.id]);
            const [results2] = await con.promise().query('SELECT date, newStatus, comments FROM orders_logs WHERE `order` = ?', [params.id]);

            const logs = results2.map(result => {
                return {
                    ...result,
                    comments: result.comments ? result.comments.replace(/[\r\n]+/g, '') : "N/A"
                };
            });
            let order = results[0];
            order.logs = logs;

            res.render('admin/home', { content: "pedidos-view", order: order });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
}