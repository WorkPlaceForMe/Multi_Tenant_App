export interface Account {
    id?: string;
    username:string;
    email:string;
    algorithm?:Array<string>;
    id_account?:string;
    id_branch?:string;
    password?:string;
    role?:string;
    unique?:number;
    analytics?:number;
    cameras?:number;
    disabled?:number;
    createdAt?:Date;
    updatedAt?:Date;
  }
  