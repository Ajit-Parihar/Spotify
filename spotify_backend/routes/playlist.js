const express = require("express");
const passport = require("passport");
const Playlist = require("../models/Playlist");
const User = require("../models/User");
const Song = require("../models/Song");

const router = express.Router();

//Route 1. create a playlist

router.post("/create",passport.authenticate("jwt",{session:false}), async(req,res)=>{
   const currentUser = req.user;
   const {name, thumbnail, songs} = req.body;
   if(!name|| !thumbnail|| !songs){
      return res.status(301).json({err: "insufficient data"});
   }
   const playlistData={
    name: name,
    thumbnail: thumbnail,
    songs: songs,
    owner: currentUser._id,
    collaborators: [],
   };
   const playlist = await Playlist.create(playlistData);
   return res.status(200).json(playlist);
 
});


//route 2: get a playlist by Id
router.get("/get/playlist/:playlistId", passport.authenticate("jwt",{session: false}), async(req,res)=>{
    const playlistId = req.params.playlistId;
    const playlist = await Playlist.findOne({_id: playlistId}).populate({
        path:"songs",
        populate:{
            path:"artist"
        },
    });
    if(!playlist){
       return res.status(301).json({err: "Invalid ID"});
    }
    return res.status(200).json(playlist);
});

//get all playlist made by artist

router.get("/get/artist/:artistId", passport.authenticate("jwt" ,{session: false}), async(req,res)=>{
   const artistId = req.params.artistId;
   //check give artistId artist present
   const artist = await User.findOne({_id: artistId});
   if(!artist){
       return res.status(304).json({err: "Invalid Artist ID"});
   }

   const playlists = await Playlist.find({owner: artistId});
   return res.status(200).json({data: playlists});
});

// Get all playlists made by me
// /get/me
router.get(
   "/get/me",
   passport.authenticate("jwt", {session: false}),
   async (req, res) => {
       const artistId = req.user._id;

       const playlists = await Playlist.find({owner: artistId}).populate(
        "owner"
    );
       return res.status(200).json({data: playlists});
   }
);

//add a song to playlist.
router.post("/add/song",passport.authenticate("jwt",{session: false}), async(req,res)=>{
    const currentUser = req.user;
    const {playlistId, songId} = req.body;
    //step 0: get the playlist is valid
    const playlist = await Playlist.findOne({_id: playlistId});
    if(!playlist){
        return res.status(304).json({err:"playlist does not exists"});
    }
    //step1: currentUser owns the playlist or is a collaborator
    if(!playlist.owner.equals( currentUser._id) &&
      !playlist.collaborators.includes(currentUser._id)
    ){
        return res.status(400).json({err:"Not allowed"});
    }

    //setp2: checi if the song is a valid song
    const song = await Song.findOne({_id:songId});
    if(!song){
       return res.status(304).json({err: "Song does not exist"});
    }

    //step 3: we can now simply add teh song to the playlist
     playlist.songs.push(songId);
     await playlist.save();

     return res.status(200).json(playlist);
});

module.exports = router;
