export const BigIntTransformer = {
  from: (value: number | string) => {
    if (value === null || value == undefined) return null;
    return Number(value);
  },
  to: (value: number | string) => {
    if (value === null || value == undefined) return null;
    return Number(value);
  },
};

export const JsonTransformer = {
  from: (value: string) => {
    if (value === '') return null;
    if (value === null || value == undefined) return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  },
  to: (value: any) => {
    if (value === '') return null;
    if (value === null || value == undefined) return null;
    try {
      return JSON.stringify(value);
    } catch (e) {
      return value;
    }
  },
};

export const StringTransformer = {
  from:(value:string) =>{
    if (value === '') return null;
    if (value === null || value == undefined) return null;
    try {
      return new Date(value);
    }catch (e){
      return value;
    }
  },
  to:(value:any)=>{
    if (value === '') return null;
    if (value === null || value == undefined) return null;
    try{
      return new Date(value);
    }catch (e) {
      return value;
    }
  },
};
