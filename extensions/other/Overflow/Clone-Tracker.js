// Name: Clone Tracker
// ID: enderCloneTracker
// Description: Save time finding a way to track clone data. Compatible with Sprite-Properties.
// By: Ender-Studio
// Original: Ender-Studio
// License: MIT & LGPL-3.0

(function(Scratch){
    "use strict"
    const runtime = Scratch.vm.runtime
    class enderCloneTracker {
        constructor() {
            this.loadedSpriteProperties = Scratch.vm.extensionManager.isExtensionLoaded("enderSpriteProperties");
            Scratch.vm.runtime.on("EXTENSION_ADDED", (info) => { if (info.id === "enderSpriteProperties") { 
                this.loadedSpriteProperties = true; Scratch.vm.extensionManager.refreshBlocks(); 
            }})
        }
        getInfo() {
            return {
                id: "enderCloneTracker",
                name: "Clone Tracker",
                color1: "#FFA64D",
                color2: "#CC7933",
                blocks: [
                    {
                        opcode: "cloneCount",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "clone count",
                    },
                    {
                        opcode: "cloneCountOf",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "clone count of [sprite]",
                        disableMonitor: true,
                        arguments: {
                            sprite: { type: Scratch.ArgumentType.STRING, menu: "sprites" }
                        }
                    },
                    "---",
                    {
                        opcode: "cloneID",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "clone id",
                        disableMonitor: true,
                    },
                    "---",
                    {
                        opcode: "cloneAttribute",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "[attribute] of clone # [id] of [sprite]",
                        disableMonitor: true,
                        arguments: {
                            attribute: { type: Scratch.ArgumentType.STRING, menu: "targetAttribute" },
                            id: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            sprite: { type: Scratch.ArgumentType.STRING, menu: "sprites" }
                        }
                    },
                    {
                        opcode: "cloneProperty",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "[property] of clone # [id] of [sprite]",
                        disableMonitor: true,
                        hideFromPalette: !this.loadedSpriteProperties,
                        arguments: {
                            property: { type: Scratch.ArgumentType.STRING, defaultValue: "my property" },
                            id: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            sprite: { type: Scratch.ArgumentType.STRING, menu: "sprites" }
                        }
                    }
                ],
                menus: {
                    sprites: { items: "_getSprites", acceptReporters: true },
                    targetAttribute: { items: [ "x position","y position","direction","costume #","costume name", "size", "volume" ] }
                }
            }
        }
        cloneCount() {
            return runtime._cloneCounter
        }
        cloneCountOf(args) {
            console.log(runtime)
            const target = runtime.getSpriteTargetByName(args.sprite);
            if (target) {
                return target.sprite.clones.length - 1;
            }
            return 0;
        }

        cloneID(args, util) {
            console.log(util.target)
            const 
                target = util.target,
                clones = target.sprite.clones.map((currentTarget) => currentTarget.id)
            return clones.indexOf(target.id)
        }

        cloneAttribute(args) {
            const
                target = runtime.getSpriteTargetByName(args.sprite),
                clone = target.sprite.clones[Scratch.Cast.toNumber(args.id)]
            if (target && clone) {
                switch (args.attribute) {
                    case "x position": 
                        return clone.x;
                    case "y position": 
                        return clone.y;
                    case "direction": 
                        return clone.direction;
                    case "costume #": 
                        return clone.currentCostume + 1;
                    case "costume name": 
                        return clone.getCostumes()[clone.currentCostume].name;
                    case "size": 
                        return clone.size;
                    case "volume": 
                        return clone.volume;
                }
            }
            return 0;
        }
        cloneProperty(args) {
            const
                target = runtime.getSpriteTargetByName(args.sprite),
                clone = target.sprite.clones[Scratch.Cast.toNumber(args.id)],
                property = Scratch.Cast.toString(args.property);
            return (clone.enderProperties ?? {})[property] ?? "";
        }
        // Menu
        _getSprites() {
            const 
                sprites = [], 
                target = runtime.getEditingTarget().getName();
            for (let i = 1; i < runtime.targets.length; i++) {
                const currentTarget = runtime.targets[i];
                if (currentTarget.isOriginal) {
                    const targetName = currentTarget.getName();
                    sprites.push({ text: targetName === target ? "myself" : targetName, value: targetName });
                }
            }
            return sprites.length > 0 ? sprites : undefined;
        }
    }
    Scratch.extensions.register(new enderCloneTracker());
})(Scratch)
