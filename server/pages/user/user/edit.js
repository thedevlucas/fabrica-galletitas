const mysql = require('mysql2');

module.exports = (router, database) => 
{
    router.get('/edit', async (req, res) => {
        //const con = mysql.createConnection(database);
        
        try {
            //const [results] = await con.promise().query(`SELECT u.id, u.group, u.username, c.name AS course, p.date FROM users u LEFT JOIN purchases p ON u.id = p.userId LEFT JOIN courses c ON p.courseId = c.id`);

            res.render('user/home', {content: "edit", form: "select" });
        } catch (error) {
            console.error(error);
        } finally {
            //con.end();
        }
    });
}