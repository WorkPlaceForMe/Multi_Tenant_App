import { ip } from './IpServer';
<<<<<<< HEAD
import { environment } from '../../environments/environment';

var url :string = 'http://'+ ip +':3300/api';
if(environment.production=== true){
    url = '/api';
      }

export var api: string = url;
// http://'+ ip +':3300/api
// /api
=======
export var api :string = 'http://'+ ip +':3300/api';
// http://'+ ip +':3300/api
// /api
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339
