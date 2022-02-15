import { ip } from "./IpServer";
import { environment } from "../../environments/environment";

let url: string;

if (environment.production === false) {
  url = "http://" + ip + ":8080/api";
} else {
  url = "/api";
}

export var api: string = url;
