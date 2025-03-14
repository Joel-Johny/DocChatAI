const fs = require("fs/promises"); // For file system operations with promises
const cleanupServerUploads = async (files) => {
  try {
    // Loop through each field in `files`
    for (const field in files) {
      for (const file of files[field]) {
        console.log(`Deleting file: ${file.path}`);
        await fs.unlink(file.path); // Delete the file
      }
    }
    console.log("All files uploaded in server cleaned up successfully");
  } catch (err) {
    console.error("Error while cleaning up uploads", err.message);
  }
};

module.exports = cleanupServerUploads;
