export declare function toFhirPatient(patient: any): {
    resourceType: string;
    id: any;
    identifier: {
        system: string;
        value: any;
    }[];
    name: {
        family: any;
        given: any[];
    }[];
    gender: any;
    telecom: {
        system: string;
        value: any;
    }[];
};
export declare function toFhirServiceRequest(referral: any): {
    resourceType: string;
    id: any;
    status: string;
    intent: string;
    priority: any;
    subject: {
        reference: string;
    };
    requester: {
        reference: string;
    };
    performer: {
        reference: string;
    }[];
    note: {
        text: any;
    }[];
    authoredOn: any;
};
export declare function toFhirConsent(consent: any): {
    resourceType: string;
    id: any;
    status: string;
    scope: {
        coding: {
            code: string;
        }[];
    };
    patient: {
        reference: string;
    };
    dateTime: any;
};
