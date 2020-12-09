import { ip } from './IpServer';
import { environment } from '../../environments/environment';

var url :string = 'http://'+ ip +':3300/api';
if(environment.production=== true){
    url = '/api';
      }

export var api: string = url;
// http://'+ ip +':3300/api
// /api
