import express from "express";
import bodyParser from "body-parser";
import DfRequest, { QueryResult } from "./dfRequest";
import DfResponse from "./dfResponse";
import GameSession from "./gameSession";

import GreetingIntent from "./intentHandlers/greetingIntent"
import StartGameIntent from "./intentHandlers/startGameIntent";


const app = express();

const intentMap: { [key: string]: ((session: GameSession, query: QueryResult) => DfResponse | undefined) } = {
   "0.0_greeting": GreetingIntent,
   "1.0_start_game": StartGameIntent,
}

const gameSessions: GameSession[] = [];

app.use(bodyParser.json());
app.use("/", (req, res, next) => {
   const request = req.body as DfRequest;
   const query = request.queryResult;

   console.log(query.intent.displayName, query.intent.endInteraction ? "-> end interaction" : "");
   console.log("   Params:", query.parameters);
   console.log("   Contexts:", query.outputContexts.map(context => context.name + "(" + context.lifespanCount + ")"));
   res.locals.dfRequest = request;
   res.locals.query = query   
   next();
})

app.post('/', async (req, res) => {
   const request = res.locals.dfRequest;
   const query = res.locals.query;

   const intentHandler = intentMap[query.intent.displayName];

   if (intentHandler) {
      var gameSession = gameSessions.find(session => session.dialogFlowSessionId === request.session);
      if (!gameSession) {
         gameSession = new GameSession(request.session);
         gameSessions.push(gameSession);
      }
      const response = intentHandler(gameSession, query);
      res.json(response);
   } else {
      console.log("No intent handler found for " + query.intent.displayName);
   }
});

app.listen(5001, () => console.log('Example app listening on port 5001!'));