exports.myMiddleware = (req, res, next) => {
    req.name = 'Mat';
    next();
}

exports.homePage = (req, res) => {
    res.render('index');
};