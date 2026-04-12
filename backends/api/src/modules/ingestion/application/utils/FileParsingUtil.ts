export class FileParsingUtil {
  static extractText(file: Express.Multer.File): string {
    if (file.mimetype === 'text/plain') {
      return file.buffer.toString('utf-8');
    }

    throw new Error(
      `Unsupported file type: ${file.mimetype}. Only .txt files are supported.`,
    );
  }
}
