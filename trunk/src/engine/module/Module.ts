import { core } from "../../core/Core";
import IMessage from "../../core/message/IMessage";
import ICommandConstructor from "../../core/command/ICommandConstructor";
import Observable from "../../core/observable/Observable";
import RequestData from "../net/RequestData";
import ResponseData from "../net/ResponseData";
import IModuleMediator from "../mediator/IModuleMediator";
import IModuleConstructor from "./IModuleConstructor";
import Dictionary from "../../utils/Dictionary";
import { moduleManager } from "./ModuleManager";
import { getConstructor } from "../../utils/ConstructUtil";
import Shell from "../env/Shell";
import IModule from "./IModule";
import IObservable from "../../core/observable/IObservable";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-14
 * @modify date 2017-09-14
 * 
 * 模块基类
*/
export default abstract class Module implements IModule
{
    /**
     * 打开时传入的参数
     * 
     * @type {*}
     * @memberof Module
     */
    public data:any;

    /**
     * 模块初始消息的返回数据
     * 
     * @type {ResponseData[]}
     * @memberof Module
     */
    public responses:ResponseData[];

    private _disposed:boolean = false;
    /**
     * 获取是否已被销毁
     * 
     * @readonly
     * @type {boolean}
     * @memberof Module
     */
    public get disposed():boolean
    {
        return this._disposed;
    }

    /**
     * 获取背景音乐URL
     * 
     * @readonly
     * @type {string}
     * @memberof Module
     */
    public get bgMusic():string
    {
        return null;
    }

    /**
     * 所属的模块引用
     * 
     * @readonly
     * @type {IModule}
     * @memberof IMediator
     */
    public get dependModuleInstance():IModule
    {
        return this;
    }
    
    /**
     * 所属的模块类型
     * 
     * @readonly
     * @type {IModuleConstructor}
     * @memberof IMediator
     */
    public get dependModule():IModuleConstructor
    {
        return getConstructor(<IModuleConstructor>this.constructor);
    }

    private _mediators:IModuleMediator[] = [];
    
    /**
     * 获取所有已托管的中介者
     * 
     * @returns {IModuleMediator[]} 已托管的中介者
     * @memberof Module
     */
    public get delegatedMediators():IModuleMediator[]
    {
        return this._mediators;
    }

    private _disposeDict:Dictionary<IModuleMediator, ()=>void> = new Dictionary();
    private disposeMediator(mediator:IModuleMediator):void
    {
        // 取消托管
        this.undelegateMediator(mediator);
        // 调用原始销毁方法
        mediator.dispose();
        // 如果所有已托管的中介者都已经被销毁，则销毁当前模块
        if(this._mediators.length <= 0) this.dispose();
    };
    
    /**
     * 托管中介者
     * 
     * @param {IModuleMediator} mediator 中介者
     * @memberof Module
     */
    public delegateMediator(mediator:IModuleMediator):void
    {
        if(this._mediators.indexOf(mediator) < 0)
        {
            // 托管新的中介者
            this._mediators.push(mediator);
            // 篡改dispose方法，以监听其dispose
            if(mediator.hasOwnProperty("dispose"))
                this._disposeDict.set(mediator, mediator.dispose);
            mediator.dispose = this.disposeMediator.bind(this, mediator);
        }
    }

    /**
     * 取消托管中介者
     * 
     * @param {IModuleMediator} mediator 中介者
     * @memberof Module
     */
    public undelegateMediator(mediator:IModuleMediator):void
    {
        var index:number = this._mediators.indexOf(mediator);
        if(index >= 0)
        {
            // 取消托管中介者
            this._mediators.splice(index, 1);
            // 恢复dispose方法，取消监听dispose
            var oriDispose:()=>void = this._disposeDict.get(mediator);
            if(oriDispose) mediator.dispose = oriDispose;
            else delete mediator.dispose;
            this._disposeDict.delete(mediator);
        }
    }

    /**
     * 判断指定中介者是否包含在该模块里
     * 
     * @param {IModuleMediator} mediator 要判断的中介者
     * @returns {boolean} 是否包含在该模块里
     * @memberof Module
     */
    public constainsMediator(mediator:IModuleMediator):boolean
    {
        return (this._mediators.indexOf(mediator) >= 0);
    }
    
    /**
     * 列出模块所需CSS资源URL，可以重写
     * 
     * @returns {string[]} CSS资源列表
     * @memberof Module
     */
    public listStyleFiles():string[]
    {
        return null;
    }

    /**
     * 列出模块所需JS资源URL，可以重写
     * 
     * @returns {string[]} js资源列表
     * @memberof Module
     */
    public listJsFiles():string[]
    {
        return null;
    }

    /**
     * 列出模块初始化请求，可以重写
     * 
     * @returns {RequestData[]} 模块的初始化请求列表
     * @memberof Module
     */
    public listInitRequests():RequestData[]
    {
        return null;
    }

    /**
     * 当模块资源加载完毕后调用
     * 
     * @param {Error} [err] 任何一个Mediator资源加载出错会给出该错误对象，没错则不给
     * @memberof Module
     */
    public onLoadAssets(err?:Error):void
    {
    }

    /**
     * 打开模块时调用，可以重写
     * 
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    public onOpen(data?:any):void
    {
        // 调用所有已托管中介者的open方法
        for(var mediator of this._mediators)
        {
            mediator.open(data);
        }
    }

    /**
     * 关闭模块时调用，可以重写
     * 
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    public onClose(data?:any):void
    {
        // 调用所有已托管中介者的close方法
        for(var mediator of this._mediators.concat())
        {
            mediator.close(data);
        }
    }

    /**
     * 模块切换到前台时调用（open之后或者其他模块被关闭时），可以重写
     * 
     * @param {IModuleConstructor|undefined} from 从哪个模块切换过来
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    public onActivate(from:IModuleConstructor|undefined, data?:any):void
    {
    }

    /**
     * 模块切换到后台是调用（close之后或者其他模块打开时），可以重写
     * 
     * @param {IModuleConstructor|undefined} to 要切换到哪个模块
     * @param {*} [data] 传递给模块的数据
     * @memberof Module
     */
    public onDeactivate(to:IModuleConstructor|undefined, data?:any):void
    {
    }
    
    /**
     * 派发内核消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof Core
     */
    public dispatch(msg:IMessage):void;
    /**
     * 派发内核消息，消息会转变为Message类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Core
     */
    public dispatch(type:string, ...params:any[]):void;
    public dispatch(typeOrMsg:any, ...params:any[]):void
    {
        core.dispatch(typeOrMsg, ...params);
    }
    
    /*********************** 下面是模块消息系统 ***********************/

    private _observable:Observable = new Observable();

    /**
     * 暴露IObservable接口
     * 
     * @readonly
     * @type {IObservable}
     * @memberof Module
     */
    public get observable():IObservable
    {
        return this._observable;
    }

    /**
     * 监听消息
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof IModuleObservable
     */
    public listenModule(type:IConstructor|string, handler:Function, thisArg?:any):void
    {
        this._observable.listen(type, handler, thisArg);
    }

    /**
     * 移除消息监听
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @memberof IModuleObservable
     */
    public unlistenModule(type:IConstructor|string, handler:Function, thisArg?:any):void
    {
        this._observable.unlisten(type, handler,thisArg);
    }

    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     * 
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof IModuleObservable
     */
    public mapCommandModule(type:string, cmd:ICommandConstructor):void
    {
        this._observable.mapCommand(type, cmd);
    }

    /**
     * 注销命令
     * 
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void} 
     * @memberof IModuleObservable
     */
    public unmapCommandModule(type:string, cmd:ICommandConstructor):void
    {
        this._observable.unmapCommand(type, cmd);
    }

    /**
     * 派发消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof IModuleObservable
     */
    public dispatchModule(msg:IMessage):void;
    /**
     * 派发消息，消息会转变为Message类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof IModuleObservable
     */
    public dispatchModule(type:string, ...params:any[]):void;
    /** dispatchModule方法实现 */
    public dispatchModule(...params:any[]):void
    {
        this._observable.dispatch.apply(this._observable, params);
    }

    /**
     * 销毁模块，可以重写
     * 
     * @memberof Module
     */
    public dispose():void
    {
        if(this._disposed) return;
        // 关闭自身
        var cls:IModuleConstructor = <IModuleConstructor>getConstructor(<IModuleConstructor>this.constructor);
        moduleManager.close(cls);
        // 如果没关上则不销毁
        if(moduleManager.isOpened(cls)) return;
        // 将所有已托管的中介者销毁
        for(var i:number = 0, len:number = this._mediators.length; i < len; i++)
        {
            var mediator:IModuleMediator = this._mediators.pop();
            this.undelegateMediator(mediator);
            mediator.dispose();
        }
        // 销毁Observable实例
        this._observable.dispose();
        this._observable = null;
        // 记录
        this._disposed = true;
    }
}