/*Allow query client execute*/
Meteor.neo4j.allowClientQuery = true;
/*Url Conection*/
Meteor.neo4j.connectionURL = 'http://neo4j:neo@localhost:7474';
/* But deny all writing actions on client */
Meteor.neo4j.set.deny(neo4j.rules.write);	
