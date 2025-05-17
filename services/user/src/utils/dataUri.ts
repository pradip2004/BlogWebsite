import DataUriParser from "datauri/parser.js";
import path from "path";

const getBuffer = (file: any) =>{
      const aprser = new DataUriParser();
      const extname = path.extname(file.originalname).toString();
      const buffer = aprser.format(extname, file.buffer);
      return buffer
}

export default getBuffer;