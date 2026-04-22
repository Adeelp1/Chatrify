import { joinRoom } from '../services/socket.service.js';

export function matchUser(req, res) {
    try {
        const { userA, userB } = req.body;
        console.log(req.body);
        console.log("matchUser users:", userA, userB);

        // validation
        if (!userA || !userB) {
            return res.status(400).json({
                success: false,
                message: "UserA and UserB are required"
            });
        }

        const success = joinRoom(userA, userB);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: "User not connected"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Users matched successfully"
        });
    } catch(error) {
        console.error("matchUser error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
