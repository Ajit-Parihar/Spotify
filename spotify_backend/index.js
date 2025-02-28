const express= require("express");
const mongoose=require("mongoose");
let JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const passport=require("passport");
const User = require("./models/User.js");
const authRoutes = require("./routes/auth.js");
const songRoutes = require("./routes/song.js");
const playlistRoutes = require("./routes/playlist.js");
const artistRoutes=require("./routes/artist.js");
const cors = require("cors");
require("dotenv").config();
const app=express();
const port=8080; 

app.use(cors());
app.use(express.json()); 

const MONGO_URL = "mongodb://127.0.0.1:27017/Spotify"; 
   
main().then(()=>{
    console.log("connected to MDB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

//setup passport-jwt

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
   User.findOne({_id: jwt_payload.identifier},function(err, user) {
    if (err) {
        return done(err, false);
    }
    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
    }
});
}));

app.get("/", (req, res)=>{
     res.send("Hello world");
}); 

app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);
app.use("/artist", artistRoutes)


app.listen(port,()=>{
   console.log("8080 port is lisning");
});