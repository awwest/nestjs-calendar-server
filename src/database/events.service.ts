import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Event } from './interfaces/event.interface';
import { CreateEventDto } from './create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EVENT_MODEL')
    private eventModel: Model<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }
}
