import { Injectable, Logger } from "@nestjs/common";
import { AuthorizeOutputDto } from "src/dtos/public.dto";
import { MainServiceClient } from "src/services/main.service";


@Injectable()
export class AdminAuthService {
    private logger = new Logger("rest/admin/auth/service")
    constructor(
        private readonly mainSrvCli: MainServiceClient,
   
    ) { }

    async authorize(token: string): Promise<AuthorizeOutputDto> {
        const data = await this.mainSrvCli.callAction({
            provider: 'ADMIN',
            action: "authorize",
            query: {
                token
            }
        });
        return handleSrvCliResponse(data);
    }

    async signIn(signInData: AdminSignInInputDto): Promise<AdminSignInOutputDto> {
        const data = await this.mainSrvCli.callAction({
            provider: 'ADMIN',
            action: "signIn",
            query: signInData
        });
        return handleSrvCliResponse(data);
    }

    async signOut(session: AdminSessionModel): Promise<StatusResponseDto> {
        const data = await this.mainSrvCli.callAction({
            provider: MainServiceProvidersEnum.ADMINS,
            action: "signOut",
            query: {
                id: session.id
            }
        });
        return handleSrvCliResponse(data);
    }

    async getProfile(req): Promise<GetAdminProfileOutputDto> {
        return {
            userType: req.acc_type,
            profile: req.acc_profile,
            session: req.acc_session,
            roleNames: req.acc_roleNames,
            actionsIncluded: req.acc_actionsIncluded,
            actionsExcluded: req.acc_actionsExcluded
        }
    }

 
}