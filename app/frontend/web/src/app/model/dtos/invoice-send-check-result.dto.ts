export interface InvoiceSendCheckResult {
    valid: boolean;
    message: string;
    missingFields?: string[];
}