export class Config {
    /**
     *
     */
    constructor(readonly bt_addr: string,
        readonly bt_name: string,
        readonly email: string,
        readonly language: string,
        readonly MAIL_PASSWORD: string,
        readonly MAIL_PORT: number,
        readonly MAIL_SERVER: string,
        readonly MAIL_USERNAME: string,
        readonly MAIL_USE_SSL: boolean,
        readonly MAIL_USE_TLS: boolean) {


    }
}