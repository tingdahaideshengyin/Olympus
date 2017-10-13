import Module from "engine/module/Module";
import ModuleManager from "engine/module/ModuleManager";
import ResponseData from "engine/net/ResponseData";
import SecondModule from "./SecondModule";
import ModuleMessage from "engine/module/ModuleMessage";
import SceneMediator from "engine/scene/SceneMediator";
import TestResponse from "../net/response/TestResponse";
import TestRequest from "../net/request/TestRequest";
import { bridgeManager } from "engine/bridge/BridgeManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 测试首个模块
*/

@DOMMediatorClass
class FirstMediator extends SceneMediator
{
    @Inject
    private moduleManager:ModuleManager;

    public btn:HTMLDivElement;
    public txt:HTMLSpanElement;

    public listAssets():string[]
    {
        return ["./modules/test.html"];
    }

    public onOpen():void
    {
        this.mapListener(this.btn, "click", function():void
        {
            this.txt.textContent = "Fuck you!!!";
            this.moduleManager.open(SecondModule);
        }, this);
    }
    
    @MessageHandler(ModuleMessage.MODULE_CHANGE)
    private onModuleChange(from:any, to:any):void
    {
        if(to == FirstModule) console.log("change to first module!");
        else if(to == SecondModule) console.log("change to second module!");
    }

    @ResponseHandler
    private onResponse(res:TestResponse, req:TestRequest):void
    {
        alert("123");
    }
}

@ModuleClass
export default class FirstModule extends Module
{
    @DelegateMediator
    private _mediator:FirstMediator;
}