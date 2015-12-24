Router.route('clearAll', {
    path: '/api/clear/locations',
    where: 'server',
    action: function() {

        var text;
        var hasError = false;
        Meteor.call('clearAllDirections',function(error, result){
            if(error){
                hasError = true;
                text = error;
            } else {
                text = "La operacion se realizo con exito!";
            }
        });

        if ( hasError ){
            this.response.writeHead(500, {'Content-Type': "application/json"});
            var json = JSON.stringify({
                mensage: text
            });
            this.response.end(json);
        } else {
            this.response.writeHead(200, {'Content-Type': "application/json"});
            var json = JSON.stringify({
                mensage: text
            });
            this.response.end(json);
        }

    }
});

Router.route('createLocations', {
    path: '/api/create/locations/origen/:origen/destination/:destination/distance/:distance',
    where: 'server',
    action: function() {

        var origen = this.params.origen;
        var destination = this.params.destination;
        var distance = this.params.distance;

        var text;
        var hasError = false
        Meteor.call('insertDirections',origen,destination,distance,function(error, result){
            if(error){
                hasError = true;
                text = error;
            } else {
                if ( result ){
                    text = "Se creo con exito" + origen + " - " + destination + " Distancia:"  + distance  ;
                } else {
                    text = "Este origen y este destino se han creado previamente." ;
                }
            }
        });

        if ( hasError ){
            this.response.writeHead(500, {'Content-Type': "application/json"});
            var json = JSON.stringify({
                mensage: text
            });
            this.response.end(json);
        } else {
            this.response.writeHead(200, {'Content-Type': "application/json"});
            var json = JSON.stringify({
                mensage: text
            });
            this.response.end(json);
        }

    }
});

Router.route('getShortLocation', {
    path: '/api/short/location/origem/:origem/destination/:destination/autonomy/:autonomy/price/:price',
    where: 'server',
    action: function() {

        var origem = this.params.origem;
        var destination = this.params.destination;
        var autonomy = this.params.autonomy;
        var price = this.params.price;

        var erro;
        var shortDirection;
        Meteor.call('getShortDirections',origem,destination,function(error, result){
            if(error){
                erro = error;
            } else {
                shortDirection = result;
            }
        });

        var total ;
        var totalDistance ;
        var paths;
        if ( shortDirection[0] && shortDirection[0].totalDistance ){
            var totalDistance = shortDirection[0].totalDistance;
            var qt = Math.abs(totalDistance) / Math.abs(autonomy);
            total = Math.abs(qt * price).toFixed(2);
        }

        if ( erro ){
            this.response.writeHead(500, {'Content-Type': "application/json"});
            var mensage = erro;
            var json = JSON.stringify({
                mensage: mensage
            });
            this.response.end(json);
        } else {
            this.response.writeHead(200, {'Content-Type': "application/json"});
            var json = JSON.stringify({
                paths: paths,
                totalDistance: totalDistance,
                total:total
            });
            this.response.end(json);
        }
    }
});

