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
                "blockIconURI": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArcAAAMJCAYAAAAZKh7GAAAAAXNSR0IArs4c6QAAIABJREFUeF7snQd4XMW1x/+j3q3mIlnuvXeDAVNNCXlJSEKSR9pLeQRCb6H33gmEEtJeek8eLyGhVwM2GPfeq2zLlq3eV5qnMztrhLGtXWt3b9n/fN/9drWae+fMb66kv849c44CGwmQAAmQAAmQAAmQAAn4hIDyyTw4DRIgARIgARIgARIgARIAxS1vAhIgARIgARIgARIgAd8QoLj1zVJyIiRAAiRAAiRAAiRAAhS3vAdIgARIgARIgARIgAR8Q4Di1jdLyYmQAAmQAAmQAAmQAAlQ3PIeIAESIAESIAESIAES8A0BilvfLCUnQgIkQAIkQAIkQAIkQHHLe4AESIAESIAESIAESMA3BChufbOUnAgJkAAJkAAJkAAJkADFLe8BEiABEiABEiABEiAB3xCguPXNUnIiJEACJEACJEACJEACFLe8B0iABEiABEiABEiABHxDgOLWN0vJiZAACZAACZAACZAACVDc8h4gARIgARIgARIgARLwDQGKW98sJSdCAiRAAiRAAiRAAiRAcct7gARIgARIgARIgARIwDcEKG59s5ScCAmQAAmQAAmQAAmQAMUt7wESIAESIAESIAESIAHfEKC49c1SciIkQAIkQAIkQAIkQAIUt7wHSIAESIAESIAESIAEfEOA4tY3S8mJkAAJkAAJkAAJkAAJUNzyHiABEiABEiABEiABEvANAYpb3ywlJ0ICJEACJEACJEACJEBxy3uABEiABEiABEiABEjANwQobn2zlJwICZAACZAACZAACZAAxS3vARIgARIgARIgARIgAd8QoLj1zVJyIiRAAiRAAiRAAiRAAhS3vAdIgARIgARIgARIgAR8Q4Di1jdLyYmQAAmQAAmQAAmQAAlQ3PIeIAESIAESIAESIAES8A0BilvfLCUnQgIkQAIkEG8CWmv5OypH0lEe0TC5A4AGIK8Hvz/U1137tSul5Fw2EvANAYpb3ywlJ0ICJEACJHA0BLTWIkxTAWTYIx1AZpf3XT+XfmkAUuyrvJdDzunaT96HPpPX0BHqI69yXvLR2NzlHBGqrfZoOcKrfO9QR7P9PACgzR5yPenbCKABQL19rZNXpZT0YyMB1xKguHXt0tAwEiABEiCBnhDQWosAzeoiOuW9iFY55H12lyPHvg+95gKQ9wd/frAAFrHr9RYSyCJ0Q4eI2moAVV2OfQD2289rAcjXFQD2KKXkazYScAUBiltXLAONIAESIAESOBwBK1JDntCuXtCu3tCDPaPiFRUB26uLSJX3IlrlNXQU2M/8IFLjcROJEBZP7h4AOwBsArARwDYAuwDstke1Uqo9HgZxDBI4mADFLe8JEiABEiCBuBLQWsuj+NCj/INfRaSKKBURGvKehr6W164e167vQx5W8cbKe/keBWv8VrYGwHp7bACwBcDOLoJ3P8MZ4rcYiT4SxW2i3wGcPwmQAAn0kECXx/95VpCKwAx5Ug8lYsULGwoRCAnWrq/iVe0NoBiAeFblWmzeIiDe3c1dBK94eMXTK8d2pZSEO7CRQEwIUNzGBCsvSgIkQALeJGCFamgzVej14I1SIcEa2jAlwjTfilERpPI+5D09lIilR9Wbt0dPrJbNaeLNXQlgOYC1InJtOEOFUko2tLGRQFQIUNxGBSMvQgIkQALuImAf/R/sPZWvuwrTruJV3odCAsQDG9pMdfDGKvHKhsIBQq8iftlIIFwCEre7F8AKAMus4BUvr4nbVUrJZjY2EjhqAhS3R42OJ5IACZBA/AhYj6oIy667/UPvQ68h8SoCVgRnSIge/Ohf+ot4DQnXrgKWXtX4LStHChKQTAviyRWhK4J3tQ1nKFdKSUoyNhKIiADFbUS42JkESIAEek7AelUPlRP1ULlSQ8JVhKo87hev6qGO0IaqUBgARWrPl4pXiD+BJits5wNYaEWvbFDbzewL8V8Mr45IcevVlaPdJEACriPQRbSG8qce/Pi+qye1aw7Vrjv8D971H0pfxU1VrltxGhRjApKBQTy5InQXAVhnU49VsapajMl7/PIUtx5fQJpPAiQQWwJaa/GAhsTqoTZadf1M+skjfvGwHu4QsSpeW/7+je3S8er+ISAxupJXVzy5HwBYYkMXtiqlpJoaGwl8jAB/ufKGIAESSFgCXYTrwflSu1alkhAASUcVCgk4OE41lI9V+onQZSMBEogdASn9K1kX5gJ4F8BSCWNghbTYAffilSluvbhqtJkESOCIBKxo7brbPxQO0HUDVmjDlQjXkIAttEK266sIXzYSIAH3EagEMA/AWzZsYZVSSsoBsyU4AYrbBL8BOH0S8CIBmzlAxGsoZVXIexp6lUf/IlCL7CECVj4LFRkIncdNV168AWgzCXycgKQOk9jc16zYlVy6UiiCuXMT9E6huE3Qhee0ScDNBOzGrFD86sHCVYRpSLxKwQARsKHX0HsRvmwkQAKJRUBCFqQS2hsA3rExupuZTiyxbgKZLcVt4q05Z0wCjhPQWsvvHgkLEOEa8qZ2fd9VvIpwDR0iXqUsq/RlIwESIIHDEdhpPbmvA/gQwEallKQZY0sAAhS3CbDInCIJOEVAay3pq0LxqweHBUioQFfhKu9FuMqr9E1xym6OSwIk4BsCEoP7phW6C+zmM1ZA883yHnoiFLc+X2BOjwRiTcCGEMimK/HASkYBEa2h7AIiVPsDKAHQ1wpXEbAieFmyNdaLw+uTAAmECMjmM8mw8CoAEblrmWHBvzcHxa1/15YzI4GoEdBaSznXUKzrwaEE4mUNhQv0s0K2FIC8Z/hA1FaBFyIBEogCgSq76ewlK3ZXK6Wao3BdXsJFBChuXbQYNIUEnCTQJQ5WxGrI8xoqRCDiVcRqny6hA6GQAunDEAInF49jkwAJREpgv00h9r9285kUhJBiEWw+IEBx64NF5BRIIFICNpRAMgocnGlAxGvI+yqhBPJeDhGwyZGOw/4kQAIk4GICIma3AXjeHguVUhK+wOZxAhS3Hl9Amk8C3RGwIQWh0IFQ3leJexXxOsAeA21srPTj74XuoPL7JEACfiLQYvPk/h3AywCkGESjnyaYaHPhH7FEW3HO15cEDpFaK7S5K5SBQDZ1lXURs+KNlTyybCRAAiRAAkECNbak799sPK7kyGUhCA/eHRS3Hlw0mpy4BLTWSQAkM4F4YCUuNpRmS8SsvA/FwUp4QcgzK58xJjZxbxvOnARIIDIC5QD+DeAfAD5QSu2J7HT2dpoAxa3TK8DxSeAQBLqEEohoDR0S9yoCVlJqiRdWvLGSlUAOEbuZhEkCJEACJBAVAlLtbBUA8eK+AGAli0BEhWtcLkJxGxfMHIQEPk7AhhFIgQPZ1CXpskS4SrxrqNCBiFjxvoayE0iMbChbAUvL8oYiARIggfgQkFAFKeX7V5tdgVkV4sO9R6NQ3PYIH08mgU8SsKEDkhdWihRICEFIwIqIlUNiXeWzUChBKM2WeGRFzMorBSxvLhIgARJwD4HtAP7PhipIVgVJJcbmUgIUty5dGJrlTgJdqnGJQD3SERK04okNxcKGMhXI1yJsRQCzkQAJkAAJeIOAZFVYCuDPAKQIhFQ5k/AFNpcRoLh12YLQHHcQ6FKRK1RKNlTUoOvXXQsddP1cvLPcwOWOpaQVJEACJBBtApILV1KG/QbAeyzjG228Pb8exW3PGfIKHiZgPbEiRiWjQCgDgQjVUKiAbNaSrAOhQ7yuFK4eXnOaTgIkQAJRINAKYDGAX8qGM6XU1ihck5eIEgGK2yiB5GXcT0BrLaJUwgRC6bJEwMpGLck6IEUMpKBBSMyyIpf7l5QWkgAJkIDTBKTC2V8A/BHAMqWUiF42hwlQ3Dq8ABw+NgTspi6Jew1t0AplHggJWRGzcohHVjZ9sZEACZAACZDA0RCoA/BGp4Pk55JZgZvNjgZhdM+huI0uT17NIQI2RlbCCSTTQOgQ8Tq0yyGptCT9FhsJkAAJkAAJRJOAVDJbBuBXAJ4HINXNdDQH4LXCJ0BxGz4r9nQRAeuZldCBwV3CCQZ1BvgPs2JWPhexy3vcRetGU0iABEjA5wR22MIPv5XMCsym4Mxq8w+/M9w56lEQsDGzEic7xIra0Z15B6d0xjuNsxW76JU9Cq48hQRIgARIIKoEagG81hn29iyAd5VS9VG9Oi/WLQGK224RsYOTBLTWIlglnEC8shJiEBK04+3nSU7ax7FJgARIgARI4BAEZGPZgs6/Uz+WnLhKqb2kFD8CFLfxY82RwiRgBa1s9JIQgxGdZQ9FyE4GMMYWRAjzSuxGAiRAAiRAAo4RkJjb1Z2bl3/R+TfsOQCbGIcbn7WguI0PZ47SDYEuHlrxzo4EMKkzKH+69dRKHlo2EiABEiABEvAigfJOJ81fO58+/tqmC5PNZ2wxJEBxG0O4vPSRCdgMB5LZQDy0IUE7zXpopTwtGwmQAAmQAAn4gUCNrWomYQrzlVKNfpiUW+dAcevWlfGpXTbLgWQxEDErYQYSbjDDvpcCC2wkQAIkQAIk4EcCzQDmdRYSehLAK0opyY/LFgMCFLcxgMpLfpKA1loKJUjeWdkQJoL2BPsq2Q/YSIAESIAESCARCLQDWNiZqvJxW7a3KhEmHe85UtzGm3gCjae1Tralbkd15v2b0PmDfAyAY20qLymFy0YCJEACvifQEehAe0Mb2psDwaPJvobetwSg2zqg2zV0h7avHeY9DnxtP2/vgEpSSEpNhkpNQlJaknlvjjQ5kpCUnozktJTge/lMvpce+r58L3iuXIfNEQIdtuCDeHD/wUwK0V8D3tnRZ5rwV9RaZ9s8tJJ/VmJoj7filnG0CX93EAAJeJ+AFrHaFEBARGqTFa0hwdooX7dbEduG9pZ2tDe2obW6BYH6VrTVtSJQ34JAXZv9Wj4P9usItEMHRMRaoRvoQIe8t591iAAOdEAlKySnpyApIwXJGclINq8pSM5MRXJmClKyUpCclWo/6/J5Ztc+qUjNS0daYQbSCj465DMRxGwxJxDKpCC5cP+qlNoZ8xETaACK2wRa7FhOVWst95JUDBMv7VQbdnCczU8by6F5bRIgARLoEQERk8abKkI05E01YrUt+HnosN8LNLahrbYFgVoRqy1BwVrXijYRrzUfiVjpI8JWRKnbmkpJQlp+OjJLc5FZkoPMUjlykdkvG+nFWR8TvGn5GUjtRdEbozXc2FmE6Ged+1B+r5TaFqMxEu6yFLcJt+TRnbANPehjq4TJxrBTbAov2TTGRgIkQAJxJSCP9ttbAugIeU9bPgoB6DBhAVbA2hAB06+pzXpUxasq77sIVhGtImTl1R4dLf7N5BQUvRlW7OZY4dtFABshnIuM3lnGS8wWFQJbO7MG/UZShSml1kfligl+EYrbBL8Bjnb6Ni9tGYCJNo72VFtsIeNor8nzSIAESOATBCTstLUdAXn8/wkvapeQAPs96SeP/41INa/B98HXoHf14M/aW9sBeUjMdlgCEqogHt68kYXIHVWE3BEFyB6Qh4zSXGSV5iBdxG4GxW4PbqHdnU8+/yAVzZRS63pwHZ4KgOKWt0FEBGw8reSlnWJjaU+yeWoZpBURSXYmgcQkEIpXNY//Q2EAzQGINzTkVTXvm4IeVRPb2hAMAzAeVRMKYMMA6kIe1Y88rdLfbMRiiykBI3ZLRewWIW9UIXKGFyB7YB4ySih2ewBeBO4fATxDgdsDihS3PYOXSGdrrXNsbtqZAE6zwlZK5LKRAAkkGAETo9rcjg4Rp60iTDvQYV7l63bjaT3w3opWExLQKoI1gIAIVfGgNnTxsja0ol08rA0feV1NOEBDm9lExeZuApKNwXh2R4nYLULuyMKgl3dkoRHBkrGBLSwC9OCGhenInei5jQJEP19Cay0ZDiQ3raTxmtNZYUU2iRX7ec6cGwkkCgHxcBoRGtrpHxKiNk7VfK/rZ7Kj33pbRYS2NwYgm6vkVbyswffyGvrcfi2e13rp787NVYmy3vGcZ0p2qhG5xbP6o3BqP+SNLUbu8AKzWY2tWwIhgfu0UmpDt73Z4RMEKG55U3yCQJfMB1JBTPLSngFAPLbcJMb7hQRcSuDARiojSEWEBowHNfTePOY3u/1tnGpIhFrvaTAW1XpO5TMRr+Z7XT8LClh6Ul16E7jUrLTCTBRO64fes/qjYEo/5I4oRPagPKTkpLnUYleYtQvA7wA8S4Eb+XpQ3EbOzNdnaK1FwErBBfHQnm4zHzA/ra9XnZNzIwERkME8qrLzP4CAxKXKI/1QeqoDX9vv29hU4zmVggFGvNojJFK7ZgGQlFWNbW6cOm3yKQHJxJA1IA/Fx/ZH0YwS5I/vbcMWcpGUmuTTWfdoWiJwf2s3mW3q0ZUS7GSK2wRb8MNN14YfSNGFEwF82uaqlWIMbCRAAlEgYEIAxJMqj+67FgA4sMv/I/FqxKzZRGV3+HfJoxo4OE2VfK+h1YQLsJGAVwiYsIWRRSg+rj+KjumPwun9kDu0wFRSY/sYgR2dVT1/BeCnSilJGcYWBgGK2zAg+bmL1jqz8z/D4TY/7WcAzAJAUevnRefcokdA6+AmKYk5tV7SoHDtEocqnlf5TL4vqahkM5Xs+De7/1tNIYDWA3lUg9+jWI3eEvFK7icgG9H6njYY/U4dbMIXJPNCSlaq+w2Pn4VS3OGnVuBWxG9Y745EcevdteuR5Vpr+c0x0FYSE0+t5Kkt6tFFeTIJ+IiAeFlDQjO0SSq4aaqLkJVKVbYqlVSmaq0RcSqVq1pMpapg2iorWBmr6qO7g1OJBYGMPtnoc9JA9D1lkBG5siFNKqOxGQKS+/ZxyYWrlKoikyMToLhNsDvEVhTrZ7MfnAngLCtyE4wEp5vQBDSMx/XgR/zGs2of87dVt6BlbyNaqpqDXlYRq1a8BoVss6la5cbSqgm9tpy85wmkFWSYuFzx5vY5oQy9xvZGSm7Cbz6T5M3LADwI4DmlVKPnFzqGE6C4jSFct11aa11oN4jJRjHx1o4CwCh+ty0U7ekxAbMZy4QBdNnpb/OqmqwAEgpQ3YyWfU3maK1sPPDefF3VZEIN2EiABJwjkJqXjuJjS9H/syPQ+4QBxpOb4FXQJLB+HoB7AbymlGp1bnXcPTLFrbvXJyrW2VK5IwB8CsC5troYA5qiQpcXcYKACRkQL6oI1bpQSVUrZOVrOUS8VjWjVY79Ilg/ei8CVmJj2UiABNxPIL04E31OHIj+/zECvY8vQ/aQ/ETOrtDSufH7dQD3dabpfE8pxZ2kh7iFKW7d/3N91BbafLV9bVztFzv/45MwBOaqPWqiPDFeBLqK149nDAhWrBJh27ynIeh1Fe+rCFfjcQ16YyW8gI0ESMBfBDJLc1F61lCUnDkURceUIqssDyo5IWVMA4B/AbhfKbXYX6scndkk5F0RHXTuvorWWjIeSGovyYDweQBjWW7Z3WuWUNZJloFm8b42o1WyA9S2BDMG2CwCIlJD4rWl0grYfY0w76uaTTECNhIggcQjIGI2Z0g+Ss8ehn5zhpiNZyJ6E7DJprI/d2Y3ekgptTEB53/EKVPc+uyOsBvG+tvsBxKCcDJTe/lskT00HdlsJZu2WqtlM1azeZVYVxMysM8K2L2NaJaNW/Iq3tjKRhMry0YCJEAChyMgRR9yRxai7LMjUfrp4SiY1CcRK56V2xRhTymlKnm3fESA4tZHd4MtxDAFwOfsMdRH0+NUXExARKzJIFDVJbZVQgT2N6GlogFNFQ1o3l2Ppt3y2mCELKtjuXhBaRoJeISA5MMtmlmKQeeNQ785g5A9OB8qKaGkzSrx3ooXlxkUKG498mMbnpnWWys5ayWt15dtIQYmBwwPH3tFQECyEMhmrdAGrZb9wU1aLfsa0byrHo3l9WjaWYemXfXmaxG3ul0y2LCRAAmQQOwIZJXlouxzIzHg3NEonFaC1MRJHdYhG8sA3GUzKHCDGWMwY/eDFq8r29jayQC+YmNry+I1NsfxLwERpLIpq0U8sVbAyqsRsbsb0CgCtrwOTTtFzFoRG5DfsWwkQAIk4AyB5MwUFE0vweCvjTc5cnOGJowXt8luMLtbKbXUGfruGjWhfPfuQt8za7TWkp9WijHMAXCeja3N6NlVeXaiEdAd2mQfMOEEXUSseGYllEAErBGyRsTWmQ1dksmAjQRIgATcSiCrf67JjTvoK2NROL0EKdkJkflyH4DfAXhYKbXdrWsTL7sobuNFOorjaK1FxEr2A0nvJZvGRkbx8ryUHwmIiG0KfCLnq4QNNIuINZ7Y+gNCVmJimZHAjzcC50QCiUFAvLhS5WzYdyYZL25mSU4iTHwLgCcB/EwpVZMIEz7cHCluPbb6Wuti66X9KgCpNJYQP7EeWybnzJWyss0iYm3O1wPe2CaTiSAURiBitrG8Di17uLHLucXiyCRAArEkIBvLckcUYvBXx2HAF0chb3RxIuTFXWQLPPwjkSuYUdzG8icritfWWstzFcl+cA4AEbYTo3h5XsqDBCQ8wKTWkowEUoFLhKx4Yvc0mg1dxhsbCinY3cDCBh5cY5pMAiTQcwLpxVkmL+7Qb01E0YwSv6cMkzyKr3XuqbpDKTW/5/S8eQWKWw+sm9ZavLPTAHwTwGc7HzuI95YtQQiEqnVJflhTQta+SuhAo8TCSlzsDrvBa1c92mqlOiMbCZAACZBAiEByRopJGSYCt98ZQyBxuT5uEpLwewD3KqV2+Hieh50axa3LV11r3cduGvsvAKcASIjIeJcvS8/N0xqSG7ajrR0drR1mk1ZbfeuBErKyyUvCCzpaAib1lomL3dVg0ms1Sb5Y2dy1j2m2er4QvAIJkEAiEZAMCkO+MQGDzhuLvFFFfp76ZgA/BPBzpZSU602oRnHr0uXWWqfYMATZNPY1W0rXpdbSLCEgOWBFlAaP1uBrfaspVtDeFDACNihkA2hvkfft5nMRse2NARNa0Li91oQUiIc2dJ2OFmYn4B1GAiRAAtEikNE3GwM+PwrDzp+Mgol9oFIk+ZDvmiQYn9c5q9sBvKqUSqiE4xS3LryftdZZACR3rYQhfAFAbxeamZAmHShiIOEBZtNWiwkDEBErryYG1nwv9H0pNduCtrqWoJBtCiDQ1AYK1oS8fThpEiABlxBIzUtHyZlDMPLi6Sg6phQStuDD1ti5P+fvAO5USq334fwOOyWKW5etts2GIOEHEoZwGgDmrnVgjUz+VylisK9LOdlQEQOTOitUiUtKyTaYfuJpZSMBEiABEvAGAUkX1mf2AIy4aBr6njIIInh92HYCeAbAjxIpPRjFrUvuZK21rIWU0JUwhG8AmMQKcvFZnANCdm8jmiub0FLZCNmsZdJlbWcRg/isAkchARIggfgTkJCEwqn9MPKiaSajQnpveXDquybpwe7u3Jj+T6VUwHezO8SEKG5dsMpa62QAwwB8ywpbltCN4bpISEDzXqm+VY/mvSJkg57Y+i01aNxWi4ZtNSYHbKCuNYZW8NIkQAIkQAKuIKAUeo0pwvALpmDguWOQWeq79PHyx+xfnVtDblNKLXcF8xgbQXEbY8DdXd7mrx0P4HwAX2Kar+6IHcX3NcwGL0mX1SDidXMValbvQ+2afWjYXG3SaUkIAhsJkAAJkEDiEsgdXoDh35uCwV8bh8xS36UK2wPgWVuet9bvq0xx6+AKa60zAUwF8H1bnCHbQXN8NbRu7zBFDcQL27C1FnUbq1CzfC+ql+9B3YYqillfrTYnQwIkQALRIZAzrADDz5+MwV8bj6wy3wncBZ2UJHvCC37PnkBxG52fh4ivorWWn5rjrbA9qzPZclrEF+EJHyMgglY2dtVvrDZitnZ1JaqX7UH1iko07qg1qbrYSIAESIAESOBIBHKG5GPYdydh8DcmIHtgnp9gSfaEP4vAVUpt9dPEDp4Lxa0Dq6u1lszRZwD4HoATO9N0+DLJXjzQ6nZtSs7Wb6o2HtmaFXuxb8FO46GVMrRsJEACJEACJBApgexBvTD0WxMw5L8mQsSuj9omAI8C+JlSyrflLClu43zHaq372ty1EmM7Jc7D+2I4yW4geWRF0NZLuMFKEbS7ULW0wlTyQkKlqvbFknISJEACJOA6AhKWINXMpNiDjwSuPMJ8BcDNSqkPXQc9SgZR3EYJZDiX0VqXAPhPABcAGBXOOezzEQGp9CXxsxJuULWsAvtF0C6pMGVpoaloea+QAAmQAAlEl4AI3KHfmohh50/xU4jCPvHcAnhQKbU/usTccTWK2zitg9a6FMBXbSjCiDgN6/lhjJd2XxNq1+5D1bI9qJxXbo6GLdWQkAQ2EiABEiABEoglAQlRkCwKEocrpXt90pYAuKuzGupzSinfbUihuI3DXWo9tl8HcCGAoXEY0vNDtDcHTM7ZmlWV2L9oN/a8vQ1VS/egrbrZ83PjBEiABEiABLxFIG9UEUZdNgODvjoWafm+KBwq8bZ/BXCLUmqzt1aje2spbrtn1KMeXTy2EoowvEcX8/vJNpa2dt1+syGscn45Kt/dgbpN1cx04Pe15/xIgARIwM0EFFAwqS/GXHMsyj43Aik5vkhwJKJWNpc9q5TyVf14itsY/jBZYSseWxG29NgehnVHazuadtWjZmUl9n+4C3vmbsP+RRUmCwIbCZAACZAACbiBgEpWKJpRirHXzULJWUORnJHiBrN6YkO75LwFcKPfKpdR3PbktjjCuVrr/gBE2Eq6LwrbQ7BqbwqgfnO1CTvYN78ce+ZuN5vFOtp8F/4To7uMlyUBEiABEogngaTUJPSePRDjbpiFPicNgnzt8bYbwFMAHlNKNXh8LgfMp7iNwUpaj+03rcd2cAyG8PQlpdRt3foq7PtwFyre3Io9b21DU3mdp+dE40mABEiABBKDQHJmCvrNGYJx189C0bH9oZI8L6XetqnB5vplBT2/Im5bCJvH9msALqbH9uOr01bbgtrV+1D5wU5UvL4Fle/tYKEFt9180y6GAAAgAElEQVTAtIcESIAESKBbAhJzW/a5kRh3w3HoNa642/4u71AN4BcA7lZKVbnc1rDMo7gNC1N4nbTWvQF8GcClzGNrmWmgtarJZD3Y9/5O7Hp5sxG3zHoQ3j3FXiRAAiRAAu4kkN47C0P/ayJGXzkDmaW57jQyfKsWArhDKfXP8E9xb0+K2yitjda6AMDnAVwBYEKULuvpy7RWN6N62V7snbvNiFqJrZWQBDYSIAESIAES8AOBnGEFGHX5DCNyU/M8nUFB4m1/D+A2pdQur68NxW0UVlBrLYWnPw3gcgAzonBJT19CBGzN6n0mlrb8+fWmkphUF2MjARIgARIgAV8RUEDh9BKMv/F4lJ49DElpyV6e3moA93emLf2t1ws7UNz28DbUWucBOAvAVZ0pNY7p4eU8fboUXqjfUGUKLpT/eyP2vruD4QeeXlEaTwIkQAIk0B0BEbT9ThuM8becgOJj+wPeVVbyaFUKO9yglNrW3bzd/H3vLoELqGqtJcjmNCtsZ7vAJEdMkDy1Uk1s73s7sPOFjah4bQua9zY6YgsHJQESIAESIIF4E5CQhIFfGmM2mEmogofbOgD3KaV+6eE5ePj/C4epa62l/t6JAK4HcIrD5jgzvNZoqmg0WQ9E1O5+eRMattU6YwtHJQESIAESIAEHCWT1z8XwC6di5EVTkVaY6aAlPRpavLd/EG2jlJIcuJ5s9NwexbJpraUsyVQA1wI4B4Cng2yOAgECDW2oWbkX5f9cj+1/X2uyIbCRAAmQAAmQQCITyJ/YB+NvOh4DvjAKKsWzBR5WAbhHKSUbzDzZKG4jXDattTAbDeBKW4HMs/+eRTh1010HOtC4vdYUX9j+t7WoeGMrN4sdDUieQwIkQAIk4DsCSanJKP30MEy88yTkT5DsoJ5szQB+Z8vy7vHiDChuI1w1rfUAABcC+D4ATwfWRDh1tO5vwr4Fu4y3Vg6GIERKkP1JgARIgAT8TiCjTxaGnT8FY66a6eXwhKUA7lRK/d2L60VxG8Gqaa2LAEj1McmMMCiCUz3dtaOt3WRBKP/XBmz/6xqTr7ajrcPTc6LxJEACJEACJBArAgWT+mCchCd83rPhCZL3VjaV3ayUkgpmnmoUt2Eul9Y6B8B/ALgOwOQwT/N8t9aqZlNZbOsfV5mctS37mjw/J06ABEiABEiABGJJwCfhCfMB3KqUeiWWrGJxbYrbMKhqrdMBSKqvGwCcGsYpnu8isbUN22qMt3brH1aZcAT5jI0ESIAESIAESKB7Aj4IT6gC8CyAu5VS4sn1TKO47WaptNay3XGS9diemwiZEQJ1rdi/eDe2/mkVdjy3Dk076z1zQ9NQEiABEiABEnALgYLJfTH+5uNRJuEJSZ6UXG/Yog7vu4VpOHZ4knQ4E4tWH631QACXAbgAgIQm+LdpoGl3PXa9vAlbfrsCe+ZuR0dLu3/ny5mRAAmQAAmQQAwJJKUnm7Rgk+46yavFHSRbwo8APKiUkhy4nmgUt0dYJq11PoCvWq+tiFzfto5AB+o3VmHbn1Zj8+9WoG7dft/OlRMjARIgARIggXgRyB7UC6OunIkRF05Bcrqkyfdcex7ANUqptV6xnOL2MCtl42yltO7NAGZ5ZUGPxs5AYxuqFu3Gpl8tx47n1qKlkpvGjoYjzyEBEiABEiCBTxBIUiiZMxiT7jkZhdNLvAhoI4AHlFI/9YrxFLeHWCkbZzvBltb9kp/jbEXIVryxBZt+uQy7X9vCMASv/OTSThIgARIgAc8QSO+dhREXTMGYa2chNTfNM3ZbQyUcQYo6XKuU8kQ5UorbQ4vbMgAX2yPXa3dhOPbqDo3GbTXY/vd12Pyb5ahaWgHocM5kHxIgARIgARIggUgJFB1Tiol3noiSM4ZGeqob+n/QacTtSqkX3GBMdzZQ3B5ESGudB+DLNu2XJ+/A7hZdCjDUrq7Epv9Zhq1/Xo2mnXXdncLvkwAJkAAJkAAJ9IBASk4qBn9tPCbcNhuZJZ7bny5pwZ7pfJJ9l1JKyvO6ulHcdlkerbU8KzjJxtme6OqVO0rj2psDqFpcgfU/XoTtf1+LQL1nNj8e5Yx5GgmQAAmQAAm4g0DemGKMu+E4DPn6OEB5ToL9G8APlFKr3EHz8FZ4jmwsgWqtx9g4WymxmxzLsZy4dqChDZXzdmDdU4uw84WN6GgJOGEGxyQBEiABEiCBhCSQlJaMQV8eg0n3nYKsMs9FPW4AcL9S6uduXzyKW7tCWutCAN+x4rbI7QsXqX2t1c2oeH0r1j+zyGwg0+0MsI2UIfuTAAmQAAmQQE8J5I0uwrgbj8eQb4zv6aXifb6EI/xSdJJSqibeg0cyHsUtAK11KoA5neBuBzAzEoBe6Nu8pwHlz2/Axp8sRuX7O71gMm0kARIgARIgAV8SkMIOg88bh0n3nuzF2Nu3AdyolHrXzYtDcRsUtyNtoYb/8lU4ggYad9SaTWObfrEUNas8kcHDzT8vtI0ESIAESIAEekyg19hijLvxOAz+6njAW0pMPGSPAnhMKdXRYxAxuoC3kMYAgta6AICI2us7dwL2jcEQzlxSa9RvqTH5a+Vo3FbrjB0clQRIgARIgARI4GMEpFLZoPPGetF72w7gDwCuVkpJaV5XtoQWtzYcQaqQ3eqrKmQaqN9SjQ0/XWLSfTXvrnflzUejSIAESIAESCBRCfQa1xvjbjoeg88b6zUE8wHcopR61a2GJ7q4HSUVNwB8E4AnCz4f6sZq2FaDjT9Zgg0/X0ph69afPNpFAiRAAiSQ0ATEezv46+Mx+f6TkV6c5SUWuyUsAcBDSilX7k5PWHGrte5lwxFuBtDbS3fVYW3VgAhb8daK15bFGXyxqpwECZAACZCATwkUTi/BhNtno/+nh3tphhKa8HsAV7m1HG9CilutdRKA2QDusEUbvHRTHdpWEbZba7DxF0uw8edL0bSToQjeX1TOgARIgARIwM8EUvPTMeKCqaZqWXKmpx4gvycFr5RSb7hxfRJV3JYAuAzAlQDS3bgwkdrUuL3WiNoNP11MYRspPPYnARIgARIgAYcI9DtjCKY8cCoKJntqT/suAI8opR5xCNsRh004cWs3kf2H1EcGMM6NixKpTS17G7H5tyuw5ocfMCtCpPDYnwRIgARIgAQcJJBVlofRV8/EqMtmQCV5RpZJidNfiZNQKVXnIL5DDu0ZitECp7UeYXPafhuAhCd4urXVtmDH/63D6ofeR/Vy12bl8DRjGk8CJEACJEACsSKgUpIw8NzRmPLgqcgakBerYWJx3ZdFTymllsTi4j25ZkKJW611NoDzOoFJJbL+PQHnhnMDjW2oeH0LVj04H3vnbneDSbSBBEiABEiABEggQgKSFmz8Tceb3LceaqsA3KOUks1lrmoJI2611jLXaZ0FyW4DIGEJnm4dre2onF+OVQ/Mw64XN0F3uDIbh6cZ03gSIAESIAESiAeBlKxUDP3uJEy+52Sk5KbFY8hojFEN4ElxGCqlJIOCa1oiidsiABfaSmQ5rlmBozBEt2sTgrD6ofnY9pfV6GhzbQW8o5gdTyEBEiABEiCBxCPQ77TBmHz/KZD0YB5p4lX7E4DL3VatLCHErdY6GYBUIpNNZDM9ctMc1sz6jVVY8/gCbPqfpQjUt3l9OrSfBEiABEiABBKeQPbgXhh77SyM+P5UL7GYC+AmpZS8uqYliriVf4OusKm/Ul1D/ygMad7TgE2/WIY1j30Aec9GAiRAAiRAAiTgfQJJ6ckY+q2JZmNZap5nspRuAPCAUupnbloB34tbW7DhLAD3ApjkJviR2hKob8WO59Zh5X3voWZVZaSnsz8JkAAJkAAJkICLCfQ9eRAm3Xsyimd5Zs+7VIx6GsCNboq7TQRxG/LaXgXAU+U/uv78SVzt3ne3Y+U972L3q1tc/KNJ00iABEiABEiABI6GQNbAPIy95liMvHT60Zzu1DmhuNsKpww4eFxfi1sba/sp67Wd4BboEduhgZrVlSbl15bfrYAOcANZxAx5AgmQAAmQAAm4nEBSWjKGfGM8pjx8GtLyM1xu7QHzXBd363dxK359KbEr8bayqcyTrWlnHdY/sxjrnvwQrdXNnpwDjSYBEiABEiABEuieQO/ZAzDp7pPR58QB3Xd2R4/1AO5TSv2PO8wBfCturdf2bOu1He8W4JHaIRXItv1lDVbd/x7qNlRFejr7kwAJkAAJkAAJeIhAVv9cjL7mWIy+YoZXrJZ8t08opaSOgCuan8WteG0lzvZyr3ptpVBDxRtbseKed1mBzBU/LjSCBEiABEiABGJLICk1GUO/PRFTH52DlGxPJHiSWEnx2l6qlGqKLZ3wru5LcWu9tp+xXtsx4aFwVy+pOCaFGlbdP88UapDCDWwkQAIkQAIkQAL+J1B61jBMfuhU5I/v7ZXJ/p84FJVSm9xgsF/FbSmAq63n1g2cI7ahcUcd1j31IdY9tRCButaIz+cJJEACJEACJEAC3iQgonbcLSdg0Jc94597B8AtSqk33UDcr+L2dAD3A/BUmY/QDRFobMP2v63