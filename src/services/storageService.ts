const CLOUDINARY_CLOUD_NAME = "mainhuy";
const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";

export async function uploadImage(
  uri: string,
  fileName = "image.jpg",
  mimeType = "image/jpeg"
): Promise<string> {
  const formData = new FormData();

  formData.append("file", {
    uri,
    name: fileName,
    type: mimeType,
  } as any);

  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url;
}

export async function uploadRoomImage(
  roomID: string,
  uri: string,
  fileName = "room.jpg",
  mimeType = "image/jpeg"
): Promise<string> {
  return uploadImage(uri, fileName, mimeType);
}

export async function uploadUserAvatar(
  userID: string,
  uri: string,
  fileName = "avatar.jpg",
  mimeType = "image/jpeg"
): Promise<string> {
  return uploadImage(uri, fileName, mimeType);
}