const TelegramBot = require('node-telegram-bot-api')
const {TOKEN} = require('./config')
const fs = require("fs")

const bot = new TelegramBot(TOKEN, {
    polling:true
})

bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id
    const userName =msg.from.first_name
    bot.sendMessage(chatId, `Hush kelibsiz ${userName}`, {
        reply_markup: JSON.stringify({
            keyboard:
            [
                [
                    {
                        text:"📚 Kurslar"
                    },
                    {
                        text:"🔖 Biz haqimizda"
                    }
                ]
            ],
            resize_keyboard:true
        })
    })
})

bot.on('message', msg => {
    const chatId = msg.chat.id
    
    if (msg.text == "📚 Kurslar") {
        bot.sendMessage(chatId, "Bizning kurslar", {
            reply_markup: JSON.stringify({
                keyboard:
                [
                    [
                        {
                            text:"📱 SMM"
                        },
                        {
                            text:"📊 Grafik dizayn"
                        },
                    ],
                    [
                        {
                            text:"💻 UL/UX"
                        }
                    ],
                    [
                        {
                            text:"⬅ Manuga qaytish"
                        }       
                    ]            
                ],
                esize_keyboard:true
            })         
        })     
    }
    if (msg.text == "⬅ Manuga qaytish") {
        bot.sendMessage(chatId, 'Asosiy Manu', {
            reply_markup: JSON.stringify({
                keyboard:
                [
                    [
                        {
                            text:"📚 Kurslar"
                        },
                        {
                            text:"🔖 Biz haqimizda"
                        }
                    ]
                ],
                resize_keyboard:true
            })
        })
    }
})
bot.on("message", msg => {
    const chatId = msg.chat.id
    const caption = `<strong>kurs haqida malumat</strong>\n<a href="https://kun.uz">link</a>`

    if (msg.text == "📱 SMM") {
        bot.sendPhoto(chatId, fs.readFileSync(__dirname + '/images/smm.jpg'), {
            parse_mode:"HTML",
            caption: caption,
            reply_markup: {
                inline_keyboard: [
                     [
                         {
                             text: "kusrsga yozilish",
                             callback_data:"course_registor_smm"
                        },
                        {
                         text: "Ochiq dars",
                            callback_data: "course_preview_smm",
                            url:"https://www.youtube.com/watch?v=-CVv3gpDBrA"
                         }
                     ]
                 ]
             }
        })
    }
    if (msg.text == "📊 Grafik dizayn") {
        bot.sendPhoto(chatId, fs.readFileSync(__dirname + '/images/dizayn.jpg'), {
            parse_mode:"HTML",
            caption: caption,
            reply_markup: {
                inline_keyboard: [
                     [
                         {
                             text: "kusrsga yozilish",
                             callback_data:"course_registor_grafik"
                        },
                        {
                         text: "Ochiq dars",
                            callback_data: "course_preview_grafik",
                            url:"https://www.youtube.com/watch?v=N5qV8o77TvQ"
                         }
                     ]
                 ]
             }
        })
    }if (msg.text == "💻 UL/UX") {
        bot.sendPhoto(chatId, fs.readFileSync(__dirname + '/images/v.png'), {
            parse_mode:"HTML",
            caption: caption,
            reply_markup: {
               inline_keyboard: [
                    [
                        {
                            text: "kusrsga yozilish",
                            callback_data:"course_registo_ulux"
                       },
                       {
                        text: "Ochiq dars",
                           callback_data: "course_preview_ulux",
                           url:"https://www.youtube.com/watch?v=JJLvj1AnGkU"
                        }
                    ]
                ]
            }
            
        })
    }
})
bot.on("callback_query", msg => {
    let requestCurse;
    let requestname;
    let requestNubmer;

    const chatId = msg.message.chat.id
    if (msg.data == "course_registor_smm" || msg.data == "course_registor_grafik" || msg.data == "course_registor_ulux") {
        requestCurse= msg.data
        bot.sendMessage(chatId, "Ismingizni kiriting", {
            reply_markup: {
                force_reply:true
            }
        }).then(payload => {
            const replyListenerId = bot.onReplyToMessage(payload.chat.id, payload.message_id, msg=> {
                bot.removeListener(replyListenerId)
                if (msg.text) {
                    requestname= msg.text
                    bot.sendMessage(msg.chat.id, `${requestname} contactizi jo'nating`, {
                        reply_markup: JSON.stringify({
                            keyboard:
                            [
                                [
                                    {
                                        text: "contact",
                                        request_contact: true,
                                        one_time_keyboard:true
                                   } 
                                ]
                            ],
                            resize_keyboard:true
                        })
                    }).then(payload => {
                        const replyListenerId = bot.onReplyToMessage(payload.chat.id, payload.message_id, msg => {
                            bot.removeListener(replyListenerId)
                            if (msg.contact) { 
                                requestNubmer = msg.contact.phone_number
                                const Alluser = JSON.parse(fs.readFileSync(__dirname + '/modul.json',{encoding:"utf-8",flag:"r"}))
                                
                                Alluser.push(
                                    {
                                        id: Alluser.length + 1,
                                        course: requestCurse,
                                        name: requestname,
                                        phone:requestNubmer
                                    }
                                )
                                console.log(Alluser)
                                fs.writeFile(__dirname + '/modul.json', JSON.stringify(Alluser), (err) => {
                                    if (err) throw err
                                    bot.sendMessage(msg.chat.id, "So'ro'vingiz amaliga o'shirilidi ro'yxatan o'tganingiz uchun raxmat", {
                                        reply_markup: JSON.stringify({
                                            keyboard:
                                            [
                                                [
                                                    {
                                                        text:"📚 Kurslar"
                                                    },
                                                    {
                                                        text:"🔖 Biz haqimizda"
                                                    }
                                                ]
                                            ],
                                            resize_keyboard:true
                                        })
                                    })
                                } )
                            }

                        })
                    })
                }
            })
        })
    }
})