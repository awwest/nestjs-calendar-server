import * as mongoose from 'mongoose';

export const EventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  time: String,
  description: String,
  invites: Array<string>,
});
