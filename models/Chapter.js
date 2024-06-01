const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
  moduleID: { type: String, unique: true },
  chapterID: { type: String, required: true },
  moduleName: { type: String, required: false },
  moduleType: { type: String, required: false },
  moduleObjective: { type: String, required: false },
  moduleContent: { type: String, required: false },
  moduleResources: { type: String, required: false },
  moduleCriteria: { type: String, required: false },
  moduleScore: { type: Number, min: 1, max: 5, default: null }
});

const chapterSchema = new Schema({
  chapterID: { type: String, unique: true },
  chapterName: { type: String, required: true },
  objective: { type: String, required: true },
  score: { type: Number, min: 1, max: 5, default: null },
  modules: [moduleSchema]
});

const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema, 'chapters');

module.exports = Chapter;
