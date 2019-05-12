# Interview Tracker
Ionic 4 and Angular project(Hybrid Mobile App) to track interviews.
Uses native plugins like google-maps and geolocator to locate places.

## Getting Started

Clone or download the project to your system.

### Prerequisites

Node.js 

```
Install the latest version if you dont have one
```

Android studio and andriod sdk
```
If you want you bundle your app for using on mobile device.
```

Cordova
```
If you want you bundle your app for using on mobile device.
```

### Before use this project...
````
Please replace (API key) in config.xml and package.json files with your API keys.
Follow the steps as on https://developers.google.com/maps/documentation/javascript/get-api-key   for getting your API key
````

### Installing

npm install

```
This will install the dependencies
```

ionic serve
```
This will get the server up and running, you can access it on port 8100 of your localhost
```

ionic build --prod
```
This will generate a www folder for web deployment (Native functionality wont work on web)
```

ionic cordova build android
```
This will generate an application that can be installed on the phones.
```


## Authors

* **Ansley Rodrigues** - *Initial work* - (https://github.com/ansleyr2)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
