// Name: Sprite Properties
// ID: enderSpriteProperties
// Description: No need for this sprite only variables.
// By: Ender-Studio
// Original: Ender-Studio
// License: MIT AND LGPL-3.0

(function(Scratch){
    "use strict";

    if (!Scratch.extensions.unsandboxed) throw new Error("Sprite Properties must run unsandboxed!");

    const createLabel = (text) => ({ blockType: Scratch.BlockType.LABEL, text: text });
    const Cast = Scratch.Cast;

    class enderSpriteProperties {
        constructor() {
            this._blueprints = {};
            this._importError = "None";

            Scratch.vm.runtime.enderSpriteProperties = {
                _blueprints: this._blueprints
            };
        }
        getInfo() {
            return {
                id: "enderSpriteProperties",
                name: "Sprite Properties",
                color1: "#A3C8E7",
                color2: "#7DA6C6",
                blocks: [
                    createLabel("Properties"),
                    { 
                        opcode: "setProperty",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set property [property] to [value]",
                        arguments: {
                            property: { type: Scratch.ArgumentType.STRING, defaultValue: "my property" },
                            value: { type: Scratch.ArgumentType.STRING, defaultValue: "0" }
                        }
                    },
                    { 
                        opcode: "changePropertyBy",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "change property [property] by [change]",
                        arguments: {
                            property: { type: Scratch.ArgumentType.STRING, defaultValue: "my property" },
                            change: { type: Scratch.ArgumentType.STRING, defaultValue: "1" }
                        }
                    },
                    "---",
                    {
                        opcode: "getProperty",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "get property [property]",
                        disableMonitor: true,
                        arguments: {
                            property: { type: Scratch.ArgumentType.STRING, defaultValue: "my property" }
                        }
                    },
                    {
                        opcode: "propertyExist",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "property [property] exist?",
                        arguments: {
                            property: { type: Scratch.ArgumentType.STRING, defaultValue: "my property" }
                        }
                    },
                    "---",
                    {
                        opcode: "deleteProperty",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "delete property [property]",
                        arguments: {
                            property: { type: Scratch.ArgumentType.STRING, defaultValue: "my property" }
                        }
                    },
                    {
                        opcode: "deleteAllProperties",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "delete all properties"
                    },
                    "---",
                    {
                        opcode: "listProperties",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "list all properties",
                        disableMonitor: true
                    },
                    createLabel("Blueprint"),
                    {
                        opcode: "loadBlueprint",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "load properties from blueprint [blueprint]",
                        arguments: {
                            blueprint: { type: Scratch.ArgumentType.STRING, menu: "blueprints" }
                        }
                    },
                    "---",
                    {
                        opcode: "createBlueprint",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "create a blueprint named [id]",
                        arguments: {
                            id: { type: Scratch.ArgumentType.STRING, defaultValue: "blueprint" }
                        }
                    },
                    {
                        opcode: "deleteBlueprint",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "delete blueprint [blueprint]",
                        arguments: {
                            blueprint: { type: Scratch.ArgumentType.STRING, menu: "blueprints" }
                        }
                    },
                    {
                        opcode: "deleteAllBlueprints",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "delete all blueprints"
                    },
                    "---",
                    {
                        opcode: "blueprintAddProperty",
                        text: "add property [property] with default value [value] to blueprint [blueprint]",
                        arguments: {
                            property: { type: Scratch.ArgumentType.STRING, defaultValue: "my property" },
                            value: { type: Scratch.ArgumentType.STRING, defaultValue: "0" },
                            blueprint: { type: Scratch.ArgumentType.STRING, menu: "blueprints" }
                        }
                    },
                    {
                        opcode: "blueprintRemoveProperty",
                        text: "remove property [property] from blueprint [blueprint]",
                        arguments: {
                            property: { type: Scratch.ArgumentType.STRING, defaultValue: "my property" },
                            blueprint: { type: Scratch.ArgumentType.STRING, menu: "blueprints" }
                        }
                    },
                    "---",
                    {
                        opcode: "blueprintGetProperty",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "get property [property] from blueprint [blueprint]",
                        arguments: {
                            property: { type: Scratch.ArgumentType.STRING, defaultValue: "my property" },
                            blueprint: { type: Scratch.ArgumentType.STRING, menu: "blueprints" }
                        }
                    },
                    {
                        opcode: "blueprintPropertyExist",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "property [property] exist in blueprint [blueprint]?",
                        arguments: {
                            property: { type: Scratch.ArgumentType.STRING, defaultValue: "my property" },
                            blueprint: { type: Scratch.ArgumentType.STRING, menu: "blueprints" }
                        }
                    },
                    "---",
                    {
                        opcode: "blueprintListProperties",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "list properties of blueprint [blueprint]",
                        arguments: {
                            blueprint: { type: Scratch.ArgumentType.STRING, menu: "blueprints" }
                        }
                    },
                    {
                        opcode: "listAllBlueprints",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "list all blueprints"
                    },
                    createLabel("Storage"),
                    {
                        opcode: "import",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "import [type] from [json] | [mode]",
                        arguments: {
                            mode: { type: Scratch.ArgumentType.STRING, menu: "importMode"},
                            type: { type: Scratch.ArgumentType.STRING, menu: "exportType" },
                            json: { type: Scratch.ArgumentType.STRING, defaultValue: "" }
                        }
                    },
                    {
                        opcode: "importError",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "import error"
                    },
                    "---",
                    {
                        opcode: "export",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "export [type] as JSON",
                        disableMonitor: true,
                        arguments: {
                            type: { type: Scratch.ArgumentType.STRING, menu: "exportType" }
                        }
                    },
                    
                ],
                menus: {
                    "importMode": { items: ["merge", "overwrite"] },
                    "exportType": { items: ["blueprints", "sprite properties"] },
                    "blueprints": { items: "_getBlueprints", acceptReporters: true }
                }
            }
        }
        // Properties
        setProperty(args, util) {
            const 
                target = util.target,
                property = Cast.toString(args.property);
            if (!target.enderProperties) { 
                target.enderProperties = {};
            }
            target.enderProperties[property] = args.value;
        }
        changePropertyBy(args, util) {
            const
                target = util.target,
                property = Cast.toString(args.property),
                value = Cast.toNumber((target.enderProperties ?? {})[property] ?? ""),
                change = Cast.toNumber(args.change);
            if (!target.enderProperties) { 
                target.enderProperties = {};
            }
            target.enderProperties[property] = value + change;  
        }

        getProperty(args, util) {
            const 
                target = util.target,
                property = Cast.toString(args.property);
            return (target.enderProperties ?? {})[property] ?? "";
        }
        propertyExist(args, util) {
            const 
                target = util.target,
                property = Cast.toString(args.property);
            return property in (target.enderProperties ?? {});
        }

        deleteProperty(args, util) {
            const
                target = util.target,
                property = Cast.toString(args.property);
            if (!target.enderProperties) { 
                target.enderProperties = {};
            }
            delete target.enderProperties[property];
        }
        deleteAllProperties(args, util) {
            util.target.enderProperties = {};
        }

        listProperties(args, util) {
            const target = util.target;
            return JSON.stringify(Object.keys(target.enderProperties ?? {}));
        }
        // Blueprint
        loadBlueprint(args, util) {
            const blueprint = this._blueprints[Cast.toString(args.blueprint)];
            if (!blueprint) return;
            util.target.enderProperties = blueprint;
        }

        createBlueprint(args) {
            const id = Cast.toString(args.id);
            this._blueprints[id] = {};
        }
        deleteBlueprint(args) {
            delete this._blueprints[Cast.toString(args.blueprint)];
        }
        deleteAllBlueprints() {
            this._blueprints = {};
        }

        blueprintAddProperty(args) {
            const
                id = Cast.toString(args.blueprint),
                property = Cast.toString(args.property);
            if (!this._blueprints[id]) return;
            this._blueprints[id][property] = args.value;
        }
        blueprintRemoveProperty(args) {
            const
                id = Cast.toString(args.blueprint),
                property = Cast.toString(args.property);
            if (!this._blueprints[id]) return;
            delete this._blueprints[id][property];
        }

        blueprintGetProperty(args) {
            const
                id = Cast.toString(args.blueprint),
                property = Cast.toString(args.property);
            if (!this._blueprints[id]) return "";
            return this._blueprints[id][property] ?? "";
        }
        blueprintPropertyExist(args) {
            const
                id = Cast.toString(args.blueprint),
                property = Cast.toString(args.property);
            return property in (this._blueprints[id]?? {});
        }

        blueprintListProperties(args) {
            const id = Cast.toString(args.blueprint);
            return JSON.stringify(Object.keys(this._blueprints[id] ?? {}));
        }
        listAllBlueprints() {
            return JSON.stringify(Object.keys(this._blueprints));
        }
        // Storage
        import(args, util) {
            let data = {}

            try { data = JSON.parse(args.json); } 
            catch { return this._importError = "Invalid JSON"; }

            if (typeof data !== "object" || data === null) return this._importError = "Invalid JSON"
            if (Array.isArray(data)) return this._importError = "Input can't be an Array"

            switch (args.type) {
                case "blueprints":
                    this._blueprints = args.mode === "merge" ? { ...this._blueprints, ...data } : data
                case "sprite properties":
                    const target = util.target;
                    if (!target.enderProperties) target.enderProperties = {};
                    target.enderProperties = args.mode === "merge" ? { ...target.enderProperties, ...data } : data;
            }
            this._importError = "None"
        }
        importError() {
            return this._importError;
        }

        export(args, util) {
            switch (args.type) {
                case "blueprints":
                    return JSON.stringify(this._blueprints);
                case "sprite properties":
                    return JSON.stringify(util.target.enderProperties ?? {});
            }
        }
        // Menus
        _getBlueprints() {
            const blueprints = Object.keys(this._blueprints);
            return blueprints.length > 0 ? blueprints : [""];
        }

    }
    Scratch.extensions.register(new enderSpriteProperties());
})(Scratch);
