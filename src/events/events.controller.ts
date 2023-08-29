import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { EventsService } from './events.service';
import { ListEvents } from './input/list-event';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.entity';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';

@Controller('/events')
@SerializeOptions({
  strategy: 'excludeAll',
})
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents) {
    return await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
      filter,
      {
        total: true,
        currentPage: filter.page,
        limit: 10,
      },
    );
  }

  // @Get('/practice')
  // async practice() {
  // return this.repository.find({
  //   select: ['id', 'when'],
  //   where: [
  //     {
  //       id: MoreThan(3),
  //       when: MoreThan(new Date('2021-02-12T13:00:00')),
  //     },
  //     {
  //       description: Like('%meet%'),
  //     },
  //   ],
  //   take: 2,
  //   order: {
  //     id: 'DESC',
  //   },
  // });
  // }

  // @Get('/practice2')
  // async practice2() {
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

  // return await this.repository
  //   .createQueryBuilder('e')
  //   .select(['e.id', 'e.name'])
  //   .orderBy('e.id', 'DESC')
  //   .take(3)
  //   .getMany();
  // }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.getEvent(id);

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return await this.eventsService.createEvent(input, user);
  }

  // @UsePipes(new ValidationPipe({ groups: ['update'] }))
  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.getEvent(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'You are not authorized to update this event',
      );
    }

    return await this.eventsService.updateEvent(event, input);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.getEvent(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'You are not authorized to delete this event',
      );
    }

    return await this.eventsService.deleteEvent(id);
  }
}
