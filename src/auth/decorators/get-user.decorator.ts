import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const GetUser = createParamDecorator(
    ( data: string, ctx: ExecutionContext) => {

        // console.log({data});

        const req = ctx.switchToHttp().getRequest();

        const user = !data ? req.user : req.user[data];

        // console.log({userEmail: user[data]});

        if(!user){
            throw new InternalServerErrorException('User not found (request)');
        }

        return user;

    }
)