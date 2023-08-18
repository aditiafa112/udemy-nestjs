import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(5, 255, {
    message: 'nama harus lebih dari atau sama dengan 5 karakter',
    groups: ['create'],
  })
  name: string;

  @IsString()
  @Length(5, 255)
  description: string;

  @IsDateString()
  when: string;

  // @Length(5, 255, { groups: ['create'] })
  // @Length(10, 20, { groups: ['update'] })
  @IsString()
  @Length(5, 255)
  address: string;
}
