import { Controller, HttpStatus, Logger } from "@nestjs/common";
import { EventPattern, MessagePattern } from "@nestjs/microservices";
import { SelfActionService } from "./actions.service";
import { ServiceClientActionInputDto, ServiceClientEventInputDto, ServiceClientOutputDto } from "./dto";
// import { SelfEventService } from "./events.service";


@Controller()
export class ServiceController {

    constructor(
        private readonly actions: SelfActionService,
        // private readonly events: SelfEventService
    ) { }


    @MessagePattern("callAction")
    async callTestMessage(data:ServiceClientActionInputDto):Promise<ServiceClientOutputDto<ServiceClientActionInputDto>> {
        try {
            const res = await this.actions.findAndCall(data);
            return {
                context: data,
                status: "SUCCEED",
                code: 200,
                message: res?.message || "Ok",
                error: null,
                data: res?.data || null
            }
        } catch (e) {
            return {
                context: data,
                status: "FAILED",
                code: e?.code || HttpStatus.INTERNAL_SERVER_ERROR,
                message: e?.msg || null,
                error: e?.message || "err_service_notHandledError",
                data: null
            }
        }
    }

    // @EventPattern("callEvent")
    // async callTestEvent(data) {
    //     try {
    //         const res = await this.events.findAndTrigger(data);
    //         return {
    //             context: data,
    //             status: "SUCCEED",
    //             code: 200,
    //             message: res?.message || "Ok",
    //             error: null,
    //             data: res?.data || null
    //         }
    //     } catch (e) {
    //         return {
    //             context: data,
    //             status: "FAILED",
    //             code: e?.code || HttpStatus.INTERNAL_SERVER_ERROR,
    //             message: null,
    //             error: e?.message || "err_service_notHandledError",
    //             data: null
    //         }
    //     }
    // }
}