const mongoose = require("mongoose");

const Artist=new mongoose.Schema({
    name:{
         type:String,
         require:true
    },
    photo:{
        type:String,
        require:true
    },
});

const ArtistModal = mongoose.model("Artist",Artist);
module.exports=ArtistModal;