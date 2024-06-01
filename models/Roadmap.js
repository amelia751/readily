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
  areaID: { type: String, required: false },
  chapterName: { type: String, required: false },
  objective: { type: String, required: false },
  score: { type: Number, min: 1, max: 5, default: null },
  modules: [moduleSchema]
});

const keyAreaSchema = new Schema({
  areaID: { type: String, unique: true },
  areaName: { type: String, required: false },
  roadmapID: { type: String, required: true },
  chapters: [chapterSchema]
});

const roadmapSchema = new Schema({
  mapID: { type: String, unique: true },
  useCase: { type: String, required: true },
  keyAreas: [keyAreaSchema],
  published: { type: Boolean, default: false },
  creator: { type: String, required: true }
});

const Roadmap = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema, 'roadmaps');

module.exports = Roadmap;
