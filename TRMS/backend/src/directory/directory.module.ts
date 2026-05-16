import { Module } from '@nestjs/common';
import { DirectoryController } from './directory.controller';
import { DirectoryService } from './directory.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DirectoryController],
  providers: [DirectoryService, PrismaService],
})
export class DirectoryModule {}
