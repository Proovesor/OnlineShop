exports.get404 = (req, res, next) => {
    res.status(404).render('404', {
        pageName: 'Page not found!',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
    });
}