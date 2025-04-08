const jwt = require('jsonwebtoken');


function setTokenCookie(res, username, password, email, secret){
    const token = jwt.sign({
        username,
        password,
        email,
    }, 
    secret,
    { expiresIn: '24h' })


    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
}


module.exports =
{
    setTokenCookie,
};