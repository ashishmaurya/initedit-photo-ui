import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpResponse, HttpRequest, HttpEvent, HttpSentEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PhotoBaseResponse } from './model/PhotoBaseResponse';
import { TokenBaseResponse } from './model/TokenBaseResponse';
import { SinglePhotoBaseResponse } from './model/SinglePhotoBaseResponse';
import { Photo } from './model/Photo';
@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  

  //static token:string = "wHxfpOvGJ1ri1DGht0YVeEt0E0VkpqvAJVcjZq4g0wSsEQO7bWO1TzPwP1D5IGFb8yZiLLvushnaxWXDVoazUoGF35xsbdx8JRbkuFJyAErF03ZAirOThT0YjwrC49RrNCnPurwGVLnIyV2PYR0vnhkKGKntRbAJG84K99Q6O8OXBfejOkiRAsOA9JF3Q1nuNndxLGaX9rkIEyuGhIPxGdRVDBAxpNYKTalEVyyQ1EqkuDGghFPWThs1xaHHQWnDw5W6cVAeT8Ox5opv9JS2LsgnyEPoVn4hR6sgvRS0rygedzx9Z8lngJxHtIxdgupYZFw8iUP0yxDNIodAbz23Zldz8a6v5eATKQafuqOTKscFee6rDFXDQXnp8SbQhntzRMvhRfOwy9O9XAb82SNc59KNsMPPD3IWbERgcdHPaPsazBJNM0HmYdnkvMM5otCuxYT71wjHjJIc081pcv7UXv365xW9bslVJV3oRqqjZy9ft7zGSKg17RoUYWxC1U76";
  // baseAPI:string = "http://localhost:8080/api";
  static baseAPI:string = "//api.photo.initedit.com/api";
  constructor( private http: HttpClient) { }

  static getAPIPath(url:string):string{
    return PhotoService.baseAPI+url;
  }
  static getHeaders(name:string):any{
    var currentUser = JSON.parse(localStorage.getItem('currentSession'));
    if(!currentUser)
      currentUser = {token:"",name:name};
    if(name==currentUser.name){
      return {
        headers: new HttpHeaders(
          { 'name':name,'token':currentUser.token}
        )
      };
    }
    return {
      headers: new HttpHeaders(
        { 'name':name,'token':""}
      )
    };
  }

  

  getActiveAlbum(){
    var currentUser = JSON.parse(localStorage.getItem('currentSession'));
    return currentUser && currentUser.name;
  }
  getActiveToken(){
    var currentUser = JSON.parse(localStorage.getItem('currentSession'));
    return currentUser && currentUser.token;
  }

  getPhoto(name:string,page:Number):Observable<PhotoBaseResponse>{
    const httpOptions = PhotoService.getHeaders(name);
    const body = {
      page:page,
    }
    return this.http.post<PhotoBaseResponse>(PhotoService.getAPIPath("/photo/get"),body,{headers:httpOptions.headers});
  }

  validate(name:string,token:string):Observable<TokenBaseResponse>{
    const body = {
      name:name,
      token:token
    }
    return this.http.post<TokenBaseResponse>(PhotoService.getAPIPath("/account/auth"),body);
  }

  update(albumName:string,id:string,name:string,description:string,tags:string,extra:string):Observable<SinglePhotoBaseResponse>{
    
    let formData:FormData = new FormData();
    formData.append("id",id);
    formData.append("name",name);
    formData.append("description",description);
    formData.append("tags",tags);
    formData.append("extra",extra);

    let httpOptions = PhotoService.getHeaders(albumName);

    return this.http.post<SinglePhotoBaseResponse>(PhotoService.getAPIPath("/photo/update"),formData,{headers:httpOptions.headers});
  }
  
  info(name:string):Observable<any>{
    const body = {
      name
    }
    return this.http.post(PhotoService.getAPIPath("/account/info"),body);
  }
  create(name:string,token:string,type:string):Observable<TokenBaseResponse>{
    const body = {
      name,
      token,
      type
    }
    return this.http.post<TokenBaseResponse>(PhotoService.getAPIPath("/account/create"),body);
  }
  downloadPhoto(photo:Photo){
    window.open(PhotoService.getAPIPath("/photo/download?id="+photo.id+"&token="+this.getActiveToken()));
  }
  deletePhoto(photo:Photo):Observable<PhotoBaseResponse>{
    let name = this.getActiveAlbum();
    const httpOptions = PhotoService.getHeaders(name);
    const body = {
      id:photo.id
    }
    return this.http.post<PhotoBaseResponse>(PhotoService.getAPIPath("/photo/delete"),body,{headers:httpOptions.headers});
  }

}
