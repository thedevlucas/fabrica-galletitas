const auth = require('../../../functions/auth');
const functions = require('../../../functions/functions');

module.exports = (router, database) => 
{
    router.get('/login', async (req, res) => {
        if (auth.isAuthenticated(functions.getCookie(req, "token"))) return res.redirect(`/admin`);
        if ((await auth.login(req, res, {token: functions.getCookie(req, "token")})).status) return res.redirect(`/admin`);

        res.render('global/home', { includes: 'login'});
    });
    router.post('/login', async (req, res) => {
        const body = req.body;
        const result = await auth.login(req, res, {username: body.username, password: body.password})
        if (!result.status) return res.render('global/home', {  includes: 'login', error: result.info });

        res.redirect(`/#info`);   
    });
}