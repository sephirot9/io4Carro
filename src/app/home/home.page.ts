import { DataProviderService } from './../data-provider.service';
import { Component,ViewChild } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { IonList  } from '@ionic/angular';
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
  subTotal: number = 0;
  iva: number = 0;
  total:number = 0;

  

  constructor(private barcodeScanner: BarcodeScanner,
              private toast: Toast, 
              private dataProvider: DataProviderService,
              public alertCtrl: AlertController
              ){
               
                this.dataProvider.getProductsOld()
                .subscribe((response)=> {
                            this.products = response
                            
                });
                this.sumaTotales()
 
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
    this.sumaTotales()
   }
////////////////////////////////////////////////////////////////
  borraProducto(idx: number){
    this.products.splice(idx,1);
    console.log("item eliminado: " + idx);
    this.sumaTotales()


  }
  ////////////////////////////////////////////////////////////
  sumaCant(idx: number){
    this.products[idx].cant++;
    this.sumaTotales()
  }
  restaCant(idx: number){
    if(this.products[idx].cant>0){
      this.products[idx].cant--;
    }
    this.sumaTotales()
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
                  // this.products.splice(idx,1);
                    this.borraProducto(idx);
      
                }
          }]
    });

    await alert.present();

  }
   /////////////////////////
   sumaTotales(){
     this.subTotal=0;
     this.iva=0;
     this.total=0;
     let t=0;
     this.products.forEach(function(obj:any) {
      t+= parseInt(obj.cant)*parseInt(obj.price);
       
     });
     this.subTotal=t;
     this.iva=t*0.19;
     this.total=t + this.iva;
   }
////////////////////////////////////////////
async alertBuscaRfid() {

  const alert = await this.alertCtrl.create({
    header: 'Leer Etiqueta',
    //subHeader: 'Desea eliminar el producto?',
    inputs:[{
              id:'txtRfid',
              name: 'txtRfid',
              type: 'text',
              
              
              placeholder: 'Codigo RFID'
            }],
    buttons: [  {
                  text:'Cancelar',
                  role: 'Cancel',
                  cssClass: 'secondary',
                  handler: () => {
                      console.log('rfid cancelada');
                }

              },
                {
                  
                  text:'Aceptar',
                  role:'ok',
                  cssClass:'botonRfid',
                  handler: ( data ) => {
                    console.log('rfid---', data);
                    
                    this.obtenerProductoRfid(data.txtRfid);
      
                }
        }]
  });

      await alert.present()
        .then(() => {
          //coloca foco en input del alert
          document.getElementById('txtRfid').focus();
          document.getElementById('txtRfid').addEventListener("keypress", function(e){
            //e==e || window.event;
            if (e.keyCode == 13) {
              console.log('enter');
              console.log (document.getElementsByClassName('botonRfid'));
              //se obtiene el boton en base a la clase
              var ele = document.getElementsByClassName('botonRfid');
              //recorremos el array de objetos para hacer clic a los elementos
              //obviar el error
              for (var i=0;i<ele.length; i++) {
                ele[i].click();
              }
            }

          }
          
          ,false);
        })
        .catch();

 }

//////////////////////////////////////////////
obtenerProductoRfid(codigo:string){
    alert('codigo'+ codigo);
}



}
