var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path="../dist/Olympus.d.ts"/>
define("main", ["require", "exports", "core/Core", "view/View", "engine/env/Explorer", "engine/env/Query", "engine/env/External", "engine/env/Hash", "engine/panel/PanelManager", "engine/scene/SceneManager", "engine/net/NetManager", "engine/system/System"], function (require, exports, Core_1, View_1, Explorer_1, Query_1, External_1, Hash_1, PanelManager_1, SceneManager_1, NetManager_1, System_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-08-31
     * @modify date 2017-09-01
     *
     * 测试项目
    */
    Core_1.core.listen("fuck", handler, "this");
    Core_1.core.dispatch("fuck");
    function handler(msg) {
        Core_1.core.unlisten("fuck", handler, this);
    }
    var Fuck = (function () {
        function Fuck() {
        }
        __decorate([
            Inject(Core_1.default)
        ], Fuck.prototype, "core", void 0);
        Fuck = __decorate([
            Model
        ], Fuck);
        return Fuck;
    }());
    var Fuck2 = (function () {
        function Fuck2() {
        }
        Fuck2.prototype.shit = function () {
            console.log(this.fuck);
        };
        Fuck2.prototype.testHandler = function () {
            console.log("测试Handler注入成功！");
        };
        __decorate([
            Inject(Fuck)
        ], Fuck2.prototype, "fuck", void 0);
        __decorate([
            Inject(Core_1.default)
        ], Fuck2.prototype, "core", void 0);
        __decorate([
            Inject(View_1.default)
        ], Fuck2.prototype, "view", void 0);
        __decorate([
            Inject(Explorer_1.default)
        ], Fuck2.prototype, "explorer", void 0);
        __decorate([
            Inject(Query_1.default)
        ], Fuck2.prototype, "query", void 0);
        __decorate([
            Inject(External_1.default)
        ], Fuck2.prototype, "external", void 0);
        __decorate([
            Inject(Hash_1.default)
        ], Fuck2.prototype, "hash", void 0);
        __decorate([
            Inject(PanelManager_1.default)
        ], Fuck2.prototype, "panelManager", void 0);
        __decorate([
            Inject(SceneManager_1.default)
        ], Fuck2.prototype, "sceneManager", void 0);
        __decorate([
            Inject(NetManager_1.default)
        ], Fuck2.prototype, "netManager", void 0);
        __decorate([
            Inject(System_1.default)
        ], Fuck2.prototype, "system", void 0);
        __decorate([
            Handler("fuck")
        ], Fuck2.prototype, "testHandler", null);
        Fuck2 = __decorate([
            Mediator
        ], Fuck2);
        return Fuck2;
    }());
    var fuck2 = new Fuck2();
    fuck2.shit();
    console.log(fuck2);
    window["fuck2"] = fuck2;
    window["Fuck2"] = Fuck2;
    Core_1.core.dispatch("fuck");
});
//# sourceMappingURL=main.js.map