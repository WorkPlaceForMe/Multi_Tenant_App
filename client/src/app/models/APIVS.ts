import { environment } from "../../environments/environment";

let url: string;

if (environment.production === false) {
  url = "http://10.10.0.139:3300/api3";
} else {
  url = "/api3";
}

export var api: string = url;