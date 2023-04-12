export interface Message {
    success?:boolean,
    date?:Date,
    id: string,
    TimeStamp: number,
    Analytic: number,
    CameraId: string,
    Parameters: {
      camera_name?: string,
      zone?: string,
      dwell?: string,
      track_id?: number
    },
    Detail: string,
    UrlImage: string,
  }