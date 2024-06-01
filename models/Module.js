// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const moduleSchema = new Schema({
//   moduleName: { type: String, required: false },
//   moduleType: { type: String, required: false },
//   moduleObjective: { type: String, required: false },
//   moduleContent: { type: String, required: false },
//   moduleResources: { type: String, required: false },
//   moduleCriteria: { type: String, required: false },
//   moduleScore: { type: Number, min: 1, max: 5, default: null }
// });

// const Module = mongoose.models.Module || mongoose.model('Module', moduleSchema, 'modules');

// module.exports = Module;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
  moduleID: { type: String, unique: true },
  moduleName: { type: String, required: false },
  moduleType: { type: String, required: false },
  moduleObjective: { type: String, required: false },
  moduleContent: { type: String, required: false },
  moduleResources: { type: String, required: false },
  moduleCriteria: { type: String, required: false },
  moduleScore: { type: Number, min: 1, max: 5, default: null }
});

const Module = mongoose.models.Module || mongoose.model('Module', moduleSchema, 'modules');

module.exports = Module;
