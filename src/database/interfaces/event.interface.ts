import { Date, Document } from 'mongoose';

export interface Event extends Document {
  readonly name: string;
  readonly date: Date;
  readonly description: string;
}
