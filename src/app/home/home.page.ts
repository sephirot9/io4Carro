import { DataProviderService } from './../data-provider.service';
import { Component,ViewChild } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { IonList } from '@ionic/angular';
import { AlertController } from '@ionic/angular';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
@ViewChild(IonList) lista: IonList;

  products: any = [];
  selectedProduct: any;
  productFound:boolean = false;
  CarroCompra: any[] = [];
  options: BarcodeScannerOptions;

  

  constructor(private barcodeScanner: BarcodeScanner,
              private toast: Toast, 
              private dataProvider: DataProviderService,
              public alertCtrl: AlertController
              ){
               
                this.dataProvider.getProductsOld()
                .subscribe((response)=> {
                            this.products = response
                            
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
///////////////////////////////////////////////////////////////////////
  scan(){
    this.selectedProduct = {};
    // objeto producto para carro de compras
      let prod: any ={
        cant:1,
        name:'',
        plu:'',
        descr:'',
        price:0
      }; 

    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      //se obtiene el producto en base al codigo leido
      this.selectedProduct = this.products.find(product => product.plu === barcodeData.text);
       

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

            prod.name = this.selectedProduct.name;
            prod.plu = this.selectedProduct.plu;
            prod.price = this.selectedProduct.price;
            prod.descr = this.selectedProduct.descr;

        //valida si existe el producto en carro 
        this.validaProducto(this.CarroCompra, prod);


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
/////////////////////////////////////////////////////////////////
  validaProducto(arr: any[], obj: any) {
    const index = arr.findIndex((e) => e.plu === obj.plu);

    if (index === -1) {
        arr.push(obj);
    } else {
        //arr[index] = obj;
        arr[index].cant = arr[index].cant +1; 
    }
   }
////////////////////////////////////////////////////////////////
  borraProducto(idx: number){
    this.products.splice(idx,1);
    console.log("item eliminado: " + idx);



  }
  ////////////////////////////////////////////////////////////
  sumaCant(idx: number){
    this.products[idx].cant++;
    
  }
  restaCant(idx: number){
    if(this.products[idx].cant>0){
      this.products[idx].cant--;
    }
  }
  ////////////////////////////////77
  async alertConfirmaEliminar(idx: number) {

    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      subHeader: 'Desea eliminar el producto?',
      buttons: [{
                 text:'Cancelar',
                 role: 'Cancel',
                 cssClass: 'secondary',
                 handler: () => {
                     console.log('eliminacion cancelada');
                 }

                },
                {
                  
                 text:'Eliminar',
                 role:'Delete',
                 cssClass:'icon-color',
                 handler: () => {
                    this.products.splice(idx,1);
                    console.log("item eliminado: " + idx);
                  

                }

               

              }]

    });

    await alert.present();

  }
   
}
