const express = require("express");
const router = express.Router();
const passport = require("passport");
const Song = require("../models/Song");
const User=require("../models/User");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// passport.authenticate("jwt",{session:false}),
router.post("/create",passport.authenticate("jwt",{session:false}),  async (req,res)=>{
    //without user authentication not get
    const {name, thumbnail,track, ArtistProducer,movieName} = req.body;
    
    if(!name|| !thumbnail ||!ArtistProducer ||!movieName|| !track){
        return res.status(301).json({err:"Insufficinet details to create song."});
    }
    const artist = req.user._id;
    const songDetails = {name, thumbnail,track, ArtistProducer, movieName, artist};

    // const createdSong = await Song.create(songDetails);

    return res.status(200).json(createdSong); 
});

//get route to get all songs I have published
router.get("/get/mysongs",passport.authenticate("jwt",{session:false}), async(req,res)=>{
 
    // const songs = await Song.find({artist: req.user._id}).populate("artist"); 
    const songs = await Song.find({artist: ObjectId("6789c070c86be8da9013e581")}).populate("artist"); 
    return res.status(200).json({data:songs});
});


//this route fatch song by any artist public
//I will send the artist id and all song find by artist publice

router.get("/get/artist/:artistId", passport.authenticate("jwt",{session: false}), async(req,res)=>{
   const {artistId} = req.params;
   const artist = await User.findOne({_id: artistId});
   if(!artist){
      return res.status(301).json({err: "Artist does not exist"});
   }
   const songs = await Song.find({artist: artistId});
   return res.status(200).json({data: songs});    
});

//get route to find song by name
router.get("/get/songname/:songName", passport.authenticate("jwt",{session: false}), async(req,res)=>{
     const {songName} = req.params;
     //song fetch by exact name 
     const songs = await Song.find({$or:[{name: songName},{ArtistProducer:songName},{movieName:songName}]}).populate("artist");
     return res.status(200).json({data: songs});
});

module.exports = router;  