const express = require('express')
const app = express()
const passport = require('passport')
const ActiveDirectoryStrategy = require('passport-activedirectory')

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended : false}))

passport.use(new ActiveDirectoryStrategy({
    integrated: false,
    ldap: {
      url: 'ldap://my.domain.com',
      baseDN: 'DC=my,DC=domain,DC=com',
      username: 'readuser@my.domain.com',
      password: 'readuserspassword'
    }
  }, function (profile, ad, done) {
    ad.isUserMemberOf(profile._json.dn, 'AccessGroup', function (err, isMember) {
      if (err) return done(err)
      return done(null, profile)
    })
  }))

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.listen(3000)