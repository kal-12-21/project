import { Module } from '@nestjs/common';
import { FhirController } from './fhir.controller';
import { FhirMapperService } from './fhir-mapper.service';
import { PrismaService } from '../prisma.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [FhirController],
  providers: [FhirMapperService, PrismaService],
  exports: [FhirMapperService],
})
export class FhirModule {}
