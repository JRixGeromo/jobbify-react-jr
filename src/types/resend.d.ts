declare module 'resend' {
  export class Resend {
    constructor(apiKey: string);

    emails: {
      send(options: {
        from: string;
        to: string;
        subject: string;
        html: string;
        attachments?: {
          filename: string; // Name of the attached file
          content: string | Buffer; // File content (Base64 string or Buffer)
          contentType?: string; // MIME type of the file (e.g., 'application/pdf')
        }[];
      }): Promise<any>;
    };
  }
}
