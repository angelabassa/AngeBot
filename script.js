'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
//    processing: {
//      prompt: (bot) => bot.say('Beep boop...'),
//        receive: () => 'processing'
//    },

    start: {
        receive: (bot) => {
            return bot.say('Hi there! 👋\n How can I help you today? %[Say hi to Angela](http://bit.ly/angebot-twitter) %[Learn about Angela](postback:about) %[Who am I talking to?](postback:who)')
 //                           .then(() => 'askName');
                            .then(() => 'speak');
        }
    },

//    askName: {
//        prompt: (bot) => bot.say('What should I call you?'),
//        receive: (bot, message) => {
//            const name = message.text;
//            return bot.setProp('name', name)
//                .then(() => bot.say(`It's nice to meet you, ${name}. How can I help you today? %[Say hi to Angela](postback:tweet) %[Learn about Angela](postback:about) %[Who am I talking to?](postback:who)`))
//                .then(() => 'speak');
//        }
//    },

    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

                if (!_.has(scriptRules, upperText)) {
                    return bot.say('I\'m sorry, but I\'m still a rudimentary bot, you\'ll have to use one of the pre-programmed commands for now. You can ask for HELP if you\'re lost.').then(() => 'speak');
                }

                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
