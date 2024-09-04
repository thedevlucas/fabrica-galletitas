const auth = require('../../../functions/auth');
const functions = require('../../../functions/functions');

const mysql = require('mysql2');
const { Payment } = require('mercadopago');
const e = require('express');

module.exports = (router, database, mp) => 
{
    router.get('/mp/back', async (req, res) => {
        res.render('user/mp-back', {});
    });

    router.post('/mp/status', async (req, res) => {
        const query = req.body;
        if (!query.payment_id) res.json({status: true, title: "Error", description: "El id de pago no se encontro."});
        
        const con = mysql.createConnection(database);
        const payment = new Payment(mp);
        
        try {
            const [results_reserves] = await con.promise().query('SELECT payment_id FROM reserves WHERE payment_id = ?', [query.payment_id]);
            if (results_reserves[0]) return res.json({status: false, title: "Error en el pago", description: "Este pago ya se realizo."});

            const curPayment = await payment.get({id: query.payment_id});
            console.log("pornO", curPayment)
            if (curPayment.status !== 'approved') return res.json({status: false, title: "Error en el pago", description: "El pago no fue aprobado."});

            let metadata = curPayment.metadata;
            console.log(metadata)
            const [results_insert] = await con.promise().query('INSERT INTO reserves SET ?', {payment_id: query.payment_id, user: metadata.user_id, room: metadata.room_id, plan: metadata.plan_id, date: metadata.date, time: metadata.time, players: metadata.players, name: metadata.name, lastname: metadata.lastname, phone: metadata.phone});

            res.json({status: true, title: "¡Gracias por su compra!", description: "Le informamos que hemos enviado el codigo de reserva a su dirección de correo electrónico. Por favor, revise su bandeja de entrada y carpeta de spam en caso de no recibirlos. Si tiene alguna pregunta o necesita ayuda adicional, no dude en ponerse en contacto con nosotros. ¡Esperamos que disfrute su juego!"});
        } catch (error) {
            console.log(error);
            res.json({status: false, title: "Error en la pagina", description: "Lo sentimos, parece que ha ocurrido un error en la página web. Por favor, póngase en contacto con un administrador para que podamos solucionar el problema lo antes posible. Gracias por su comprensión."});
        } finally {
            con.end();
        }
    });
}