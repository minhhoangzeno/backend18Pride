const fs = require('fs').promises;
const path = require('path');


export const deleteFileMulter = async (filePath: string) => {
  await fs.unlink(path.join('./uploads', filePath)).catch((err: any) => {
    console.log("err", err)
  })
}