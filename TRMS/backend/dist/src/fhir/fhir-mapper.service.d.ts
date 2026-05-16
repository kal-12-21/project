export declare class FhirMapperService {
    toFhirPatient(patient: any): object;
    toFhirServiceRequest(ref: any): object;
    toFhirTask(task: any, serviceRequestId: string): object;
    toBundle(resources: object[], type?: 'searchset' | 'collection'): object;
    private mapGender;
    parseFhirBundle(bundle: any): {
        patientData: any;
        serviceRequestData: any;
    };
    private parseGender;
}
