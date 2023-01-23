import GameSession from "../gameSession";
import { QueryResult } from "../dfRequest";
import DfResponse, { ResponseBuilder } from "../dfResponse";
import getText from "../getText";

export default function GreetingIntent(gameSession: GameSession, query: QueryResult): DfResponse | undefined {
   const responseBuilder = new ResponseBuilder();

   if (!gameSession.gameStarted) {
      responseBuilder.addMessage(getText("introduction"));
   } else {
      responseBuilder.addMessage(getText("greeting_after_start"));
   }

   return responseBuilder.build();
}