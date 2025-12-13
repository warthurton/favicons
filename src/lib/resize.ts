import sharp from "sharp";

export async function resizeImage(
  imageBuffer: Buffer,
  size: number
): Promise<Buffer> {
  try {
    return await sharp(imageBuffer)
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
  } catch (error: unknown) {
    console.error("Error resizing image:", error);
    throw error;
  }
}
