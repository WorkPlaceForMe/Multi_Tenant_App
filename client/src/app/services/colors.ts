import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

  
export class ColorsService {

    ran_col(i,n){
          var r,g,b,m;
          let a = i;
          if(n >= 1 && n <= 5){
            n = 6
          }
          if(i > 6 && i < 14){
            a=i-7;
          }else if(i >= 14 && i < 21){
            a = i - 14;
          } else if(i >= 21){
            a = 0;
          }
          if(a==0){
            r=255-((i*255)/(n-1));
            g=0;
            b=0;
          }else if(a==1){
            r=0;
            g=255-((i*255)/(n-1));
            b=0;
          }else if(a==2){
            r=0;
            g=0;
            b=255-((i*255)/(n-1));
          }else if(a==3){
            r=255-((i*255)/(n-1));
            g=0;
            b=255-((i*255)/(n-1));
          }else if(a==4){
            r=0;
            g=(i*255)/(n-1);
            b=(i*255)/(n-1);
          }else if(a==5){
            r=(i*255)/(n-1);
            g=(i*255)/(n-1);
            b=0;
          }else if(a==6){
            r=255-((i*255)/(n-1));
            g=(i*255)/(n-1);
            b=255-((i*255)/(n-1));
          }
          var strr = `${r},${g},${b}`;
          return strr;
      }

}