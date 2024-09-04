module.exports = (router, database) => 
{
    router.get('/panel', async (req, res) => {
        res.render('user/home', {});
    });
}