import { cloudfareConfig, cloudfare_url } from "src/constant";
var axios = require('axios');
var FormData = require('form-data');

export const uploadFileCloudfare = async (file: any) => {
  var data = new FormData();
  data.append('file', file.buffer, file.originalname);
  var config = {
    method: 'post',
    url: cloudfare_url,
    headers: {
      'Authorization': `Bearer ${cloudfareConfig.image_token}`,
      "Content-Type": "multipart/form-data"
    },
    data: data
  };
  return axios(config).then((result: any) => {
    return result.data.result.variants[0];
  }).catch((err: any) => console.log("Upload image cloudfare ", err))
}