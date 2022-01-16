'use strict';
const Alexa = require('ask-sdk');
const Util = require('./util');
const aplMainTemplate = require('./apl-main.json');
/***********
Data: Customize the data below as you please.
***********/


const SKILL_NAME = "Which Sailor Senshi";
const HELP_MESSAGE_BEFORE_START = "I can tell you which sailor senshi you are in 5 questions. Are you ready to play?";
const HELP_MESSAGE_AFTER_START = "You can say yes or no.";
const HELP_REPROMPT = "Say yes or no to my questions and find out which sailor senshi you are!";
const STOP_MESSAGE = "In the name of the moon, your spirit sailor senshi awaits you next time!";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "I'm not sure what you mean. You can answer either yes or no.";
const HINT_TEXT = `To play again, just say "Alexa, open ${SKILL_NAME}"`


// const BACKGROUND_IMAGE_URL = "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/default.jpg";
const BACKGROUND_IMAGE_URL =  "SailorMoonSeason1.jpeg";
//const BACKGROUND_GOODBYE_IMAGE_URL = "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/goodbye.jpg";
const BACKGROUND_GOODBYE_IMAGE_URL = "End.jpg";
//const BACKGROUND_HELP_IMAGE_URL = "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/help.jpg";
const BACKGROUND_HELP_IMAGE_URL = "help.jpeg";

const WELCOME_MESSAGE = "Hello there! Ever wondered which sailor senshi you are? I can tell you if you answer just 5 questions. Are you ready to play?";
const INITIAL_QUESTION_INTROS = [
  "Woo hoo! Let's start.",
  "<say-as interpret-as='interjection'>Alright.</say-as> Here's the first question.",
  "Let's go!",
  "<say-as interpret-as='interjection'>Well</say-as>."
];
const QUESTION_INTROS = [
  "Hah.",
  "I'm starting to get a sense of who you might be.",
  "<say-as interpret-as='interjection'>I know right?</say-as>",
  "Tell me about it.",
  "<say-as interpret-as='interjection'>Same.</say-as>",
  "Interesting!"
];
const UNDECISIVE_RESPONSES = [
  "<say-as interpret-as='interjection'>Ding ding!</say-as>. I've chosen an answer for you.",
  "<say-as interpret-as='interjection'>Nanu Nanu</say-as>. Tough one hey. It's ok, we can move on to the next question.",
  "<say-as interpret-as='interjection'>Hmm</say-as>... Let's try the next question if you're unsure.",
  "<say-as interpret-as='interjection'>OK</say-as>. We'll move on then.",
  "<say-as interpret-as='interjection'>Aw man</say-as>. How about this question?",
];
const RESULT_MESSAGE = [
  "<speak><audio src='soundbank://soundlibrary/magic/amzn_sfx_fairy_melodic_chimes_01'/> Here comes the big reveal! You are</speak>"
];
  // the name of the result is inserted here.
const RESULT_MESSAGE_SHORT = "You are "; // the name of the result is inserted here.
const PLAY_AGAIN_REQUEST = "That's it. Do you want to play again?";

const resultList = {
  result1: {
    name: "Sailor Moon",
    display_name: "Sailor Moon",
    audio_message: "You're idealistic and not afraid to show your emotions. But you've got a heart of gold and you'd do anything for your friends.",
    description: "Sailor Moon is the moon princess. She may come off as childish and immature at times but always breaks through and save the team in critical moments.",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Red-knobbed.starfish.1200.jpg"
      largeImageUrl: "sailormoon.png",
    }
  },
  result2: {
    name: "Sailor Mars",
    display_name: "Sailor Mars",
    audio_message: "You're forthright and have low tolerance for bullshit. You'll always be the first one to do the right thiing!",
    description: "Sailor Mars is mysterious and beautiful but you don't want to rub her the wrong way!",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Aceria_anthocoptes.1200.jpg"
      largeImageUrl: "sailormars.png",
    }
  },
  result3: {
    name: "Sailor Jupiter",
    display_name: "Sailor Jupiter",
    audio_message: "You're slow to warm to people but is sensitive and kind at heart.",
    description: "Sailor Jupiter is the strongest of all senshis but she is also soft and feminine at the same time.",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Anodorhynchus_hyacinthinus.1200.jpg"
      largeImageUrl: "sailorjupiter.png",
    }
  },
  result4: {
    name: "Sailor Mercury",
    display_name: "Sailor Mercury",
    audio_message: "You are intelligent, organised and often the lynchpin when working in a team.",
    description: "Sailor Mercury is the brain of the senshis! She is smart and calculated and the team can't do without her meticulous planning skills.",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Male_goat.1200.jpg"
      largeImageUrl: "sailormercury.png",
    }
  },
  result5: {
    name: "Sailor Venus",
    display_name: "Sailor Venus",
    audio_message: "You're often the leader of a pack, a real influencer.",
    description: "Sailor Venus is arguably Sailor Moon's right hand lady - she steps in to help the team move forward with decisions!",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Bufo_boreas.1200.jpg"
      largeImageUrl: "sailorvenus.png",
    }
  }
};

const questions = [{
    question: "Do you like to take leadership?",
    questionDisplay: "Do you like to take leadership?",
    //background:  "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q1.jpg",
    background: "pattern background.jpeg",
    points: {
      result1: 3,
      result2: 2,
      result3: 1,
      result4: 3,
      result5: 5
    }
  },
  {
    question: "Do you have a short temper?",
    questionDisplay: "Do you have a short temper?",
    //background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q2.jpg",
    background: "pattern background.jpeg",
    points: {
      result1: 1,
      result2: 5,
      result3: 4,
      result4: 0,
      result5: 3
    }
  },
  {
    question: "Do you like planning and organising?",
    questionDisplay: "Do you like planning and organising?",
    //background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q3.jpg",
    background: "pattern background.jpeg",
    points: {
      result1: 0,
      result2: 0,
      result3: 0,
      result4: 4,
      result5: 5
    }
  },
  {
    question: "Do you give off a standoffish vibe but secretly is a big softie?",
    questionDisplay: "Are you aloof but secretly a softie?",
    //background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q4.jpg",
    background: "pattern background.jpeg",
    points: {
      result1: 0,
      result2: 4,
      result3: 5,
      result4: 0,
      result5: 1
    }
  },
  {
    question: "Do you always wonder why there is so much unjust in the world?",
    questionDisplay: "Do you wonder why there is unjust?",
    //background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q5.jpg",
    background: "pattern background.jpeg",
    points: {
      result1: 5,
      result2: 3,
      result3: 2,
      result4: 0,
      result5: 1
    }
  }
];

/***********
Execution Code: Avoid editing the code below if you don't know JavaScript.
***********/

// Private methods (this is the actual code logic behind the app)



const newSessionHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var isCurrentlyPlayingOrGettingResult = false;
    if (sessionAttributes.state) {
       isCurrentlyPlayingOrGettingResult = true;
    }


    return handlerInput.requestEnvelope.request.type === `LaunchRequest` || (!isCurrentlyPlayingOrGettingResult && request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.YesIntent' || request.intent.name === 'AMAZON.NoIntent'));
  },
  handle(handlerInput) {

    console.log('--------------------------------------- New session')
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    if (handlerInput.requestEnvelope.request.type === `LaunchRequest`) {
      _initializeApp(sessionAttributes);
      return buildResponse(handlerInput, WELCOME_MESSAGE, WELCOME_MESSAGE, SKILL_NAME);
    }
    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent') {

      sessionAttributes.state = states.QUIZMODE;

      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }
    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent') {
      console.log('--------------------------------------- Exit session')
      const attributesManager = handlerInput.attributesManager;
      const sessionAttributes = attributesManager.getSessionAttributes();
      sessionAttributes.state = '';
      return buildResponse(handlerInput, STOP_MESSAGE, '', SKILL_NAME, BACKGROUND_GOODBYE_IMAGE_URL,STOP_MESSAGE);
    }
    if (request.type === 'IntentRequest' && request.intent.name === 'UndecisiveIntent') {
      const outputSpeech = MISUNDERSTOOD_INSTRUCTIONS_ANSWER;
      return buildResponse(handlerInput, outputSpeech, outputSpeech, SKILL_NAME, BACKGROUND_IMAGE_URL,"");
    }
  },
};

const nextQuestionIntent = (handlerInput, prependMessage) => {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();
  sessionAttributes.questionProgress++;
  var currentQuestion = questions[sessionAttributes.questionProgress].question;
  return {
    prompt: `${prependMessage} ${_randomQuestionIntro(sessionAttributes)} ${currentQuestion}`,
    reprompt: HELP_MESSAGE_AFTER_START,
    displayText: questions[sessionAttributes.questionProgress].questionDisplay,
    background: questions[sessionAttributes.questionProgress].background
  };
}

const resultIntent = (handlerInput, prependMessage) => {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();
  const resultPoints = sessionAttributes.resultPoints;
  const result = Object.keys(resultPoints).reduce((o, i) => resultPoints[o] > resultPoints[i] ? o : i);
  const resultMessage = `${prependMessage} ${RESULT_MESSAGE} ${resultList[result].name}. ${resultList[result].audio_message}. ${PLAY_AGAIN_REQUEST}`;
  return {
    prompt: resultMessage,
    reprompt: PLAY_AGAIN_REQUEST,
    displayText: `${RESULT_MESSAGE_SHORT} ${resultList[result].name}`,
    background: resultList[result].img.largeImageUrl
  }

  // this.emit(':askWithCard', resultMessage, PLAY_AGAIN_REQUEST, resultList[result].display_name, resultList[result].description, resultList[result].img);
  //                        ^speechOutput  ^repromptSpeech     ^cardTitle                       ^cardContent                    ^imageObj
}

const RepeatIntentHandler = {
  canHandle(handlerInput) {
   return Alexa.getRequestType(handlerInput.requestEnvelope) ===   'IntentRequest' && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent';
   },
handle(handlerInput) {
    // Get the session attributes.
    const sessionAttributes =
    handlerInput.attributesManager.getSessionAttributes();
    console.log('Repeat');
    console.log(sessionAttributes.lastPrompt);
   return 	buildResponse (handlerInput, sessionAttributes.lastPrompt, sessionAttributes.lastReprompt, sessionAttributes.lastTitle, sessionAttributes.lastImage_url,  sessionAttributes.lastDisplayText, sessionAttributes.lastDisplay_type)
  }
};

const _randomIndexOfArray = (array) => Math.floor(Math.random() * array.length);
const _randomOfArray = (array) => array[_randomIndexOfArray(array)];
const _adder = (a, b) => a + b;
const _subtracter = (a, b) => a - b;

// Handle user input and intents:

const states = {
  QUIZMODE: "_QUIZMODE",
  RESULTMODE: "_RESULTMODE"
}



const quizModeHandler = {
  canHandle(handlerInput) {

    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var isCurrentlyPlaying = false;
    if (sessionAttributes.state && sessionAttributes.state === states.QUIZMODE) {
      isCurrentlyPlaying = true;
    }

    return isCurrentlyPlaying;
  },
  handle(handlerInput) {
    console.log('---------------------------------------Quiz Mode')
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var prependMessage = '';
    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NextIntent') {
      const systemSpeak = nextQuestionIntent(handlerInput, prependMessage);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent') {
      _applyresultPoints(sessionAttributes, _adder);
      sessionAttributes.state = states.QUIZMODE;
      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent') {
      _applyresultPoints(sessionAttributes, _subtracter);
      sessionAttributes.state = states.QUIZMODE;
      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'UndecisiveIntent') {
      Math.round(Math.random()) ? _applyresultPoints(sessionAttributes, _adder) : _applyresultPoints(sessionAttributes, _subtracter);
      const systemSpeak = _nextQuestionOrResult(handlerInput, _randomOfArray(UNDECISIVE_RESPONSES));
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

  if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.RepeatIntent') {
        console.log('Repeat');
    	console.log(sessionAttributes.lastPrompt);
	   return 	buildResponse (handlerInput, sessionAttributes.lastPrompt, sessionAttributes.lastReprompt, sessionAttributes.lastTitle, sessionAttributes.lastImage_url,  sessionAttributes.lastDisplayText, sessionAttributes.lastDisplay_type)
	}


  },
};

const resultModeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var isCurrentlyPlaying = false;
    if (sessionAttributes.state &&
      sessionAttributes.state === states.QUIZMODE) {
      isCurrentlyPlaying = true;
    }

    return !isCurrentlyPlaying && request.type === 'IntentRequest' && sessionAttributes.state === states.RESULTMODE;
  },
  handle(handlerInput) {
    console.log('--------------------------------------- Result mode')
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent') {
      _initializeApp(sessionAttributes);
      sessionAttributes.state = states.QUIZMODE;
      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background, systemSpeak.displayText);
    }
    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent') {
      const attributesManager = handlerInput.attributesManager;
      const sessionAttributes = attributesManager.getSessionAttributes();
      sessionAttributes.state = '';
      return buildResponse(handlerInput, STOP_MESSAGE, '', SKILL_NAME, BACKGROUND_GOODBYE_IMAGE_URL,STOP_MESSAGE);

    }

  if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.RepeatIntent') {
        console.log('Repeat');
    	console.log(sessionAttributes.lastPrompt);
	   return 	buildResponse (handlerInput, sessionAttributes.lastPrompt, sessionAttributes.lastReprompt, sessionAttributes.lastTitle, sessionAttributes.lastImage_url,  sessionAttributes.lastDisplayText, sessionAttributes.lastDisplay_type)
	}



  },
};


const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.CancelIntent' ||
        request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    console.log('--------------------------------------- Exit session')
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    sessionAttributes.state = '';
    return buildResponse(handlerInput, STOP_MESSAGE, '', SKILL_NAME, BACKGROUND_GOODBYE_IMAGE_URL,STOP_MESSAGE);
    //------------------------------------------------
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    console.log('--------------------------------------- Help')
    const attributesManager = handlerInput.attributesManager;
    var speechOutput = '';
    const sessionAttributes = attributesManager.getSessionAttributes();
    if (sessionAttributes.state === states.QUIZMODE) {
       speechOutput = HELP_MESSAGE_AFTER_START;
    } else {
       speechOutput = HELP_MESSAGE_BEFORE_START;
    }
    const reprompt = HELP_REPROMPT;
    return buildResponse(handlerInput, speechOutput, reprompt, SKILL_NAME, BACKGROUND_HELP_IMAGE_URL);
  },
};
const UnhandledHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput) {
    console.log('---------------------------------------Unhandled')
    const outputSpeech = MISUNDERSTOOD_INSTRUCTIONS_ANSWER;
    return buildResponse(handlerInput, outputSpeech, outputSpeech, SKILL_NAME);
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler");
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

// Skill brain

const _initializeApp = handler => {
  // Set the progress to -1 one in the beginning
  handler.questionProgress = -1;
  // Assign 0 points to each animal
  var initialPoints = {};
  Object.keys(resultList).forEach(result => initialPoints[result] = 0);
  handler.resultPoints = initialPoints;
};

const _nextQuestionOrResult = (handlerInput, prependMessage = '') => {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();
  if (sessionAttributes.questionProgress >= (questions.length - 1)) {

    sessionAttributes.state = states.RESULTMODE;
    return resultIntent(handlerInput, prependMessage)


  } else {
    return nextQuestionIntent(handlerInput, prependMessage);
  }
};

const _applyresultPoints = (handler, calculate) => {
  const currentPoints = handler.resultPoints;
  const pointsToAdd = questions[handler.questionProgress].points;

  handler.resultPoints = Object.keys(currentPoints).reduce((newPoints, result) => {
    newPoints[result] = calculate(currentPoints[result], pointsToAdd[result]);
    return newPoints;
  }, currentPoints);
};

const _randomQuestionIntro = handler => {
  if (handler.questionProgress === 0) {
    // return random initial question intro if it's the first question:
    return _randomOfArray(INITIAL_QUESTION_INTROS);
  } else {
    // Assign all question intros to remainingQuestionIntros on the first execution:
    var remainingQuestionIntros = remainingQuestionIntros || QUESTION_INTROS;
    // randomQuestion will return 0 if the remainingQuestionIntros are empty:
    let randomQuestion = remainingQuestionIntros.splice(_randomIndexOfArray(remainingQuestionIntros), 1);
    // Remove random Question from rameining question intros and return the removed question. If the remainingQuestions are empty return the first question:
    return randomQuestion ? randomQuestion : QUESTION_INTROS[0];
  }
};

// Utilities


let buildResponse = (handlerInput, prompt, reprompt, title = SKILL_NAME, image_url = BACKGROUND_IMAGE_URL,  displayText = prompt.replace(/(<([^>]+)>)/gi, ""), display_type = "BodyTemplate7" ) => {
  console.log(title);
  	const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
	sessionAttributes.lastPrompt = prompt;
	sessionAttributes.lastReprompt = reprompt;
	sessionAttributes.lastTitle = title;
	sessionAttributes.lastImage_url = image_url;
	sessionAttributes.lastDisplayText = displayText;
	sessionAttributes.lastDisplay_type = display_type;
  if (reprompt) {
    handlerInput.responseBuilder.reprompt(reprompt);
  } else {
    handlerInput.responseBuilder.withShouldEndSession(true);
  }
   var response ;
  if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
     response = getDisplay(handlerInput, title,  prompt, image_url, display_type).responseBuilder;
  } else {
     response = handlerInput.responseBuilder.speak(prompt)

  }
  return response.withSimpleCard(title, displayText).getResponse();
}
function supportsDisplay(handlerInput) {
  var hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display
  return hasDisplay;
}


function getDisplay(handlerInput, title, displayText, image_url, display_type){
	if (!image_url.includes('https://')) {
		image_url=Util.getS3PreSignedUrl("Media/"+image_url);
	}


	console.log("the display type is => " + display_type);
    console.log(image_url);
    var VISUAL_TOKEN = 'showthis';
            // Create Render Directive

            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                datasources: {
                        "headlineTemplateData": {
                            "type": "object",
                            "objectId": "headlineSample",
                            "properties": {
                                "backgroundImage": {
                                    "contentDescription": null,
                                    "smallSourceUrl": null,
                                    "largeSourceUrl": null,
                                    "sources": [
                                        {
                                            "url": image_url,
                                            "size": "large"
                                        }
                                    ]
                                },
                                "textContent": {
                                    "primaryText": {
                                        "type": "PlainText",
                                        "text": displayText.replace(/(<([^>]+)>)/gi, "")
                                    }
                                },

                                "hintText": HINT_TEXT,
                                "welcomeSpeechSSML": `<speak>${displayText}</speak>`
                            },
                            "transformers": [
                                {
                                    "inputPath": "welcomeSpeechSSML",
                                    "transformer": "ssmlToSpeech",
                                    "outputName": "welcomeSpeech"
                                }
                            ]
                        }
                    },
                token: VISUAL_TOKEN,
                document: aplMainTemplate
            });


	return handlerInput;
}

// Init

  const skillBuilder = Alexa.SkillBuilders.custom();
  exports.handler = skillBuilder
    .addRequestHandlers(
      SessionEndedRequestHandler, HelpIntentHandler, ExitHandler, newSessionHandler, quizModeHandler, resultModeHandler, RepeatIntentHandler,  UnhandledHandler
    )
    //.addErrorHandlers(ErrorHandler)
    .lambda();
