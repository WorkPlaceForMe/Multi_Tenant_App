import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

  
export class StrService {
    array_to_str(array){
        var n,m;
        array.pop();
        for(let i = 0; i < array.length; i++){
          if(i==0){
          n = `(${array[i]['x']},${array[i]['y']}),`;
          m = `${n}`;
          }else if(i == (array.length-1)){
          n = `(${array[i]['x']},${array[i]['y']})`;
          m = `${m}${n}`;
          }
          else{
            n = `(${array[i]['x']},${array[i]['y']}),`;
            m = `${m}${n}`;
          }
        }
        return m;
      }
}
