const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
  moduleID: { type: String, unique: false },
  chapterID: { type: String, required: true },
  moduleName: { type: String, required: false },
  moduleContent: { type: String, required: false },
  moduleTime: { type: Number, required: false },
  moduleScore: { type: Number, min: 1, max: 5, default: null },
});

const chapterSchema = new Schema({
  areaID: { type: String, required: true },
  chapterID: { type: String, unique: false },
  chapterName: { type: String, required: false },
  chapterObjective: { type: String, required: false },
  chapterScore: { type: Number, min: 1, max: 5, default: null },
  modules: [moduleSchema]
});

const keyAreaSchema = new Schema({
  mapID: { type: String, required: true },
  areaID: { type: String, unique: false },
  areaName: { type: String, required: false },
  areaDescription: { type: String, required: false },
  chapters: [chapterSchema]
});

const roadmapSchema = new Schema({
  mapID: { type: String, unique: true },
  mapName: { type: String, required: false },
  useCase: { type: String, required: false },
  keyAreas: [keyAreaSchema],
  published: { type: Boolean, default: false },
  creator: { type: String, required: false }
});

const Roadmap = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema, 'roadmaps');

module.exports = Roadmap;


