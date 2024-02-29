import { Model } from 'mongoose';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { Event } from './interfaces/event.interface';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
// import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EVENT_MODEL')
    private eventModel: Model<Event>,
    private schedulerRegistry: SchedulerRegistry,
    // private readonly mailerService: MailerService,
  ) {}

  private formatCronDate(event: CreateEventDto | UpdateEventDto): Date {
    const reminderDate = new Date(
      new Date(event.date).toLocaleString('en-US', {
        timeZone: 'UTC',
      }),
    );

    if (event.time) {
      let hour = +event.time.split(':')[0];
      let minute = +event.time.split(':')[1];
      if (minute < 30 && hour < 1) {
        reminderDate.setDate(reminderDate.getDate() - 1);
        hour = 23;
        minute = 60 - (30 - minute);
      } else if (minute < 30) {
        minute = 60 - (30 - minute);
        hour = hour - 1;
      } else {
        minute = minute - 30;
      }
      reminderDate.setHours(+hour, +minute, 0);
      return reminderDate;
    }
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const createdEvent = new this.eventModel(createEventDto);
    const reminderDate = this.formatCronDate(createEventDto);
    const reminder = new CronJob(reminderDate, () => {
      Logger.warn('30 minute warning for ' + createEventDto.name);
      if (createEventDto.invites) {
        createEventDto.invites.forEach((invite) => {
          // Here we would send web-push notifications with service worker
          //   this.mailerService.sendMail({
          //     to: invite,
          //     from: 'noreply@example.com',
          //     subject: `30 Min Reminder for ${createEventDto.name}`,
          //     text: `${createEventDto.description}`,
          //   });
          Logger.log(`${invite} invited`);
        });
      }
    });
    this.schedulerRegistry.addCronJob(createdEvent._id, reminder);
    reminder.start();
    return createdEvent.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async findPage(page: string): Promise<Event[]> {
    return this.eventModel.find().limit(+page);
  }

  async update(id, updateEventDto: UpdateEventDto) {
    const filter = { _id: id };
    const date = this.formatCronDate(updateEventDto);
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const months = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    const cronDateTime = new CronTime(
      `1 ${minutes} ${hours} ${days} ${months} ${dayOfWeek}`,
    );
    try {
      this.schedulerRegistry.getCronJob(id).setTime(cronDateTime);
    } catch (err) {
      Logger.warn('No Cron Job Scheduled');
    }
    return this.eventModel.findOneAndUpdate(filter, updateEventDto);
  }

  async delete(id) {
    try {
      this.schedulerRegistry.getCronJob(id).stop();
    } catch (err) {
      Logger.warn('No Cron Job scheduled');
    }
    return this.eventModel.deleteOne({ _id: id });
  }
}
