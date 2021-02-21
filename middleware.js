export const isLoggedIn = (req, res, next) => {
    const userAuthCode = process.env.userAuthCode || 'userAuthCode';
    if (req.cookies.userAuthCode === userAuthCode) {
        next();
    } else {
        res.redirect('/');
    }
}