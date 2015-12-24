Meteor.N4JDB = new Meteor.Neo4j("http://neo4j:neo@localhost:7474");
var Future = Npm.require( 'fibers/future' );

Meteor.methods({
    insertDirections: function(origen,destination,distance){
        var origenFinded =  findLocation(origen);
        var hasOrigen = false;
        if ( origenFinded.length > 0) hasOrigen = true;
        if ( !hasOrigen ){
            createLocation(origen);
        }
        var destinationFinded =  findLocation(destination);
        var hasDestination = false;
        if (  destinationFinded.length > 0 ) hasDestination = true;
        if ( !hasDestination ){
            createLocation(destination);
        }

        var path = findPath(origen,destination);
        var hasPath = false;
        if ( path.length > 0 ) hasPath = true;
        if ( !hasPath  ){
            createPath(origen,destination,distance);
        }

        if ( hasOrigen && hasDestination && hasPath){
            return false;
        } else {
            return true;
        }

    },
    getShortDirections: function(origem,destination){

        var query='MATCH (from:Location { name:"'+origem+'" }), (to:Location { name: "'+destination+'"}) , path = (from)-[:CONNECTED_TO*]->(to) '+
        ' RETURN path AS shortestPath,'+
        ' reduce(distance = 0, r in relationships(path) | distance+r.distance) AS totalDistance'+
        ' ORDER BY totalDistance ASC'+
        ' LIMIT 1';

        var future = new Future();

        Meteor.N4JDB.query(query, null, function(err, data){
            if ( err ) {
                future.return( err );
            } else {
                future.return( data );
            }
        });

        return future.wait();
    },
    clearAllDirections: function(){
        Meteor.N4JDB.query(
            'MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r'
        );
    }

});

function findLocation(location){
    var future = new Future();
    var queryFindPoint = 'MATCH (n:Location { name:"'+location+'" }) RETURN n LIMIT 1';
    Meteor.N4JDB.query(queryFindPoint, null, function(err, data){
        if ( err ) {
            future.return( err );
        } else {
            if ( data ){
                future.return( data );
            } else {
                future.return( false );
            }

        }
    });
    return future.wait();
}

function createLocation(location){
    var query =  'CREATE ('+location+':Location { name: "'+location+'" })';
    Meteor.N4JDB.query(query);
}

function createPath(origen,destination,distance){
    var query = 'MATCH (o:Location { name:"'+origen+'" })'+
        'MATCH (d:Location { name:"'+destination+'" })'+
        'CREATE'+
        '(o)-[:CONNECTED_TO { distance: '+distance+' }]->(d)';
    Meteor.N4JDB.query(query);
}

function findPath(origen,destination){
    var future = new Future();
    var query = 'MATCH (from:Location { name:"'+origen+'" }), (to:Location { name: "'+destination+'"}) , path = (from)-[:CONNECTED_TO]->(to) RETURN path LIMIT 1';
    Meteor.N4JDB.query(query, null, function(err, data){
        if ( err ) {
            future.return( err );
        } else {
            future.return( data );
        }
    });
    return future.wait();
}


