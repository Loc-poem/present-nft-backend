import { HttpException, HttpStatus } from "@nestjs/common"
export class ApiError extends HttpException {

    public meta: any;
    constructor(message: string, errorCode?: string, extraInfo?: any) {
        super(message, HttpStatus.BAD_REQUEST);
        this.meta = {
            msg: message || 'Internal server error',
            errorCode: errorCode || 'E0',
            extraInfo: extraInfo || {},
            code: -1
        }
    }

    static error(message: string, errorCode?: string, extraInfo?: any) {
        throw new ApiError(message, errorCode, extraInfo);
    }
}
