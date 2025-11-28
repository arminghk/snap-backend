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
    private readonly rd: RedisService,
    private readonly utils: UtilsService,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    const checkRootUser = await this.pg.models.Admin.findOne({
      where: {
        isDefault: true,
      },
    });
    if (checkRootUser) {
      this.logger.verbose('Initializing', 'Root user already exists');
      return;
    }
    const defaultPassword = 'Root@panel123!';
    const { salt, hash } =
      await this.utils.PasswordHandler.generate(defaultPassword);
    const admin = await this.pg.models.Admin.create({
      email: 'root@palgam.com',
      name: 'Root Admin',
      isDefault: true,
      isActive: true,
      password: hash,
      salt,
    });

    // if (!rootRole) rootRole = await this.pg.models.RbacRole.create({
    //     name: "root",
    //     category: "ADMIN",
    //     hasFullAccess: true,
    //     isDefault: true
    // });

    this.logger.verbose('Initializing', 'Root user has been created');
    return;
  }

  //   private async getAdminById(id: string) {
  //     let admin: Admin = null;
  //     let _admin: any = await this.rd.sessionCli.get(`admin_${id}`);
  //     if (!_admin) {
  //       _admin = await this.pg.models.Admin.findByPk(id, {
  //         include: [
  //           {
  //             model: this.pg.models.RbacRole,
  //             as: 'roles',
  //             nested: true,
  //             include: [
  //               {
  //                 model: this.pg.models.RbacAction,
  //                 as: 'actionsIncluded',
  //                 nested: true,
  //               },
  //               {
  //                 model: this.pg.models.RbacAction,
  //                 as: 'actionsExcluded',
  //                 nested: true,
  //               },
  //             ],
  //           },
  //         ],
  //         nest: true,
  //       });
  //       if (!_admin) return null;
  //       _admin = this.utils.jsonWrapper(_admin);
  //       await this.rd.sessionCli.set(
  //         `admin_${_admin.id}`,
  //         JSON.stringify(_admin),
  //         'EX',
  //         900,
  //       );
  //       admin = _admin;
  //     } else admin = JSON.parse(_admin);
  //     return admin;
  //   }
  //   private async getSessionById(id: string) {
  //     let session: AdminSession = null;
  //     let _session: any = await this.rd.sessionCli.get(`adminSession_${id}`);
  //     if (!_session) {
  //       _session = await this.pg.models.AdminSession.findByPk(id, { raw: true });
  //       if (_session) {
  //         await this.rd.sessionCli.set(
  //           `adminSession_${_session.id}`,
  //           JSON.stringify(_session),
  //           'EX',
  //           900,
  //         );
  //         session = _session;
  //       }
  //     } else session = JSON.parse(_session);
  //     return session;
  //   }
  //   private async extendSession(id, refreshExpiresAt) {
  //     const updated = await this.pg.models.AdminSession.update(
  //       {
  //         refreshExpiresAt,
  //       },
  //       {
  //         where: {
  //           id,
  //         },
  //         returning: true,
  //       },
  //     );
  //     const session = updated[0] ? updated[1][0] : null;
  //     if (session)
  //       await this.rd.sessionCli.set(
  //         `adminSession_${session.id}`,
  //         JSON.stringify(session),
  //         'EX',
  //         900,
  //       );
  //     return session;
  //   }

  //? Admin panel > auth
  //   async authorize({
  //     query: { token },
  //   }: ServiceClientContextDto): Promise<ServiceResponseData> {
  //     let isAuthorized: boolean = false;
  //     let clearCookie: string = 'ADMIN';
  //     let tokenData = null;
  //     let profile: Admin = null;
  //     let session = null;
  //     let roleNames = [];
  //     let actionsIncluded = [];
  //     let actionsExcluded = [];
  //     let hasFullAccess = false;
  //     let profileId = null;
  //     const decodedToken = this.utils.JwtHandler.AccessToken.decode(token);
  //     if (decodedToken) {
  //       profileId = decodedToken.accountId;
  //       profile = await this.getAdminById(profileId);
  //       if (profile) {
  //         if (+new Date(decodedToken.refreshExpiresAt) <= +new Date()) {
  //           await this.pg.models.AdminSession.destroy({
  //             where: { id: decodedToken.sessionId },
  //           });
  //           await this.rd.sessionCli.del(
  //             `adminSession_${decodedToken.sessionId}`,
  //           );
  //         } else {
  //           session = await this.getSessionById(decodedToken.sessionId);
  //           if (+new Date(decodedToken.accessExpiresAt) <= +new Date()) {
  //             if (session) {
  //               const accessToken = new this.utils.JwtHandler.AccessToken(
  //                 session.assistantId,
  //                 'ADMIN',
  //               );
  //               tokenData = accessToken.generate(session.id);
  //               session = await this.extendSession(
  //                 session.id,
  //                 tokenData.payload.refreshExpiresAt,
  //               );
  //               isAuthorized = true;
  //             }
  //           } else {
  //             if (session) {
  //               isAuthorized = true;
  //             }
  //           }
  //         }
  //       }
  //     }
  //     if (isAuthorized) clearCookie = null;
  //     if (isAuthorized) {
  //       const rbacData: any = await this.getRbacData(profileId);
  //       roleNames = rbacData.roleNames;
  //       hasFullAccess = rbacData.hasFullAccess;
  //       actionsExcluded = rbacData.actionsExcluded;
  //       actionsIncluded = rbacData.actionsIncluded;
  //     }
  //     return {
  //       data: {
  //         isAuthorized,
  //         profile,
  //         session,
  //         roleNames,
  //         actionsExcluded,
  //         actionsIncluded,
  //         hasFullAccess,
  //         isActive: profile?.isActive ?? null,
  //         clearCookie,
  //       },
  //     };
  //   }
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
  //   async signOut({
  //     query,
  //   }: ServiceClientContextDto): Promise<ServiceResponseData> {
  //     try {
  //       await this.rd.sessionCli.del(`adminSession_${query.id}`);
  //       const session = await this.pg.models.AdminSession.findByPk(query.id);
  //       await session.destroy();
  //     } catch (e) {
  //       this.logger.debug(e);
  //     }
  //     return {
  //       data: {
  //         clearCookie: 'ADMIN',
  //       },
  //     };
  //   }
}
