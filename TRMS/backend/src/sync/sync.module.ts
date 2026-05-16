import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { PrismaService } from '../prisma.service';
import { EventsModule } from '../events/events.module';
import { AttachmentsModule } from '../attachments/attachments.module';

@Module({
  imports: [EventsModule, AttachmentsModule],
  controllers: [SyncController],
  providers: [SyncService, PrismaService],
})
export class SyncModule {}
