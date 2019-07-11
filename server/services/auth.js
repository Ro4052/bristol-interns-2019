module.exports = (req, res, next) => {
    if (process.env.NODE_ENV === 'testing' && !req.session.user) {
        req.session.user = 'halfling'
    }
    if (req.session.user) next();
    else res.sendStatus(401);
}
