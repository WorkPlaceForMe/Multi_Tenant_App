export interface Camera{
  id?: string;
  name?: string;
  rtsp_in?: string;
  rtsp_out?: string;
  heatmap_pic?:string;
  id_account?:string;
  pic_height?:string;
  pic_width?:string;
  cam_height?:number;
  cam_width?:number;
  stored_vid?:string;
  summarization_status?:number;
  atributes?:{
    longitude:string;
    latitude:string;
  };
  type?:string;
  http_in?:string;
  //The ? is for make it optionals
}
