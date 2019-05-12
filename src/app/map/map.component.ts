import { Component } from '@angular/core';

import { AppService } from '../app.service';

import {
  Platform,
  LoadingController
} from '@ionic/angular';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from '@ionic-native/google-maps';

@Component({
  selector: 'map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.scss']
})
export class MapComponent {

  map: GoogleMap;
  loading: any;

  constructor(private platform: Platform,
    private loadingCtrl: LoadingController,
    public service: AppService){
  }

  async ngOnInit() {

  }

  async ngAfterViewInit() {
      await this.loadMap();
      this.locate();
    
  }


  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          // lat: 40.709986, 
          // lng: -74.006915
          lat: this.service._lat,
          lng: this.service._lng
        },
        zoom: 18,
        tilt: 30
      }
    });

  }

  async locate() {
    this.map.clear();

    // Move the map camera to the location with animation
    /*this.map.animateCamera({
      target: this._location,
      zoom: 17,
      tilt: 30
    });*/

    // add a marker
    let marker: Marker = this.map.addMarkerSync({
      title: this.service._locationName,
      snippet: '',
      position:{lat: this.service._lat , lng: this.service._lng},
      animation: GoogleMapsAnimation.BOUNCE
    });

    // show the infoWindow
    marker.showInfoWindow();

    // If clicked it, display the alert
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
    });
  }
}
