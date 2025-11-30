import {
  HttpStatus,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Admin } from '@nestjs/microservices/external/kafka.interface';
import { UtilsService } from 'src/_utils/utils.service';
import { PostgresService } from 'src/databases/postgres/postgres.service';
import { RedisService } from 'src/databases/redis/redis.service';
import {
  ServiceClientContextDto,
  ServiceResponseData,
  SrvError,
} from 'src/services/dto';

@Injectable()
export class AdminsService implements OnApplicationBootstrap {
  private logger = new Logger('providers/admins');
  constructor(
    private readonly pg: PostgresService,
    private readonly utils: UtilsService,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
        const checkRootUser = await this.pg.models.Admin.findOne({
            where: {
                isDefault: true
            }
        });
        if (checkRootUser) {
            this.logger.verbose("Initializing", "Root user already exists");
            return;
        }
        const defaultPassword = "rootpanelpassword";
        const { salt, hash } = await this.utils.PasswordHandler.generate(defaultPassword);
        const admin = await this.pg.models.Admin.create({
            email: "root@snapp.com",
            name: "Root Admin",
            isDefault: true,
            isActive: true,
            password: hash,
            salt
        });
    
        this.logger.verbose("Initializing", "Root user has been created");
        return;
  }
  async signIn({
    query,
  }: ServiceClientContextDto): Promise<ServiceResponseData> {
    const email = query.email.toLowerCase();

    //get profile
    const profile = await this.pg.models.Admin.findOne({
      where: {
        email,
      },
      nest: true,
      raw: true,
    });
    if (!profile) {
      throw new SrvError(
        HttpStatus.BAD_REQUEST,
        'err_auth_usernameOrPasswordNotValid',
      );
    }
    // check password
    const passwordCheck = await this.utils.PasswordHandler.validate(
      query.password,
      profile.salt!,
      profile.password!,
    );
    if (!passwordCheck)
      throw new SrvError(
        HttpStatus.BAD_REQUEST,
        'err_auth_usernameOrPasswordNotValid',
      );

    //create session
    const newSession = await this.pg.models.AdminSession.create({
      adminId: profile.id,
      refreshExpiresAt: +new Date(),
    });
    const accessToken = new this.utils.JwtHandler.AccessToken(
      profile.id!,
      'ADMIN',
    );
    const tokenData = accessToken.generate(newSession.id!);
    await newSession.update({
      refreshExpiresAt: tokenData!.payload.refreshExpiresAt,
    });
    await newSession.reload();
    const _profile = await this.pg.models.Admin.scope(
      'withoutPassword',
    ).findByPk(profile.id, {
      raw: true,
    });

    return {
      data: {
        profile: _profile,
        session: newSession,
        isActive: _profile!.isActive,
        tokenData,
      },
    };
  }
}
