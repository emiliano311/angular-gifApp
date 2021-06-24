import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey    : string = 'g8mL9jz9gE8m40eex9v27uqbXFpHARDt';
  private url    : string = 'https://api.giphy.com/v1/gifs';
  
  private _historial:string[] = [];


  public resultados:Gif[]=[];
  get historial():string[]{
    
    return [...this._historial];
  }

  constructor(private http:HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados= JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(query:string =''){
    if(query.trim().length===0){
      return;
    }
    query = query.trim().toLowerCase();

    if(!this._historial.includes(query)){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);
      localStorage.setItem('historial',JSON.stringify(this._historial));
      
    }
    const params = new HttpParams()
    .set('api_key',this.apiKey)
    .set('limit','10')
    .set('q',query);
    // console.log(params.toString());
    // params:params es redundante entonces se manda solo params, sino se manda con el otro nombre
    this.http.get<SearchGifsResponse>(`${this.url}/search`, {params})
             .subscribe((resp) =>{
               console.log(resp.data)
               this.resultados = resp.data;
               localStorage.setItem('resultados',JSON.stringify(this.resultados));
             })
  }
}
