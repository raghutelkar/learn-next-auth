import { Session } from "@/model/session-model";

export async function createSession(session) {
  try{
    await Session.create(session);
  } catch(e){
    throw new Error(e)
  }
}

export async function deleteSession(sessionId) {
  try {
    const result = await Session.deleteOne({ sessionId: sessionId });
    if (result.deletedCount === 0) {
      throw new Error('Session not found');
    }
    return result;
  } catch (e) {
    throw new Error(e.message);
  }
}