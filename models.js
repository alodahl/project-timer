const mongoose = require('mongoose');

const timerSchema = mongoose.Schema({
  label: {label: String},
  category: {type: String},
  creationDate: {type: Date, default: new Date()},
  projectNotes: {type: String},
  logs: [{
    seconds: Number,
    endDate: {type: Date, default: new Date()}
     }]
});

timerSchema.virtual('totalTimeInSeconds').get(function() {
  return this.logs.reduce(function(totalTimeInSeconds, log){
    return totalTimeInSeconds + log.seconds;
  }, 0);
});

timerSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    label: this.label,
    category: this.category,
    creationDate: this.creationDate,
    projectNotes: this.projectNotes,
    totalTimeInSeconds: this.totalTimeInSeconds
  };
}

const Timer = mongoose.model('timers', timerSchema);

module.exports = {Timer};
