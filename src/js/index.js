$(function () {

    let jsonUrl = "http://opendata2.epa.gov.tw/AQI.json";
    let jsonData;

    $.ajax({
        url: jsonUrl,
        dataType: 'json',
        success: function (data) {

            let jsonData = data;

            let geojson = {
                type: "FeatureCollection",
                features: [],
            };
            for (i = 0; i < jsonData.length; i++) {
                geojson.features.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [parseFloat(jsonData[i].Longitude), parseFloat(jsonData[i].Latitude)]
                    },
                    "properties": {
                        "SiteName": jsonData[i].SiteName,
                        "County": jsonData[i].County,
                        "AQI": parseInt(jsonData[i].AQI),
                        "Pollutant": jsonData[i].Pollutant,
                        "Status": jsonData[i].Status,
                        "WindSpeed": jsonData[i].WindSpeed,
                        "PublishTime": jsonData[i].PublishTime,
                    }
                });
            };

            map.data.loadGeoJson(geojson);

                let icon;
                let icon_50 = 'images/icon_green.png';
                let icon_100 = 'images/icon_yellow.png';
                let icon_150 = 'images/icon_red.png';
                let icon_200 = 'images/icon_purple.png';
                let icon_nan = 'images/icon_gray.png';

            geojson.features.forEach((e, i) => {
                let lat =  geojson.features[i].geometry.coordinates[1]
                let lng =  geojson.features[i].geometry.coordinates[0]
                let myLatlng = new google.maps.LatLng(lat,lng);

                let geoProperties = geojson.features[i].properties
                
                let site = geoProperties.SiteName;
                let aqi = geoProperties.AQI;
                let status = geoProperties.Status;
                let pollutant = geoProperties.Pollutant;
                let windSpeed = geoProperties.WindSpeed;
                let publishTime = geoProperties.PublishTime;

                let mapIcon = aqi <= 50 ? icon_50 : aqi <= 100 ? icon_100 : aqi <= 150 ? icon_150 : aqi <= 250 ? icon_200 : icon_nan;
                
                let marker = new google.maps.Marker({

                        position: myLatlng,
                        icon: mapIcon,
                        map: map,
                        title: e.geometry.SiteName,
                    });

                let contentString = '<div id="content">'+
                '<h3 id="infoTitle">'+ '測站：'+ site + '</h3>'+
                '<div id="infoContent" >'+
                '<h4>' + 'AQI指數：' + aqi + '</h4>'+
                '<p>' + '空氣品質：' + status + '</p>'+
                '<p>' + '主要污染源：' + pollutant + '</p>'+
                '<p>' + '風速：' + windSpeed + '</p>'+
                '<p>' + '更新時間：' + publishTime + '</p>'+
                '</div>'+
                '</div>';

                let infoWindow = new google.maps.InfoWindow({
                    content: contentString,
                    maxWidth: 250
                });

                google.maps.event.addListener(marker,'click', function() {
                    infoWindow.open(map, marker);
                    setTimeout(function () { infoWindow.close(); }, 5000);
                });

                console.log(aqi);
            });

            let feature = geojson.features;

            let icons = {
                fifty: {
                    name: "AQI指數50以下",
                    icon: icon_50
                },
                hundred: {
                    name: "AQI指數50到100",
                    icon: icon_100
                },
                hundFif: {
                    name: "AQI指數100到150",
                    icon: icon_150
                },
                twoHund: {
                    name: "AQI指數超過150",
                    icon: icon_200
                },
                nan:{
                    name: "監測站睡著了",
                    icon: icon_nan
                }
            };

            let legend = document.getElementById('legend');
            for (let key in icons) {
                let type = icons[key];
                let name = type.name;
                let icon = type.icon;
                let div = document.createElement('div');
                div.innerHTML = '<img src="' + icon + '"> ' + name;
                legend.appendChild(div);
            };

        }
    });
})