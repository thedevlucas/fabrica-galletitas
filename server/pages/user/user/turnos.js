const auth = require('../../../functions/auth');
const functions = require('../../../functions/functions');

const mysql = require('mysql2');
const { Preference } = require('mercadopago');
const moment = require('moment-timezone');

module.exports = (router, database, mp) => 
{
    router.get('/reserves', async (req, res) => {
        if (!req.query || !req.query.id) return res.redirect("/");

        const con = mysql.createConnection(database);

        try {
            const [results_plans] = await con.promise().query('SELECT * FROM plans');
            const [results_rooms] = await con.promise().query('SELECT * FROM rooms');
            const [results_reserves] = await con.promise().query('SELECT re.date, re.time, re.players, ro.`type`, ro.capacity FROM reserves re JOIN rooms ro ON re.room = ro.id WHERE `date` >= CURDATE()');

            if (!results_plans.find(x => x.id == req.query.id)) return res.redirect("/");

            res.render('user/turnos', { plans: results_plans, rooms: results_rooms, reserves: results_reserves }); 
        } catch (error) {
            console.log(error)
        } finally {
            con.end();
        }
    });
    router.post('/reserves', async (req, res) => {
        const body = req.body;
        const userData = auth.getUser(functions.getCookie(req, 'token'));
        const inputDate = new Date(body.date);
        const today = new Date();
        const oneMonthLater = new Date();
        
        inputDate.setDate(inputDate.getDate() + 1)
        oneMonthLater.setMonth(today.getMonth() + 1);
        
        const [hour, minute] = body.time ? body.time.split(':').map(Number) : [null, null];
        const startHour = 8;
        const endHour = 17;

        if (
            (!body.name || !body.lastname || !body.phone || !body.date || !body.time || !body.players || !body.planId || !body.type) ||
            (inputDate < today || inputDate > oneMonthLater) ||                       
            (hour < startHour || hour > endHour || (hour === endHour && minute > 0))
        ) {
            res.render("global/home", {
                alert: {
                    title: "Error",
                    message: "Incorrect data",
                    icon: "error",
                    showConfirmButton: true,
                    time: 5000,
                    ruta: body.planId ? `user/reserves?id=${body.planId}` : ""
                }
            });
            return;
        }
        

        const con = mysql.createConnection(database);

        try {
            const [results_user] = await con.promise().query('SELECT * FROM users WHERE id = ?', [userData.id]);
            const [results_plans] = await con.promise().query('SELECT * FROM plans');
            const [results_rooms] = await con.promise().query('SELECT * FROM rooms GROUP BY type');
            const [results_reserves] = await con.promise().query('SELECT re.date, re.time, re.players, ro.`type`, ro.capacity FROM reserves re JOIN rooms ro ON re.room = ro.id WHERE `date` >= CURDATE()');
            const plan = results_plans.find(x => x.id == body.planId);
            const room = results_rooms.find(x => x.type == body.type);
            
            if (
                (!plan) ||
                (!room || body.players > room.capacity)
            ) {
                res.render("global/home", {
                    alert: {
                        title: "Error",
                        message: "Incorrect data 2",
                        icon: "error",
                        showConfirmButton: true,
                        time: 5000,
                        ruta: body.planId ? `user/reserves?id=${body.planId}` : ""
                    }
                });
                return;
            }

            console.log(body)

            const horarios = [
                '08:00:00', '09:00:00', '10:00:00', '11:00:00', 
                '12:00:00', '13:00:00', '14:00:00', '15:00:00', 
                '16:00:00', '17:00:00'
            ];
        
            const horariosDisponibles = horarios.filter(horario => {
                const reserva = results_reserves.find(x => {
                    const date = new Date(x.date);
                    const curDate = new Date(body.date);
                    return x.time == horario && (curDate.getDate() === date.getDate() && date.getMonth() === curDate.getMonth() && date.getFullYear() === curDate.getFullYear());
                });
        
                return !reserva || results_reserves.filter(x => x.type == body.type).length < results_rooms.find(x => x.type == body.type).quantity;
            });
            
            if (!horariosDisponibles.find(x => x === (body.time + ":00")))
            {
                res.render("global/home", {
                    alert: {
                        title: "Error",
                        message: "Incorrect data 3",
                        icon: "error",
                        showConfirmButton: true,
                        time: 5000,
                        ruta: body.planId ? `user/reserves?id=${body.planId}` : ""
                    }
                });
                return;
            }

            const preference = new Preference(mp);

            try {
                const newPayment = await preference.create({
                    body: {
                        expires: true,
                        expiration_date_from: moment().tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                        expiration_date_to: moment().tz('America/Argentina/Buenos_Aires').add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                        auto_return: "all",
                        back_urls: {
                            success:  req.headers.host + "/user/mp/back",
                            pending:  req.headers.host + "/user/mp/back",
                            failure:  req.headers.host + "/user/mp/back"
                        },
                        payment_methods: {
                            excluded_payment_methods: [],
                            excluded_payment_types: [
                                {
                                    id: "ticket"
                                }
                            ],
                            installments: 1
                        },
                        items: [
                            {
                                title: 'Pack ' + plan.name,
                                quantity: 1,
                                unit_price: plan.price
                            }
                        ],
                        payer: {
                            name: body.name,
                            lastname: body.lastname,
                            email: results_user[0].mail,
                            phone: {
                                area_code: "54",
                                number: body.phone
                            }
                        },
                        metadata: {
                            user_id: userData.id,
                            name: body.name,
                            lastname: body.lastname,
                            phone: body.phone,
                            date: body.date,
                            time: body.time,
                            players: body.players,
                            plan_id: plan.id,
                            room_id: room.id
                        }
                    }
                })

                res.redirect(newPayment.init_point);
            } catch (error) {
                console.log("Error: ", error);
            }
        } catch (error) {
            console.log(error)
        } finally {
            con.end();
        }
    });
}