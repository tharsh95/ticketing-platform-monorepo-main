import { IsString, IsDateString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  totalTickets?: number;

  @IsOptional()
  @IsNumber()
  availableTickets?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
