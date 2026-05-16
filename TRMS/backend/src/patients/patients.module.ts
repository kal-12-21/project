import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PatientsController],
  providers: [PrismaService],
})
export class PatientsModule {}
