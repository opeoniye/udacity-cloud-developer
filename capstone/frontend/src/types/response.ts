export default class Response {
    Status: boolean;
    Data: any;
    Messages: string;
    Exception: string;

    constructor(status: boolean, data: any, mess: string, exception: string) {
        this.Status = status;
        this.Data = data;
        this.Messages = mess;
        this.Exception = exception;
    }

}