import { hashPassword, comparePassword } from "../utils/hash.js";
import userAccount from "../models/user_account_model.js";
import userProfile from "../models/user_profile_model.js";
import { setNewSession, isUserExists } from "../utils/session.js";
import { createUserEmbedgingsAndStore } from "../client/recommenderClient.js";

async function signupUser(req, res) {
    const {
        confirm_password,
        country,
        display_name,
        email,
        first_name,
        gender,
        interests,
        last_name,
        password,
        username
    } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if user already exists
    const existing = await userAccount.searchByEmail(email);
    if(existing) {
        return res.status(400).json({ error: "User already exists" });
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);
    // store user in db
    await userAccount.createUser(username, email, hashedPassword);
    const user = await userAccount.searchByEmail(email);
    await userProfile.createUserProfile(user.user_id, first_name, last_name, display_name, gender, country, interests);
    console.log("userProfile success");

    // store user embedding in RecommendService
    createUserEmbedgingsAndStore(user.user_id, interests);

    res.json({ message: "Signup successful!" });
    console.log("signup successful");
}

async function loginUser(req, res) {
    const { username, email, password } = req.body;

    const identifier = email ? 'email': username ? 'username' : null;  
    if (!identifier) {
        return res.status(400).json({ error: "email or username field is required" });
    }

    // Check if user exists
    const user = identifier === 'email'
        ? await userAccount.searchByEmail(email) 
        : await userAccount.searchByUsername(username);
    
    if (!user) {
        return res.status(404).json({ error: "User does not exist" });
    }

    const _userId = user.user_id; 

    const userPassword = user.password_hash;

    // Compare entered password with stored hash
    const match = await comparePassword(password, userPassword);
    
    if (match) {
        const sessionId = await setNewSession(_userId);
        console.log("Login successful");
        res.cookie("sessionId", sessionId, {
            httpOnly: true, // prevents JS access
            secure: false, // set true if using HTTPS
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });
        req.session.userId = _userId;
        return res.json({ message: "Login successful!" });
    }
    else
        return res.json({ error: "Incorrect password" });   

}

async function autoLogin(req, res) {
    let sessionId;
    try {
        sessionId = req.cookies.sessionId;
    }
    catch {
        return res.json({ error: "sessionId doesn't exist" });
    }
    const isUser = await isUserExists(sessionId);
    if(isUser){
        // console.log("got to index.html", isUser);
        return res.json({ message: "User exist" });
    }
    else {
        // console.log("got to login.html", isUser);
        return res.json({ error: "User doesn't exist" });
    }
}

async function logoutUser(req, res) {
    res.clearCookie("sessionId");
}

export {
    autoLogin,
    loginUser,
    signupUser,
    logoutUser
};