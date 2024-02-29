import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { EventsService } from './events.service';
import { Event } from './interfaces/event.interface';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  async findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Get('page/:page')
  async findPage(@Param('page') page: string) {
    return this.eventsService.findPage(page);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    if (id) {
      return this.eventsService.update(id, updateEventDto);
    } else {
      return this.eventsService.create(updateEventDto);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}
