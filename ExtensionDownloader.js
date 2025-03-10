const Button = document.querySelector(".ModeButton")
const linkbody = "https://raw.githubusercontent.com/Warp-Core-PW/Impact/refs/heads/main/"

function downloadStringAsFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function CopyToClipboard(Data) {
    navigator.clipboard.writeText(Data)
}

function ToggleToString(Bool) {
    if (Bool == "true") {
        return "false"
    } else{
        return "true"
    }
}

function ToggleButton(ToggleValue, CopyValues) {
    if (CopyValues == true) {
        setCookie("PreferCopy", ToggleValue)
    }
    if (ToggleValue == "true") {
        Button.textContent = "Copy code"
        Button.dataset.toggle = true
    }else {
        document.querySelector(".ModeButton").textContent = "Download";
        document.querySelector(".ModeButton").dataset.toggle = false
    }
 }

const getCookie = (name) => {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='))
        ?.split('=')[1];
};

function setCookie(name, value) {
    const expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT";
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
     }

     if (getCookie("PreferCopy") == undefined) {
        setCookie("PreferCopy", "false")
     }

     async function fetchData(FileName) {
        try {
            console.log(linkbody + FileName)
            const response = await fetch(linkbody + FileName);
            if (!response.ok) {
                alert(`Failed to fetch extension code for: ${FileName}`)
                return null
            }
            const data = await response.text();
            return data // This will log the plain text data to the console
        } catch (error) {
            alert(`Failed to fetch extension code for: ${FileName}`)
            return null
        }
    }
    

async function Onclick(ExtName) {
    if (penguinmod) {
        CopyToPM(linkbody + ExtName)
    } else {
    const ExtData = await fetchData(ExtName)
    if (ExtData == null) {
        return
    }
    console.log(ExtData)
if (getCookie("PreferCopy") == "true") {
CopyToClipboard(ExtData)
console.log("clicked")
alert("Copied to clipboard!")
}else{
downloadStringAsFile(ExtData, ExtName, "text/javascript")
}
}
}
ToggleButton(getCookie("PreferCopy"), true)
