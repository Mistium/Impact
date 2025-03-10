// Name : Render Me!
// ID : enderRenderSprite
// Description : render sprites at a different location.
// Version : 1.0
// Author : Ender-Studio
// License : MIT AND LGPL-3.0

(function(Scratch){

    const runtime = Scratch.vm.runtime;

    class enderRenderSprite {
        getInfo() {
            return {
                name: "Render Me!",
                id: "enderRenderSprite",
                blocks: [
                    {
                        opcode: "renderAtPos",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "render myself at x:[x] y:[y]",
                        arguments: {
                            x: { type: Scratch.ArgumentType.NUMBER },
                            y: { type: Scratch.ArgumentType.NUMBER }
                        }
                    }
                ]
            }
        }
        renderAtPos(args, util) {
            const target = util.target
            const renderer = target.renderer

            if (target.isStage) return;

            const x = Scratch.Cast.toNumber(args.x);
            const y = Scratch.Cast.toNumber(args.y);

            if (target.renderer) {
                const position = runtime.runtimeOptions.fencing ?
                    renderer.getFencedPositionOfDrawable(this.drawableID, [x, y]) :
                    [x, y];

                renderer.updateDrawablePosition(target.drawableID, position);
                if (target.visible) {
                    target.emitVisualChange();
                    runtime.requestRedraw();
                }
            }
        }
    }
    Scratch.extensions.register(new enderRenderSprite())
})(Scratch)
