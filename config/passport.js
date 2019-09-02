const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const hashedpassword = '$2a$10$Zcvz5uzRLAJHbx4PO73SheFdnmZfRvidCu9sct59u9WhNaINRX9X2' //JonalRayTicug


module.exports = function(passport){
    passport.use(
        new LocalStrategy({
            passwordField: 'password',
        },
        (password, done)=>{
            //Match Password
            bcrypt.compare(hashedpassword, {password}, (err,isMatch) => {
                if(err) throw err;

                if(isMatch){
                    return done(null, true)
                } 

                else{
                    return done(null, false, {message: 'Password is incorrect'})
                }
            })
        })
    
    )

    passport.serializeUser(function(user, done) {
        done(null, null);
      });
      
    passport.deserializeUser(function(id, done) {
    
    });
}