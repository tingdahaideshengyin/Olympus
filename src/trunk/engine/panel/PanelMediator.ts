import Mediator from "../mediator/Mediator";
import IPanel from "./IPanel";
import IPanelPolicy from "./IPanelPolicy";
import { panelManager } from "./PanelManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 实现了IPanel接口的弹窗中介者基类
*/
export default class PanelMediator extends Mediator implements IPanel
{
    /**
     * 弹出策略
     * 
     * @type {IPanelPolicy}
     * @memberof PanelMediator
     */
    public policy:IPanelPolicy;
    
    public constructor(skin?:any, policy?:IPanelPolicy)
    {
        super(skin);
        this.policy = policy;
    }

    /**
     * 弹出当前弹窗（等同于调用PanelManager.pop方法）
     * 
     * @param {*} [data] 数据
     * @param {boolean} [isModel] 是否模态弹出（后方UI无法交互）
     * @param {{x:number, y:number}} [from] 弹出点坐标
     * @returns {IPanel} 弹窗本体
     * @memberof PanelMediator
     */
    public open(data?:any, isModel?:boolean, from?:{x:number, y:number}):IPanel
    {
        super.open(data);
        return panelManager.pop(this, data, isModel, from);
    }

    /**
     * 关闭当前弹窗（等同于调用PanelManager.drop方法）
     * 
     * @param {*} [data] 数据
     * @param {{x:number, y:number}} [to] 关闭点坐标
     * @returns {IPanel} 弹窗本体
     * @memberof PanelMediator
     */
    public close(data?:any, to?:{x:number, y:number}):IPanel
    {
        super.close(data);
        return panelManager.drop(this, data, to);
    }
    
    /** 在弹出前调用的方法 */
    public onBeforePop(data?:any, isModel?:boolean, from?:{x:number, y:number}):void
    {
        // 可重写
    }

    /** 在弹出后调用的方法 */
    public onAfterPop(data?:any, isModel?:boolean, from?:{x:number, y:number}):void
    {
        // 可重写
    }

    /** 在关闭前调用的方法 */
    public onBeforeDrop(data?:any, to?:{x:number, y:number}):void
    {
        // 可重写
    }

    /** 在关闭后调用的方法 */
    public onAfterDrop(data?:any, to?:{x:number, y:number}):void
    {
        // 可重写
    }
}