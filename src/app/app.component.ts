import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public counter=0;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private toastCtrl: ToastController
  ) {
    this.initializeApp();
    this.backButtonEvent();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

  }
  backButtonEvent(){
    this.platform.backButton.subscribe(() => {
      //navigator['app'].exitApp();
      if (this.counter ==0){
        this.counter++;
        this.presentToast();
        setTimeout(() => {this.counter =0},3000);

      }else{
        navigator['app'].exitApp();
      }
    });
  }
  
  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Presione de nuevo para Salir',
      duration: 3000,
      position: 'middle'
    });

    toast.present();

    // let toast1 = this.toastCtrl.create({
    //   message: "Press again to exit",
    //   duration: 3000,
    //   position: "middle"
    // });
    // toast.then();
  }
  
}
