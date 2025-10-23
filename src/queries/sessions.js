import { Session } from "@/model/session-model";

export async function createSession(session) {
  try{
    await Session.create(session);
  } catch(e){
    throw new Error(e)
  }
}