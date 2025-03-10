/*
   This extension was made with TurboBuilder!
   https://turbobuilder-steel.vercel.app/
*/
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "blockIconURI": "data:image/png;base64,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",
                "id": "MORUTILS",
                "name": "Moron Utils Beta v1.4",
                "color1": "#666666",
                "color2": "#0062ff",
                "tbShow": true,
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: "ALERT",
        blockType: Scratch.BlockType.COMMAND,
        text: "Alert [ALERT]",
        arguments: {
            "ALERT": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'IM NOT A MORNON!',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["ALERT"] = async (args, util) => {
        if (Boolean(!(args["ALERT"] == 0))) {
            alert(args["ALERT"]);

        } else {
            alert("Null");
            console.error('Empty input!');

        };
    };

    blocks.push({
        opcode: "PROMPT",
        blockType: Scratch.BlockType.COMMAND,
        text: "Prompt [PROMP]",
        arguments: {
            "PROMP": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'is your name GLaDOS?',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["PROMPT"] = async (args, util) => {
        if (Boolean(!(args["PROMP"] == 0))) {
            variables["RE"] = prompt(args["PROMP"]);

        } else {
            variables["RE"] = prompt("Null");
            console.error('Empty input!');

        };
    };

    blocks.push({
        opcode: "RESPONCE",
        blockType: Scratch.BlockType.REPORTER,
        text: "Response",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["RESPONCE"] = async (args, util) => {
        return variables['RE']
    };

    menus["REDER"] = {
        acceptReporters: false,
        items: [...[...[], 'Rederect'], 'New tab']
    }

    blocks.push({
        opcode: "REDER",
        blockType: Scratch.BlockType.COMMAND,
        text: "[REDER] [INPUT]",
        arguments: {
            "INPUT": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://www.thinkwithportals.com',
            },
            "REDER": {
                type: Scratch.ArgumentType.STRING,
                menu: 'REDER'
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["REDER"] = async (args, util) => {
        if (Boolean((args["REDER"] == 'New tab'))) {
            window.open(args["INPUT"], "_blank");;
        };
        if (Boolean((args["REDER"] == 'Rederect'))) {
            location.replace(args["INPUT"]);
        };
    };

    blocks.push({
        opcode: "RTB",
        blockType: Scratch.BlockType.REPORTER,
        text: "[BOOT]",
        arguments: {
            "BOOT": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["RTB"] = async (args, util) => {
        return args["BOOT"]
    };

    blocks.push({
        opcode: "BTR",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[REE]",
        arguments: {
            "REE": {
                type: Scratch.ArgumentType.empty,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["BTR"] = async (args, util) => {
        return args["REE"]
    };

    blocks.push({
        opcode: "STORE",
        blockType: Scratch.BlockType.COMMAND,
        text: "Store [IN] To [LOCAL]",
        arguments: {
            "IN": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Lemons',
            },
            "LOCAL": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Cave Johnson',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["STORE"] = async (args, util) => {
        localStorage.setItem(args["LOCAL"], args["IN"])
    };

    blocks.push({
        opcode: "GETLOC",
        blockType: Scratch.BlockType.REPORTER,
        text: "Get [LOC]",
        arguments: {
            "LOC": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Cave Johnson',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["GETLOC"] = async (args, util) => {
        return localStorage.getItem(args["LOC"])
    };

    blocks.push({
        opcode: "DELLOC",
        blockType: Scratch.BlockType.COMMAND,
        text: "Delete Local [LOCA]",
        arguments: {
            "LOCA": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Cave Johnson',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["DELLOC"] = async (args, util) => {
        localStorage.removeItem(args["LOCA"]);
    };

    blocks.push({
        opcode: "SOUNDPLAY!",
        blockType: Scratch.BlockType.COMMAND,
        text: "Play sound link [LINK]",
        arguments: {
            "LINK": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://acesavagejr.github.io/Entitys-site/i-am-not-a-moron.mp3',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["SOUNDPLAY!"] = async (args, util) => {
        let mySound = new Audio(args["LINK"]);
        mySound.play();
    };

    blocks.push({
        opcode: "LOGCON",
        blockType: Scratch.BlockType.COMMAND,
        text: "Log [LOG]",
        arguments: {
            "LOG": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'I\'m just a potato',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["LOGCON"] = async (args, util) => {
        console.log(args["LOG"]);
    };

    blocks.push({
        opcode: "ERRORLOG",
        blockType: Scratch.BlockType.COMMAND,
        text: "Error [LOG]",
        arguments: {
            "LOG": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'STILL ALIVE',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["ERRORLOG"] = async (args, util) => {
        console.error(args["LOG"]);
    };

    blocks.push({
        opcode: "WARNLOG",
        blockType: Scratch.BlockType.COMMAND,
        text: "Warn [LOG]",
        arguments: {
            "LOG": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Placeholder',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["WARNLOG"] = async (args, util) => {
        console.warn(args["LOG"]);
    };

    Scratch.extensions.register(new Extension());
})(Scratch);