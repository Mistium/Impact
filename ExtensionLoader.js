const basePath = "extensions"; // Change this to the actual path where extensions are stored

const SearchField = document.querySelector(".SearchField");

function ReportErrorOnPage() {
  const ErrorMessage = document.createElement("h5");
  ErrorMessage.style =
    "color: #F54156; text-align: center; font-size: 30px; padding: 20px";
  ErrorMessage.textContent = "Failed to fetch extensions :(";
  document.body.insertBefore(ErrorMessage, document.querySelector(".Footer"));
}

async function fetchLocalContents(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      ReportErrorOnPage();
    }
  } catch (error) {
    ReportErrorOnPage();
  }
}

// Helper to create and add a list item
function AddListItem(item, fileTree) {
  const listItem = document.createElement("li");
  listItem.classList.add(item.type);
  listItem.classList.add(item.type === "dir" ? "folder" : "file");
  listItem.textContent = item.name;
  listItem.id = item.path;

  if (item.type === "dir") {
    listItem.addEventListener("click", () => toggleFolder(listItem, listItem.id));
    const subfolder = document.createElement("ul");
    subfolder.classList.add("subfolder");
    listItem.appendChild(subfolder);
  } else {
    listItem.addEventListener("click", () => Onclick(listItem.id));
    
    // Create and append the copy link button
    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy Link";
    copyButton.style.marginLeft = "10px";
    copyButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent triggering file click
      const fileUrl = `${basePath}/${item.path}`;
      navigator.clipboard.writeText(fileUrl).then(() => {
        alert("Link copied to clipboard");
      });
    });
    listItem.appendChild(copyButton);
  }

  fileTree.appendChild(listItem);
}

// Fetch and display the directory structure
async function displayLocalContents(path = basePath) {
  const data = await fetchLocalContents(`${path}/index.json`); // Expecting a JSON file that lists contents
  if (data === null) return;

  const fileTree = document.getElementById("file-tree");
  const spinner = document.getElementById("spinner");
  fileTree.innerHTML = "";

  if (Array.isArray(data)) {
    for (const item of data) {
      if (item.type === "file" && item.name.endsWith(".author")) continue;
      AddListItem(item, fileTree);
    }
  }

  if (path !== basePath) {
    const listItem = document.createElement("li");
    listItem.classList.add("backbutton");
    listItem.textContent = "Back";
    listItem.addEventListener("click", () => displayLocalContents(basePath));
    fileTree.appendChild(listItem);
  }

  spinner.style.display = "none";
}

// Toggle folder visibility
function toggleFolder(folderElement, path) {
  folderElement.classList.toggle("expanded");
  const subfolder = folderElement.querySelector(".subfolder");
  if (subfolder) {
    displayLocalContents(path);
  }
}

function OnSearch() {
  const SearchQuery = SearchField.value.toLowerCase();
  const Items = document.getElementById("file-tree").children;
  Array.from(Items).forEach(function (listItem) {
    if (listItem.id.toLowerCase().includes(SearchQuery)) {
      listItem.hidden = false;
    } else {
      listItem.hidden = true;
    }
  });
}

SearchField.addEventListener("input", OnSearch);

displayLocalContents(basePath);
