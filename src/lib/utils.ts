import { Buffer } from 'buffer';
import { Part } from '@google/generative-ai'; // Import the 'Part' type from the official SDK.

/**
 * Converts a file buffer into a GoogleGenerativeAI.Part object.
 * This format is required for sending multimodal (e.g., image) data to the Gemini API.
 *
 * @param {Buffer} buffer The raw image data as a Buffer.
 * @param {string} mimeType The MIME type of the image (e.g., 'image/png', 'image/jpeg').
 * @returns {Promise<Part>} A Promise that resolves to a Part object formatted for the Gemini API.
 */
export async function bufferToGenerativePart(
  buffer: Buffer,
  mimeType: string
): Promise<Part> {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType,
    },
  };
}