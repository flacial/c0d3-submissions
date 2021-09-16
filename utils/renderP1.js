const renderP1 = (visitors, city, coordinates, hostUrl) => (
  `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                      #map { height: 100%; border-radius: 20px; box-shadow: 0 8px 10px 2px #cecece; margin-bottom: 60px }
                      html,
                      body { height: 100%; margin: 0; padding: 0; }
                      html { padding: 30px; font-family: san-serif; }
                      #visitors_list { max-height: 300px; display: flex; flex-direction: column; row-gap: 14px; margin-bottom: 30px; overflow-x: auto;}
                      .visitor { display: flex; }
                      .visitorsCount { font-size: 21px; font-weight: bold; font-family: monospace; }
                      .country { margin-right: 20px; font-size: 21px; font-weight: 700; }
                      h1 { font-family: sans-serif; color: #313131; font-weight: 700; letter-spacing: 1px; text-shadow: 0 0 19px #0000004a; }
                      .countryName span { color: cornflowerblue; }
                      a { text-decoration: none; }
                      a:hover { color: #0000af; }
                  </style>
                  <title>IP Geolocation</title>
              </head>
              <body>
                  <h1 class="countryName"></h1>
                  <div id="map"></div>
                  <h1>Visitors Countries</h1>
                  <div id="visitors_list">
                  ${Object.entries(visitors).reduce((acc, [VisitorCountry, { count: visitorsCount }]) => acc
                    += `
                      <div class="visitor">
                        <a href="${hostUrl}/${VisitorCountry}">
                            <span class="country">${VisitorCountry}</span>
                            <span class="visitorsCount">${visitorsCount}</span>
                        </a>
                      </div>
                      `, '')}
                  </div>
                  <script async
                      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB29pGpCzE_JGIEMLu1SGIqwoIbc0sHFHo&amp;callback=initMap">
                  </script>
                  <script>
                      const countryName = document.querySelector('.countryName')
                      let map;
      
                      async function initMap() {
                          countryName.innerHTML = "You're visiting from: " + "<span>${city}</span>"
      
                          map = new google.maps.Map(document.querySelector("#map"), {
                              center: ${JSON.stringify(coordinates)},
                              zoom: 12,
                          });
      
                          new google.maps.Marker({
                              position: ${JSON.stringify(coordinates)},
                              map,
                              title: "Your Location",
                          });
                      }
                  </script>
              </body>
              </html>
          `
);

export default renderP1;
