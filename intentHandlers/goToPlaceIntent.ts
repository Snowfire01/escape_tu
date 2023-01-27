import GameSession from "../gameSession";
import { QueryResult } from "../dfRequest";
import DfResponse, { ResponseBuilder } from "../dfResponse";
import getText from "../getText";
import places from "../places.json";
import Place from "../model/place";

export default function GoToPlaceIntent(gameSession: GameSession, query: QueryResult): DfResponse | undefined {
   const responseBuilder = new ResponseBuilder();

   const currentLocation = places.find(x => x.name === gameSession.currentLocation)

   if (currentLocation?.name === query.parameters.building) {
      responseBuilder.addMessage("You are already here");
   } else if (!currentLocation?.targets.some(x => x.name === query.parameters.building)) {
      responseBuilder.addMessage("You can't go there from here. Try again later!")
   } else {
      responseBuilder.addMessage(`You sure you want to go to the ${query.parameters.building}?`)
      responseBuilder.addContext("asked_for_target_confirmation", 1);
      responseBuilder.addContext("asked_for_target", 0);
      gameSession.movingBetweenPlaces = true;
      gameSession.target = query.parameters.building as Place;
      gameSession.helpText = `You wanted to go to the ${gameSession.target} and I asked you if you are really sure. Question still stands...`
   }

   return responseBuilder.build();
}