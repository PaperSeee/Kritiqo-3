import * as Imap from 'node-imap';

export interface ImapConfig {
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
}

export interface ImapMessage {
  attributes: {
    uid: number;
    [key: string]: any;
  };
  parts: any[];
}

export class SimpleImapClient {
  private imap: any;

  constructor(config: ImapConfig) {
    // Use the default export from node-imap
    const ImapConstructor = (Imap as any).default || Imap;
    this.imap = new ImapConstructor({
      user: config.user,
      password: config.password,
      host: config.host,
      port: config.port,
      tls: config.tls,
      tlsOptions: config.tlsOptions,
      authTimeout: config.authTimeout || 10000,
      connTimeout: config.connTimeout || 15000
    });
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => resolve());
      this.imap.once('error', reject);
      this.imap.connect();
    });
  }

  openBox(boxName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.imap.openBox(boxName, false, (err, box) => {
        if (err) reject(err);
        else resolve(box);
      });
    });
  }

  search(criteria: string[]): Promise<number[]> {
    return new Promise((resolve, reject) => {
      this.imap.search(criteria, (err, results) => {
        if (err) reject(err);
        else resolve(results || []);
      });
    });
  }

  end(): Promise<void> {
    return new Promise((resolve) => {
      this.imap.once('end', () => resolve());
      this.imap.end();
    });
  }
}

export function connect(config: { imap: ImapConfig }): Promise<SimpleImapClient> {
  return new Promise(async (resolve, reject) => {
    try {
      const client = new SimpleImapClient(config.imap);
      await client.connect();
      resolve(client);
    } catch (error) {
      reject(error);
    }
  });
}
