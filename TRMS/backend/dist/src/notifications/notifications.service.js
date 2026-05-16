"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const twilio_1 = __importDefault(require("twilio"));
let NotificationsService = NotificationsService_1 = class NotificationsService {
    logger = new common_1.Logger(NotificationsService_1.name);
    twilioClient = null;
    constructor() {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        if (accountSid && authToken) {
            this.twilioClient = (0, twilio_1.default)(accountSid, authToken);
            this.logger.log('Twilio client initialized for Live SMS');
        }
    }
    async sendReferralAcceptedSMS(phone, token, facilityName) {
        if (!phone) {
            this.logger.warn(`Missing phone number, skipping SMS notification for Token [${token}]`);
            return { success: false, message: 'No phone number provided' };
        }
        const message = `TRMS: Your referral to ${facilityName} has been ACCEPTED. Your tracker token is: ${token}. Please present this upon arrival.`;
        if (this.twilioClient) {
            try {
                const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
                if (!twilioPhone) {
                    throw new Error('TWILIO_PHONE_NUMBER is required but not set in .env');
                }
                const response = await this.twilioClient.messages.create({
                    body: message,
                    from: twilioPhone,
                    to: phone
                });
                this.logger.log(`Live Twilio SMS dispatched to ${phone}. SID: ${response.sid}`);
                return { success: true, token, provider: 'TWILIO', sid: response.sid };
            }
            catch (error) {
                this.logger.error(`Failed to send Live Twilio SMS: ${error.message}`);
            }
        }
        this.logger.log(`\n================= MOCK SMS DISPATCH =================`);
        this.logger.log(`To: ${phone}`);
        this.logger.log(`Message: ${message}`);
        this.logger.log(`=====================================================\n`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { success: true, token, provider: 'MOCK' };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map