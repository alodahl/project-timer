const mongoose = require('mongoose');

const timerSchema = mongoose.Schema({
  label: {type: String, default: "NEW PROJECT"},
  category: {type: String, default: ""},
  creationDate: {type: Date, default: new Date()},
  projectNotes: {type: String, default: ""},
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
    totalTimeInSeconds: this.totalTimeInSeconds,
    isRunning: false,
    currentEntryCount: 0
  };
}

const Timer = mongoose.model('timers', timerSchema);

module.exports = {Timer};
