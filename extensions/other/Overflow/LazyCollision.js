// Name : Lazy Collision
// ID : enderSimpleCollision
// Description : collision made easier
// Version : 1.0
// Author : Ender-Studio
// License : MIT & LGPL-3.0

(function(Scratch){
    "use strict"

    if (!Scratch.extensions.unsandboxed) throw new Error("Simple Collision must run unsandboxed");

    const runtime = Scratch.vm.runtime

    const createLabel = (text, filter) => ({ filter: [filter], blockType: Scratch.BlockType.LABEL, text: text });
    const parse = array => { if (Array.isArray(array)) return array; try { const parsed = JSON.parse(array); return Array.isArray(parsed) ? Array.from(new Set(parsed)) : []; } catch { return []; } };

    let spriteGroups = {};
    let inputMode = 0;
    
    class enderSimpleCollision {
        getInfo() {
            return {
                id: "enderSimpleCollision",
                name: "Lazy Collision",
                color1: "#4c97ff",
                color2: "#4280d7",
                color3: "#3373cc",
                blocks: [
                    createLabel("Sprite Groups"),
                    {
                        opcode: "groupAdd",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "add [sprite] to [group]",
                        arguments: {
                            sprite: { type: Scratch.ArgumentType.STRING, menu: "targets" },
                            group: { type: Scratch.ArgumentType.STRING, defaultValue: "group"}
                        },
                        hideFromPalette: inputMode === 1
                    },
                    {
                        opcode: "groupRemove",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "remove [sprite] to [group]",
                        arguments: {
                            sprite: { type: Scratch.ArgumentType.STRING, menu: "targets" },
                            group: { type: Scratch.ArgumentType.STRING, defaultValue: "group"}
                        },
                        hideFromPalette: inputMode === 1
                    },
                    {
                        opcode: "groupAddMultiple",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "add [sprites] to [group]",
                        arguments: {
                            sprites: { type: Scratch.ArgumentType.STRING, defaultValue: "[\"Sprte1\", \"Sprite2\"]" },
                            group: { type: Scratch.ArgumentType.STRING, defaultValue: "group"}
                        },
                        hideFromPalette: inputMode !== 1
                    },
                    {
                        opcode: "groupRemoveMultiple",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "remove [sprites] to [group]",
                        arguments: {
                            sprites: { type: Scratch.ArgumentType.STRING, defaultValue: "[\"Sprte1\", \"Sprite2\"]" },
                            group: { type: Scratch.ArgumentType.STRING, defaultValue: "group"}
                        },
                        hideFromPalette: inputMode !== 1
                    },
                    {
                        opcode: "groupGet",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "sprites in [group]",
                        arguments: {
                            group: { type: Scratch.ArgumentType.STRING, defaultValue: "group"}
                        }
                    },
                    "---",
                    {
                        opcode: "groupList",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "list all groups"
                    },
                    "---",
                    {
                        opcode: "groupsSave",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "export groups",
                        disableMonitor: true
                    },
                    {
                        opcode: "groupsLoad",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "load groups from [input]",
                        arguments: {
                            input: { type: Scratch.ArgumentType.STRING, defaultValue: "{}" }
                        }
                    },
                    createLabel("Hitbox", Scratch.TargetType.SPRITE),
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "hitboxSet",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set hitbox to [costume]",
                        arguments: {
                            costume: { type: Scratch.ArgumentType.STRING, menu: "costumes" }
                        }
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "hitboxReset",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "reset hitbox"
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "hitboxGet",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "hitbox"
                    },
                    createLabel("Sensing", Scratch.TargetType.SPRITE),
                    { 
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "isTouching",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "is touching [target] ?",
                        arguments: {
                            target: { type: Scratch.ArgumentType.STRING, menu: "targets" }
                        },
                        hideFromPalette: inputMode !== 0
                    },
                    { 
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "_isTouching",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "is touching [targets] ?",
                        arguments: {
                            targets: { type: Scratch.ArgumentType.STRING, defaultValue: "[\"Sprte1\", \"Sprite2\"]" }
                        },
                        hideFromPalette: inputMode !== 1
                    },
                    { 
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "isTouchingGroup",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "is touching [group] ?",
                        arguments: {
                            group: { type: Scratch.ArgumentType.STRING, defaultValue: "group" }
                        },
                        hideFromPalette: inputMode !== 2
                    },
                    { 
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "isSafeSpot",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "is x: [x] y: [y] safe from touching [target] ?",
                        arguments: {
                            x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            target: { type: Scratch.ArgumentType.STRING, menu: "targets" }
                        },
                        hideFromPalette: inputMode !== 0
                    },
                    { 
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "_isSafeSpot",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "is x: [x] y: [y] safe from touching [targets] ?",
                        arguments: {
                            x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            targets: { type: Scratch.ArgumentType.STRING, defaultValue: "[\"Sprte1\", \"Sprite2\"]" }
                        },
                        hideFromPalette: inputMode !== 1
                    },
                    { 
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "isSafeSpotGroup",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "is x: [x] y: [y] safe from touching [group] ?",
                        arguments: {
                            x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            group: { type: Scratch.ArgumentType.STRING, defaultValue: "group" }
                        },
                        hideFromPalette: inputMode !== 2
                    },
                    createLabel("Motion", Scratch.TargetType.SPRITE),
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "moveAngle",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "move [steps] steps towards [angle] degree if not touching [target]",
                        arguments: {
                            steps: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            angle: { type: Scratch.ArgumentType.ANGLE, defaultValue: 90 },
                            target: { type: Scratch.ArgumentType.STRING, menu: "targets" }
                        },
                        hideFromPalette: inputMode !== 0
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "moveDir",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "move [steps] steps [direction] if not touching [target]",
                        arguments: {
                            steps: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            direction: { type: Scratch.ArgumentType.NUMBER, menu: "dir" },
                            target: { type: Scratch.ArgumentType.STRING, menu: "targets" }
                        },
                        hideFromPalette: inputMode !== 0
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "changeXYBy",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "change by x: [x] y: [y] if not touching [target]",
                        arguments: {
                            x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            target: { type: Scratch.ArgumentType.STRING, menu: "targets" }
                        },
                        hideFromPalette: inputMode !== 0
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "changeXBy",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "change x by [x] if not touching [target]",
                        arguments: {
                            x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            target: { type: Scratch.ArgumentType.STRING, menu: "targets" }
                        },
                        hideFromPalette: inputMode !== 0
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "changeYBy",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "change y by [y] if not touching [target]",
                        arguments: {
                            y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            target: { type: Scratch.ArgumentType.STRING, menu: "targets" }
                        },
                        hideFromPalette: inputMode !== 0
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "turn",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "turn [turn] [degree] degrees if not touching [target]",
                        arguments: {
                            turn: { type: Scratch.ArgumentType.STRING, menu: "turn" },
                            degree: { type: Scratch.ArgumentType.NUMBER, defaultValue: 15 },
                            target: { type: Scratch.ArgumentType.STRING, menu: "targets" }
                        },
                        hideFromPalette: inputMode !== 0
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "_moveAngle",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "move [steps] steps towards [angle] degree if not touching [targets]",
                        arguments: {
                            steps: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            angle: { type: Scratch.ArgumentType.ANGLE, defaultValue: 90 },
                            targets: { type: Scratch.ArgumentType.STRING, defaultValue: "[\"Sprte1\", \"Sprite2\"]" }
                        },
                        hideFromPalette: inputMode !== 1
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "_moveDir",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "move [steps] steps [direction] if not touching [targets]",
                        arguments: {
                            steps: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            direction: { type: Scratch.ArgumentType.NUMBER, menu: "dir" },
                            targets: { type: Scratch.ArgumentType.STRING, defaultValue: "[\"Sprte1\", \"Sprite2\"]" }
                        },
                        hideFromPalette: inputMode !== 1
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "_changeXYBy",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "change by x: [x] y: [y] if not touching [targets]",
                        arguments: {
                            x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            targets: { type: Scratch.ArgumentType.STRING, defaultValue: "[\"Sprte1\", \"Sprite2\"]" }
                        },
                        hideFromPalette: inputMode !== 1
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "_changeXBy",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "change x by [x] if not touching [targets]",
                        arguments: {
                            x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            targets: { type: Scratch.ArgumentType.STRING, defaultValue: "[\"Sprte1\", \"Sprite2\"]" }
                        },
                        hideFromPalette: inputMode !== 1
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "_changeYBy",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "change y by [y] if not touching [targets]",
                        arguments: {
                            y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            targets: { type: Scratch.ArgumentType.STRING, defaultValue: "[\"Sprte1\", \"Sprite2\"]" }
                        },
                        hideFromPalette: inputMode !== 1
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "_turn",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "turn [turn] [degree] degrees if not touching [targets]",
                        arguments: {
                            turn: { type: Scratch.ArgumentType.STRING, menu: "turn" },
                            degree: { type: Scratch.ArgumentType.NUMBER, defaultValue: 15 },
                            targets: { type: Scratch.ArgumentType.STRING, defaultValue: "[\"Sprte1\", \"Sprite2\"]" }
                        },
                        hideFromPalette: inputMode !== 1
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "moveAngleGroup",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "move [steps] steps towards [angle] degree if not touching [group]",
                        arguments: {
                            steps: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            angle: { type: Scratch.ArgumentType.ANGLE, defaultValue: 90 },
                            group: { type: Scratch.ArgumentType.STRING, defaultValue: "group" }
                        },
                        hideFromPalette: inputMode !== 2
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "moveDirGroup",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "move [steps] steps [direction] if not touching [group]",
                        arguments: {
                            steps: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            direction: { type: Scratch.ArgumentType.NUMBER, menu: "dir" },
                            group: { type: Scratch.ArgumentType.STRING, defaultValue: "group" }
                        },
                        hideFromPalette: inputMode !== 2
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "changeXYByGroup",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "change by x: [x] y: [y] if not touching [group]",
                        arguments: {
                            x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            group: { type: Scratch.ArgumentType.STRING, defaultValue: "group" }
                        },
                        hideFromPalette: inputMode !== 2
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "changeXByGroup",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "change x by [x] if not touching [group]",
                        arguments: {
                            x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            group: { type: Scratch.ArgumentType.STRING, defaultValue: "group" }
                        },
                        hideFromPalette: inputMode !== 2
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "changeYByGroup",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "change y by [y] if not touching [group]",
                        arguments: {
                            y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
                            group: { type: Scratch.ArgumentType.STRING, defaultValue: "group" }
                        },
                        hideFromPalette: inputMode !== 2
                    },
                    {
                        filter: [Scratch.TargetType.SPRITE],
                        opcode: "turnGroup",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "turn [turn] [degree] degrees if not touching [group]",
                        arguments: {
                            turn: { type: Scratch.ArgumentType.STRING, menu: "turn" },
                            degree: { type: Scratch.ArgumentType.NUMBER, defaultValue: 15 },
                            group: { type: Scratch.ArgumentType.STRING, defaultValue: "group" }
                        },
                        hideFromPalette: inputMode !== 2
                    },
                    { func: "inputMode", blockType: Scratch.BlockType.BUTTON, text: `Input : ${["Sprite", "Array", "Group"][inputMode]}` }
                ],
                menus: {
                    targets: { acceptReporters: true, items: "_getTargets" },
                    costumes: { acceptReporters: true, items: "_getCostumes" },
                    dir: { items: ["forward", "backward", "left", "right"] },
                    turn: { items: ["↻", "↺"] }
                }
            }
        }
        inputMode() { inputMode += 1; if (inputMode === 3) inputMode = 0; Scratch.vm.extensionManager.refreshBlocks(); }
        // Sprite Groups
        groupAdd(args) {
            if (!spriteGroups[args.group]) spriteGroups[args.group] = []
            if (!spriteGroups[args.group].includes(args.sprite)) spriteGroups[args.group].push(args.sprite)
        }
        groupAddMultiple(args) { parse(args.sprites).forEach(sprite => this.groupAdd({ sprite: sprite, group: args.group })) }
        groupRemove(args) { 
            if (!spriteGroups[args.group]) return; 
            spriteGroups[args.group] = spriteGroups[args.group].filter(sprite => sprite !== args.sprite); 
            if (spriteGroups[args.group] == []) delete spriteGroups[args.group]
        }
        groupRemoveMultiple(args) { parse(args.sprites).forEach(sprite => this.groupRemove({ sprite: sprite, group: args.group })) }
        groupGet(args, util) { return JSON.stringify(spriteGroups[args.group] ?? []) }
        groupList() { return JSON.stringify(Object.keys(spriteGroups)); }
        groupsReset() { spriteGroups = {}; }
        
        groupsSave() { return JSON.stringify(spriteGroups); }
        groupsLoad(args) { 
            try { 
                const result = JSON.parse(args.input); 
                if (typeof result !== "object" || result === null || Array.isArray(result)) return console.log("Simple Collision: Invalid Input!");
                if (Object.values(result).every(value => Array.isArray(value))) return spriteGroups = result;
                console.log("Simple Collision: Invalid Input!");
            } catch { return console.log("Simple Collision: Invalid Input!"); }
        }
        // Hitbox
        hitboxSet(args, util) { util.target.hitbox = args.costume }
        hitboxReset(args, util) { util.target.hitbox = undefined }
        hitboxGet(args, util) { return util.target.hitbox ?? "" }
        // Motion
        _isTouching(args, util) {
            return parse(args.targets).some(target => util.target.isTouchingObject(target))
        }
        isTouching(args, util) {
            return this._isTouching({ targets: [args.target] }, util)
        }
        isTouchingGroup(args, util) {
            return this._isTouching({ targets: spriteGroups[args.group] }, util)
        }
        _isSafeSpot(args, util) {
            const self = util.target,
                  targets = parse(args.targets),
                  x = self.x,
                  y = self.y,
                  tx = args.x,
                  ty = args.y,
                  defStyle = self.rotationStyle,
                  defCostume = self.currentCostume;
            if (self.hitbox !== undefined) { self.setRotationStyle("don't rotate"); self.setCostume(self.getCostumeIndexByName(self.hitbox)) };
            self.setXY(tx, ty)
            const result = targets.some(target => self.isTouchingObject(target))
            self.setXY(x, y)
            if (self.hitbox !== undefined) { self.setRotationStyle(defStyle); self.setCostume(defCostume) }
            return !result
        }
        isSafeSpot(args, util) {
            return this._isSafeSpot({ targets: [args.target], x: args.x, y: args.y }, util)
        }
        isSafeSpotGroup(args, util) {
            return this._isSafeSpot({ targets: args.targets, x: args.x, y: args.y }, util)
        }
        _changeXBy(args, util) {
            const self = util.target, targets = parse(args.targets),
                  tx = Scratch.Cast.toNumber(args.x),
                  intTX = Math.abs(Math.trunc(tx)),
                  sign = Math.sign(tx),
                  defStyle = self.rotationStyle,
                  defCostume = self.currentCostume;
            if (tx === 0 || intTX === 0) return;
            if (self.hitbox !== undefined) { self.setRotationStyle("don't rotate"); self.setCostume(self.getCostumeIndexByName(self.hitbox)) };
            for (let i = 0; i < intTX; i++) {
                self.setXY(self.x + (1 * sign), self.y);
                if (targets.some(target => self.isTouchingObject(target))) { self.setXY(self.x - (1 * sign), self.y); break; };
            };
            if (self.hitbox !== undefined) { self.setRotationStyle(defStyle); self.setCostume(defCostume) };
            self.setXY(self.x + (tx % intTX), self.y);
            if (targets.some(target => self.isTouchingObject(target))) { self.setXY(self.x - (tx % intTX), self.y) }
        }
        _changeYBy(args, util) {
            const self = util.target, targets = parse(args.targets),
                  ty = Scratch.Cast.toNumber(args.y),
                  intTY = Math.abs(Math.trunc(ty)),
                  sign = Math.sign(ty),
                  defStyle = self.rotationStyle,
                  defCostume = self.currentCostume;
            if (ty === 0 || intTY === 0) return;
            if (self.hitbox !== undefined) { self.setRotationStyle("don't rotate"); self.setCostume(self.getCostumeIndexByName(self.hitbox)) };
            for (let i = 0; i < intTY; i++) {
                self.setXY(self.x, self.y + (1 * sign));
                if (targets.some(target => self.isTouchingObject(target))) { self.setXY(self.x, self.y - (1 * sign)); break };
            };
            if (self.hitbox !== undefined) { self.setRotationStyle(defStyle); self.setCostume(defCostume) };
            self.setXY(self.x, self.y + (ty % intTY));
            if (targets.some(target => self.isTouchingObject(target))) { self.setXY(self.x, self.y - (ty % intTY)) }
        }
        _changeXYBy(args, util) { this._changeXBy({ x: args.x, targets: args.targets }, util); this._changeYBy({ y: args.y, targets: args.targets }, util); }
        _moveAngle(args, util) {
            const _dir = util.target.direction, angle = Scratch.Cast.toNumber(args.angle);
            util.target.setDirection(angle);
            const steps = Scratch.Cast.toNumber(args.steps),
                  sin = Math.sin((Math.PI / 180) * angle) * steps,
                  cos = Math.cos((Math.PI / 180) * angle) * steps;
            this._changeXYBy({ x: sin, y: cos, targets: args.targets }, util);
            util.target.setDirection(_dir);
        }
        _moveDir(args, util) {
            const mode = args.direction;
            let dir = util.target.direction;
            if (mode.includes("right")) dir += 90;
            if (mode.includes("left")) dir -= 90;
            if (mode.includes("back")) dir += 180;
            this._moveAngle({ angle: dir, steps: args.steps, targets: args.targets }, util)
        }
        _turn(args, util) {
            const self = util.target, targets = parse(args.targets), dir = self.direction;
            self.setDirection(dir + (args.degree * (args.turn === "↻" ? 1 : -1)));
            if (targets.some(target => self.isTouchingObject(target))) self.setDirection(dir);
        }
        changeXBy(args, util) { this._changeXBy({ x: args.x, targets: [args.target] }, util); }
        changeYBy(args, util) { this._changeYBy({ y: args.y, targets: [args.target] }, util); }
        turn(args, util) { this._turn({ targets: [args.target], degree: args.degree, turn: args.turn }, util) }
        changeXYBy(args, util) { this._changeXYBy({ x: args.x, y: args.y, targets: [args.target] }, util); }
        moveAngle(args, util) { this._moveAngle({ angle: args.angle, targets: [args.target], steps: args.steps }, util); }
        moveDir(args, util) { this._moveDir({ direction: args.direction, targets: [args.target], steps: args.steps }, util); }
        // Groups
        changeXByGroup(args, util) { this._changeXBy({ x: args.x, targets: spriteGroups[args.group] }, util); }
        changeYByGroup(args, util) { this._changeYBy({ y: args.y, targets: spriteGroups[args.group] }, util); }
        turnGroup(args, util) { this._turn({ targets: [args.target], degree: args.degree, turn: args.turn }, util) }
        changeXYByGroup(args, util) { this._changeXYBy({ x: args.x, y: args.y, targets: spriteGroups[args.group]}, util); }
        moveAngleGroup(args, util) { this._moveAngle({ angle: args.angle, targets: spriteGroups[args.group], steps: args.steps }, util); }
        moveDirGroup(args, util) { this._moveDir({ direction: args.direction, targets: spriteGroups[args.group], steps: args.steps }, util); }

        // Menus
        _getTargets() {
            const sprites = [], targets = runtime.targets, self = runtime.getEditingTarget().getName();
            for (let i = 1; i < targets.length; i++) {
                const target = targets[i];
                if (target.isOriginal) {
                    const targetName = target.getName();
                    if (targetName === self) {
                        sprites.unshift({ text: "myself", value: targetName }); }
                    else { sprites.push({ text: targetName, value: targetName }); }
                }
            }
            if (sprites.length > 0) { return sprites; }
        }
        _getCostumes() { return runtime.getEditingTarget().getCostumes().map(costume => costume.name) }
    }
    Scratch.extensions.register(new enderSimpleCollision())
})(Scratch)
