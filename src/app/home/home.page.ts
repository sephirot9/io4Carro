import { DataProviderService } from './../data-provider.service';
import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Toast } from '@ionic-native/toast/ngx';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  products: any = [];
  selectedProduct: any;
  productFound:boolean = false;
  

  constructor(private barcodeScanner: BarcodeScanner,
              private toast: Toast, 
              private dataProvider: DataProviderService
              ){
               
                this.dataProvider.getProductsOld()
                .subscribe((response)=> {
                            this.products = response
                            console.log(this.products);
                });

  }

 
//obtener productos
  getProducts() {

    this.dataProvider.getProducts()
    .then(data => {
     alert(data);
      this.products = data;
      console.log(this.products);

    }).catch(err=>{

      this.toast.show('Error..'+ err, '7000', 'center').subscribe(
        toast => {
                  console.log(toast);
                  }
      );

    });
  }
//escaner 
  scan(){
    this.selectedProduct = {};
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      //se obtiene el producto en base al codigo leido
      this.selectedProduct = this.products.find(product => product.plu === barcodeData.text);
       alert(this.products);
       alert(this.selectedProduct);

     if(barcodeData.cancelled){
        //verifica si se cancela la lectura        
        this.toast.show('Lectura Cancelada', '7000', 'center').subscribe(
          toast => {
              console.log(toast);
          }
        );

     }else{
          //valida q el producto buscado contenga informacion
          if(this.selectedProduct !== undefined) {
              this.productFound = true;
          } 
          else {
            //si no encuentra el producto...
            this.productFound = false;
            this.toast.show(`Producto no encontrado`, '5000', 'center').subscribe(
                toast => {
                  console.log(toast);
                }
            );
          } 
     }

     }).catch(err => {
         console.log('Error', err);
         this.toast.show('Error..'+ err, '7000', 'center').subscribe(
          toast => {
              console.log(toast);
          }
        );
     });
  }
}
