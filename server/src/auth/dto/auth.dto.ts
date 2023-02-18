import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class AuthDto {
  @ApiProperty({ example: 'john@smith.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'somesecret' })
  @IsString()
  password: string;
}
