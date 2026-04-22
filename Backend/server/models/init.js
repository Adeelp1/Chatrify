import { db } from '../config/db.js';
import { initUser } from './user_account_model.js';
import { initUserMatchMacking } from './user_matchmaking_model.js';
import { initUserSession } from './user_session_model.js';
import { initUserProfile } from './user_profile_model.js';

export function initDB() {
    db.serialize(() => {
        initUser(),
        initUserMatchMacking(),
        initUserSession(),
        initUserProfile()
    });
}
