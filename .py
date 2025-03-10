import os
import json

def generate_index_json(directory):
    """Recursively creates index.json files for each directory in the given path."""
    for root, dirs, files in os.walk(directory):
        index_data = []

        # Add directories
        for dir_name in dirs:
            index_data.append({
                "name": dir_name,
                "type": "dir",
                "path": os.path.join(root, dir_name).replace("\\", "/")  # Normalize for web usage
            })

        # Add files
        for file_name in files:
            if file_name == "index.json":
                continue  # Skip index.json files to prevent overwriting issues

            index_data.append({
                "name": file_name,
                "type": "file",
                "path": os.path.join(root, file_name).replace("\\", "/")  # Normalize for web usage
            })

        # Write index.json in the current directory
        index_file_path = os.path.join(root, "index.json")
        with open(index_file_path, "w", encoding="utf-8") as f:
            json.dump(index_data, f, indent=2)

        print(f"Generated: {index_file_path}")

# Run the script on the 'extensions' directory
generate_index_json("extensions")
