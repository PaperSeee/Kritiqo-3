declare module 'imap-simple' {
  export interface ImapConfig {
    imap: {
      user: string;
      password: string;
      host: string;
      port: number;
      tls: boolean;
      tlsOptions?: {
        rejectUnauthorized?: boolean;
      };
      authTimeout?: number;
      connTimeout?: number;
    };
  }

  export interface ImapMessage {
    attributes: {
      uid: number;
      [key: string]: any;
    };
    parts: ImapMessagePart[];
  }

  export interface ImapMessagePart {
    which: string;
    body: any;
  }

  export interface ImapConnection {
    openBox(boxName: string): Promise<any>;
    search(criteria: string[], options?: any): Promise<ImapMessage[]>;
    getBoxes(): Promise<any>;
    end(): Promise<void>;
  }

  export function connect(config: ImapConfig): Promise<ImapConnection>;
  export function getParts(struct: any): any[];
}
