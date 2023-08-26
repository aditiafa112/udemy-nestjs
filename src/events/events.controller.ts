import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './input/update-event.dto';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { ListEvents } from './input/list-event';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    const event =
      await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          total: true,
          currentPage: filter.page,
          limit: 10,
        },
      );
    return event;
  }

  @Get('/practice')
  async practice() {
    return this.repository.find({
      select: ['id', 'when'],
      where: [
        {
          id: MoreThan(3),
          when: MoreThan(new Date('2021-02-12T13:00:00')),
        },
        {
          description: Like('%meet%'),
        },
      ],
      take: 2,
      order: {
        id: 'DESC',
      },
    });
  }

  @Get('/practice2')
  async practice2() {
    // // return await this.repository.findOne({
    // //   where: { id: 1 },
    // //   relations: ['attendees'], // choose which relations to load
    // //   // loadEagerRelations: false, // replace eager: true
    // // });

    // const event = await this.repository.findOne({ where: { id: 1 } });
    // // const event = await new Event();
    // // event.id = 1;

    // /*using cascade*/
    // // const event = await this.repository.findOne({
    // //   where: { id: 1 },
    // //   relations: ['attendees'],
    // // });

    // const attendee = new Attendee();
    // attendee.name = 'Aditia';
    // attendee.event = event;

    // /*using cascade*/
    // // event.attendees.push(attendee);

    // await this.attendeeRepository.save(attendee);

    // /*using cascade*/
    // await this.repository.save(event);

    // return event;

    return await this.repository
      .createQueryBuilder('e')
      .select(['e.id', 'e.name'])
      .orderBy('e.id', 'DESC')
      .take(3)
      .getMany();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.getEvent(id);

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  // @UsePipes(new ValidationPipe({ groups: ['update'] }))
  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }

    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const result = await this.eventsService.deleteEvent(id);

    if (result?.affected !== 1) {
      throw new NotFoundException();
    }
  }
}
