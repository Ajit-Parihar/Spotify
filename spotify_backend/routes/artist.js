
const express = require("express");
const router = express.Router();
const User = require("../models/Artist");
const bcrypt = require("bcrypt");
const {getToken} = require("../utils/helpers");
const { db } = require("../models/User");
const Song = require("../models/Song");
const passport = require("passport");
const Artist = require("../models/Artist");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

router.post("/create",passport.authenticate("jwt", {session:false}), async (req,res)=>{
    const {name, photo} = req.body;

    if(!name||!photo){
          return res.status(301).json({err:"Insufficient details to create Artist."});
    }
    const artistDetails={name,photo};
    let CreatedArtist=await Artist.create(artistDetails);
    return res.status(200).json(CreatedArtist);    
});

router.get("/get",passport.authenticate("jwt",{session:false}), async(req,res)=>{
    const artists = await Artist.find(); 
    return res.status(200).json({data:artists});
});
router.get("/artistSong/:artistName", passport.authenticate("jwt",{session:false}), async(req,res)=>{
     const name = req.params.artistName;
    //  const ArtistSong=await Song.find({$and:[{artist:req.user._id }, {ArtistProducer:name}]}).populate("artist");
    const ArtistSong=await Song.find({$and:[{artist:ObjectId('6789c070c86be8da9013e581') }, {ArtistProducer:name}]}).populate("artist");
     return res.status(200).json(ArtistSong);
});

module.exports = router;  