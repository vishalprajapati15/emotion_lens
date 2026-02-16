import jwt from 'jsonwebtoken'

export const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again!!' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (decodedToken.id) {
            req.userId = decodedToken.id;
        }
        else {
            return res.json({ success: false, message: 'Not Authorized. Login Again!!' });
        }

        next();
        
    } catch (error) {
        res.json({ success: false, message: `UserId fetch middleware Error: ${error.message}` });
    }
}