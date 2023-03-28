import { ip } from "./IpServer";
import { environment } from "../../environments/environment";

let url: string;

if (environment.production === false) {
  url = "http://" + ip + ":3300/api";
} else {
  // url = "/api";
  url = "http://localhost:3300/api"
}

export var api: string = url;
