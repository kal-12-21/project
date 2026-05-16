import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    emitNewReferral(payload: {
        referralId: string;
        patientMrn: string;
        priority: string;
        destFacilityId: string;
        destFacilityName: string;
    }): void;
    emitReferralUpdated(payload: {
        referralId: string;
        status: string;
        note?: string;
    }): void;
}
