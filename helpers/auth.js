module.exports = {
    // ensureAuth : (req, res, next) => {
    //     if (req.isAuthenticated()) {
    //         return next();
    //     } else {
    //         res.redirect(302, '/user/login');
    //     }
    // },
    ensureUserIsAdmin : (req,res,next) => {
        if(req.isAuthenticated() && req.user.isAdmin === 'admin') {
            return next()
        } else {
            res.redirect(302,'/admin/login');
        }
    }
}