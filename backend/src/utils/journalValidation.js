const journalValidation = ({
  journalEntryDate,
  title,
  contentType,
  productivityRating,
  selectedMood,
}) => {
  // **Data Validation**
  if (!journalEntryDate) {
    return { status: "fail", message: "Journal entry date is required" };
  }

  if (!title) {
    return { status: "fail", message: "Title is required" };
  }

  if (!contentType) {
    return { status: "fail", message: "Content and its type are required" };
  }

  // Validate journalEntryDate
  const currentDate = new Date().toISOString().split("T")[0];
  if (new Date(journalEntryDate) < currentDate) {
    // console.log(journalEntryDate, currentDate);
    return {
      status: "fail",
      message: "Cannot add or update journals for past dates",
    };
  }

  if (!productivityRating) {
    return { status: "fail", message: "Productivity rating is required" };
  }

  if (selectedMood && typeof selectedMood !== "string") {
    const mood = JSON.parse(selectedMood);
    if (mood.emoji === "" || mood.label === "") {
      return { status: "fail", message: "Mood is required" };
    }
  }

  // If all validations pass
  return { status: "success", message: "Validation passed" };
};

module.exports = journalValidation;
