import { Controller, Post, Body, Param, Get, ParseIntPipe, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get('user/:email')
  getBookingsByEmail(@Param('email') email: string) {
    return this.bookingService.getBookingsByEmail(email);
  }

  @Get(':id')
  getBookingforEvent(@Param('id', ParseIntPipe) id:number){
    return this.bookingService.getBookingforEvent(id)
  }
  @Get()
getAllBooking(){
  return this.bookingService.getAllBooking()
}
}
