import { PrismaService } from '../prisma.service';
import { FhirMapperService } from './fhir-mapper.service';
import { EventsGateway } from '../events/events.gateway';
export declare class FhirController {
    private readonly prisma;
    private readonly fhir;
    private readonly events;
    constructor(prisma: PrismaService, fhir: FhirMapperService, events: EventsGateway);
    ingestBundle(bundle: any): Promise<{
        success: boolean;
        message: string;
        referralId: string;
    }>;
    getPatient(id: string): Promise<object>;
    getServiceRequest(id: string): Promise<object>;
    getServiceRequestEverything(id: string): Promise<object>;
}
