var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var avisoSchema = new Schema({
    //id                : { type: String, required: true, trim: true, index: { unique: true } },
    url                 : { type: String, required: true, trim: true }
  , site                : { type: String }
  , location            : { type: String }
  , details             : { type: String }
  , title               : { type: String }
  , date                : { type: String }
  , date_created        : { type: Date  , required: true, default: Date.now }
});

var aviso = mongoose.model('avisos', avisoSchema);

module.exports = {
  aviso: aviso
};