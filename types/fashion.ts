export type Palette = [string, string, string];
export type Collection = {
  id:string; title:string; category:string; subtitle:string; description:string; story:string;
  maker:string; city:string; material:string; care:string; fit:string; sizes:string[];
  price:string; leadTime:string; 
  colors:[string,string]; accent:string; gallery:Palette[];
};
export type Creator = {
  id: string;
  name: string;
  city: string;
  specialty: string;
  palette: string;
  colors: [string, string, string];
};