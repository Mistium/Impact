const Button = document.querySelector(".ModeButton");

// Updated base URL to use GitHub Pages instead of raw GitHub content
const linkbody = "https://impact.warpcore.live/extensions";

function downloadStringAsFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function CopyToClipboard(Data) {
    navigator.clipboard.writeText(Data);
}

function ToggleToString(Bool) {
    return Bool === "true" ? "false" : "true";
}

function ToggleButton(ToggleValue, CopyValues) {
    if (CopyValues === true) {
        setCookie("PreferCopy", ToggleValue);
    }
    if (ToggleValue === "true") {
        Button.textContent = "Copy code";
        Button.dataset.toggle = true;
    } else {
        Button.textContent = "Download";
        Button.dataset.toggle = false;
    }
}

const getCookie = (name) => {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(name + "="))
        ?.split("=")[1];
};

function setCookie(name, value) {
    const expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT";
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Ensure a default setting for the "PreferCopy" cookie
if (getCookie("PreferCopy") === undefined) {
    setCookie("PreferCopy", "false");
}

// Encode filenames to handle spaces and special characters
function encodeFileName(fileName) {
    return encodeURIComponent(fileName); // Converts spaces to %20 and encodes special characters
}

async function fetchData(FileName) {
    try {
        const encodedFileName = encodeFileName(FileName);
        const fileUrl = `${linkbody}/${encodedFileName}`; // Ensure correct URL encoding
        console.log("Fetching:", fileUrl);

        const response = await fetch(fileUrl);
        if (!response.ok) {
            alert(`Failed to fetch extension code for: ${FileName}`);
            return null;
        }
        return await response.text(); // Get file content as text
    } catch (error) {
        alert(`Failed to fetch extension code for: ${FileName}`);
        return null;
    }
}

async function Onclick(ExtName) {
    const ExtData = await fetchData(ExtName);
    if (ExtData === null) {
        return;
    }

    if (getCookie("PreferCopy") === "true") {
        CopyToClipboard(ExtData);
        alert("Copied to clipboard!");
    } else {
        downloadStringAsFile(ExtData, ExtName, "text/javascript");
    }
}

// Initialize button with saved preference
ToggleButton(getCookie("PreferCopy"), true);
