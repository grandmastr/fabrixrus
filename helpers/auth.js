module.exports = {
    ensureUserIsAdmin : (req,res,next) => {
        if(req.isAuthenticated() && req.user.isAdmin === 'admin') {
            return next()
        } else {
            res.redirect(303,'/admin/login');
        }
    }
};