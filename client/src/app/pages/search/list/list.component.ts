import { Component, OnInit } from "@angular/core";
import { FacesService } from "../../../services/faces.service";
import { summarizationStatus as status } from "../../../utils/summarization.status"

@Component({
  selector: "ngx-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {

  videos: Array<any> = [];
  relations: Array<any> = [];
  algos: Array<any> = [];
  heatmap: Boolean = false;
  summarizationMessage: string = "No status available";
  summarizationMessageVisibility = "hidden";
  summarizationMessageColor: string;
  
  constructor(private face: FacesService) {}  

  ngOnInit(): void {
    this.getVids();
  }

  trackByFn(index, item) {
    return item.id;
  }

  getVids() {
    this.face.viewVids().subscribe(
      (res) => {
        this.videos = res["data"];
        this.face.getAllRelations().subscribe(
          (res) => {
            this.relations = res["data"];
            this.face.getAlgos().subscribe(
              (res) => {
                this.algos = res["data"];
                for (let i = 0; i < this.algos.length; i++) {
                  if (
                    this.algos[i]["name"] == "Heatmap" &&
                    this.algos[i]["available"] == 1
                  ) {
                    this.heatmap = true;
                  }
                }
                for (let u = 0; u < this.algos.length; u++) {
                  for (let i = 0; i < this.videos.length; i++) {
                    for (let e = 0; e < this.relations.length; e++) {
                      if (
                        this.algos[u]["name"] == "Heatmap" &&
                        this.algos[u]["id"] == this.relations[e]["algo_id"] &&
                        this.relations[e]["camera_id"] == this.videos[i]["id"]
                      ) {
                        this.videos[i].hm = true;
                      }
                    }
                  }
                }
              },
              (err) => console.error(err)
            );
          },
          (err) => console.error(err)
        );
      },
      (err) => {
        console.error(err);
      }
    );
  }

  refreshStatus(id: string) {
    this.face
      .getCamera(id)
      .subscribe(
        (res: any) => {
          if(res?.success){
            const currentVideo = this.videos.find( video => video.id == id );
            currentVideo.last_summarization_status = res.data.last_summarization_status;
            currentVideo.any_successful_summarization = res.data.any_successful_summarization
                        
            switch(res.data.last_summarization_status) {
              case status.SUMMARIZATION_STATUS_IN_PROGRESS:
                this.summarizationMessage = 'Keep patience, summarization is in progress....';
                this.summarizationMessageColor = "amber";
                break;
              case status.SUMMARIZATION_STATUS_COMPLETED:
                this.summarizationMessage = 'Wow! Summarization completed';
                this.summarizationMessageColor = "green";
                break;
              case status.SUMMARIZATION_STATUS_ERROR:
                  this.summarizationMessage = 'Summarization failed';
                  this.summarizationMessageColor = "red";
                  break;
              default:
                this.summarizationMessageColor = "blue";
                this.summarizationMessage = 'Keep patience, summarization is in progress....';
            }

            this.summarizationMessageVisibility = "visible";
            setTimeout( () => {
              this.summarizationMessageVisibility = "hidden";
              this.summarizationMessageColor = null;
            }, 5000);
          }          
        },
        (err) => {
          this.summarizationMessage = 'No status available';
          this.summarizationMessageVisibility = "visible";
          this.summarizationMessageColor = "blue";
          setTimeout( () => {
            this.summarizationMessageVisibility = "hidden";
            this.summarizationMessageColor = null;
          }, 5000);
        }
      );
  }

  deleteVideo(name: string, id, where) {
    let split_rtsp = name.split("/");
    const body = {
      vidName: split_rtsp[split_rtsp.length - 1],
      uuid: id,
      which: where,
    };
    if (confirm("Do you want to delete this camera?")) {
      this.face.delVid(body).subscribe((res) => {
        this.getVids();
      });
    }
  }
}
