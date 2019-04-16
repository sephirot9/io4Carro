import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  url = 'http://app.teracloud.cl/api/v1/';

  constructor(public http: HttpClient,public httpOld: Http) {
    console.log('provider data-provide is start!!')
   }

  getProducts(){
    return new Promise(resolve => {
      this.http.get(this.url+'/products.php').subscribe(data => {
        resolve(data);
      }, err => {
       
        console.log(err);
      });
    });
  }
  
  getProductsOld(){
    return this.httpOld.get(this.url+'/products.php').pipe(map
          ((response:Response)=>response.json()));  
  }

  // addSale(data: any){
  //   return this.httpOld.post(this.url+'/sales.php', data).subscribe((response) => {
  //            console.log(response);
  //     });
  // }
  
  addSale(data: any) {
    return new Promise((resolve, reject) => {
      this.httpOld.post(this.url+'/sales.php', JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
}
