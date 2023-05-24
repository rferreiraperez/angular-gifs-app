import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.iterfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList       : Gif[]    = [];
  private apiKey       : string   = "WFoN8WtlnU5BKFLrU77FrL8Xy8Nr5wqG";
  private apiUrl       : string   = "https://api.giphy.com/v1/gifs";
  private _tagsHistory : string[] = [];

  constructor( private http:HttpClient ) {
    this.loadLocalStorage();
    this.setFirstTag();
  }

  private organizeHistory( tag:string ) {
    tag = tag.toLowerCase();
    if (this._tagsHistory.includes( tag ) ) {
      this._tagsHistory = this._tagsHistory.filter( (old) => old !== tag );
    }
    this._tagsHistory.unshift( tag );
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private setFirstTag() :void {
    if ( this._tagsHistory.length > 0 ) {
      this.searchTag ( this._tagsHistory[0] );
    }
  }

  private loadLocalStorage() :void {
    if ( !localStorage.getItem( "history" ) ) return;
    this._tagsHistory = JSON.parse( localStorage.getItem( "history" )! );
  }

  private saveLocalStorage() :void {
    localStorage.setItem( "history", JSON.stringify(this._tagsHistory) );
  }

  public get tagsHistory() {
    return [...this._tagsHistory];
  }

  public searchTag( tag:string ): void {
    if ( tag.length === 0 ) return;
    this.organizeHistory( tag );

    const params = new HttpParams()
      .set("api_key", "WFoN8WtlnU5BKFLrU77FrL8Xy8Nr5wqG")
      .set("limit", 10)
      .set("q", tag);
    this.http.get<SearchResponse>(`${ this.apiUrl }/search`, { params })
      .subscribe( resp => {
        this.gifList = resp.data;
      });
  }
}
