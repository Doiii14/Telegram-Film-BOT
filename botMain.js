
var TelegramBot = require('node-telegram-bot-api');
var token = 'Your token given by BotFather';
var bot = new TelegramBot(token,{polling:true});
var request = require('request');

bot.on('message', (msg) => {
    bot.sendMessage(msg.chat.id, "<b>Type /search filmName to get info about your favorite film </b>",{parse_mode:"HTML"});
});

bot.onText(/\/search (.+)/,function(msg,match){
    let idchat = msg.chat.id;
    let movie = match[1]; //LETTURA NOME
    if (movie.match(/[a-z]/i)){
        bot.on("polling_error", (err) => console.log(err));
        let url = 'http://www.omdbapi.com/?apikey=yourkey=?film';
        let finalstring = url.replace('film', movie);
        request(finalstring,function(error,response,body){

        let res = JSON.parse(body);
        console.log(finalstring);
        if(!error && response.statusCode == 200 && res.Response == "True"){
            bot.sendMessage(idchat, '<em>Looking for </em>' + movie +'...',{parse_mode:"HTML"}).then(function(msg){
            bot.sendMessage(idchat,'<b>🚨 Result:</b> \n\n <b>✅ Title: </b>' +  res.Title 
            +"\n <b>✅ Release: </b>" + res.Released + "\n <b>✅ Genre: </b> " + res.Genre + "\n <b>✏ Writer: </b> "+ res.Writer 
            +"<b>\n 🌟 Ratings</b> " + res.imdbRating, {parse_mode:"HTML"});
            bot.sendPhoto(idchat,res.Poster);
            })
        }else if(!error && res.Response == "False"){
            bot.sendMessage(idchat,"<b>I didn't found nothing... 😭</b>",{parse_mode:"HTML"});
        }
    });
    }else{
        bot.sendMessage(idchat,"<b> Buddy, you need to use alphabetical character! 🚨</b>",{parse_mode:"HTML"});
    }            
})
