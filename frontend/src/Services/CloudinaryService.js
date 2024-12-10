export const uploadImageToCloudinary = async (file, email) => {
  const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  // Generate a custom filename using email and current date-time
  const currentDateTime = new Date().toISOString().replace(/[:.]/g, "-");
  const customFileName = `${email}-${currentDateTime}`;

  // Create a FormData object to hold the file and other params
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  // Set the custom file name (public_id)
  formData.append("public_id", customFileName);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    // Check if the upload was successful
    const data = await response.json();

    if (response.ok) {
      // Return the URL of the uploaded image
      return data.secure_url;
    } else {
      throw new Error(data.error.message || "Upload failed");
    }
  } catch (error) {
    throw new Error(`Error uploading image: ${error.message}`);
  }
};
