const { cloudinary } = require("../middleware/multerCloudinaryMiddleware");

const deleteCloudinaryResource = async (publicId, resource_type = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resource_type,
    });
    console.log(`Deleted Result for url:`, publicId, result);
  } catch (error) {
    console.error(`Error deleting resource:`, error);
  }
};

const cleanupCloudinaryJournalData = async (existingJournal) => {
  // **Check for Existing Journal**
  console.log("cloudinary cleanup");

  console.log(
    "Existing journal found. Deleting associated resources from cloudinary."
  );
  // **Delete Existing Resources from Cloudinary**
  const defaultThumbnail =
    "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  if (
    existingJournal.thumbnail &&
    existingJournal.thumbnail !== defaultThumbnail
  ) {
    const publicId =
      "memories-journal/thumbnails/" +
      existingJournal.thumbnail.split("/").pop().split(".")[0];
    await deleteCloudinaryResource(publicId);
  }

  if (existingJournal.snapPhotos && existingJournal.snapPhotos.length) {
    for (const snapPhoto of existingJournal.snapPhotos) {
      const publicId =
        "memories-journal/snapshots/" +
        snapPhoto.split("/").pop().split(".")[0];
      await deleteCloudinaryResource(publicId);
    }
  }

  if (
    existingJournal.content.type !== "text" &&
    existingJournal.content.payload
  ) {
    const publicId =
      "memories-journal/contents/" +
      existingJournal.content.payload.split("/").pop().split(".")[0];
    await deleteCloudinaryResource(publicId, "video");
  }

  console.log("All associated resources deleted.");
};
module.exports = cleanupCloudinaryJournalData;
