import { v4 as uuidv4 } from 'uuid';
import { getSession, insertSession, updateSession, isSessionExits } from "../models/user_session_model.js";

function _createSessionid() {
    return uuidv4();
}

async function isUserExists(sessionId) {
    const user_id = await isSessionExits(sessionId);
    if (user_id != null) {
        // here, ensure session is not expired. if expired create new one.
        return user_id;
    }
    else {
        return false;
    }
}

async function setNewSession(user_id) {
    const sessionId = _createSessionid(); 
    const is_user_exists  = await getSession(user_id);
    
    if (is_user_exists)
        await updateSession(user_id, sessionId);
    else
        await insertSession(user_id, sessionId);

    return sessionId;
}

export { isUserExists, setNewSession }
