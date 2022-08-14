export const Auth_check = (req, res, next) => {
    if (req.session.user != null) {
        req.user = req.session.user
        next()
    } else {
        return res.status(401).json({
            message: 'Log in to Continue'
        })
    }
}