module.exports = (req, res, next) => {
    if (req.session.user) next();
    else res.status(401).json({ message: "You need to log in with a username to enter the game."});
}
