export declare class NotificationsService {
    private readonly logger;
    private twilioClient;
    constructor();
    sendReferralAcceptedSMS(phone: string, token: string, facilityName: string): Promise<{
        success: boolean;
        message: string;
        token?: undefined;
        provider?: undefined;
        sid?: undefined;
    } | {
        success: boolean;
        token: string;
        provider: string;
        sid: string;
        message?: undefined;
    } | {
        success: boolean;
        token: string;
        provider: string;
        message?: undefined;
        sid?: undefined;
    }>;
}
