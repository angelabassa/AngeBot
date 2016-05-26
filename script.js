let script = new Script({  
    start: {
        receive: (bot) => {
            return bot.say('Hi! I\'m AngeBot, Angela\'s personal chat bot. 🤖 Chat bots are very hot right now.')
                .then(() => 'askName');
        }
    },

    askName: {
        prompt: (bot) => bot.say('What\'s your name?'),
        receive: (bot, message) => {
            const name = message.text;
            return bot.setProp('name', name)
                .then(() => bot.say(`Great! I'll call you ${name}`))
                .then(() => 'finish');
        }
    },

    finish: {
        receive: (bot, message) => {
            return bot.getProp('name')
                .then((name) => bot.say(`Hello again, ${name}!`))
                .then(() => 'finish');
        }
    }
});
