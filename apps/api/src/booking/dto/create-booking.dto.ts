import { IsEmail, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsInt()
  eventId!: number;

  @IsNotEmpty()
  @IsEmail()
  userEmail!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity!: number;
}
