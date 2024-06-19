import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const RawHeaders = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {

        // console.log(ctx.args);

        //OBTENERMOS LA DATA QUE VIENE EN EL REQUEST
        const req = ctx.switchToHttp().getRequest();

        // console.log(req.rawHeaders);
        const headers = req.rawHeaders;

        if(!headers){
            throw new InternalServerErrorException('Headers not found (request)');
        }

        return headers;



    }
)