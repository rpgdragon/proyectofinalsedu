var request = require('request');
var mysql = require('mysql');

var API_KEY = 'S39QF79NF6FIANRQ'; // ThingSpeak 'write' API key


function read() {
    //hay que leer los datos de la base de datos	
  var connection = mysql.createConnection({
     host     : 'localhost',
     user     : 'root',
     password : '51q7d00DRAGARIES',
    database : 'SEDU19'
 });
   
 connection.connect();
    connection.query('SELECT * FROM sensores ORDER BY fecha ASC', function (error, results, fields) {
     		if (error){
			console.log('Se ha producido un error al  buscar los datos. ' + error);
    		}
		if(results!=null && results!=undefined){
    			console.log(results.length);
		//recorremos todos los datos
		results.forEach(function(element) {
			//se supone que si esta en la DB es que son correctas ya
			uploadData(element);
			//una vez procesado el dato lo borramos
                	connection.query('DELETE FROM sensores WHERE id=' +  element.id);
                        //dormimos un segundo para que de tiempo a propagarse los cambios
			dormir(1);
		});
	}
	connection.end();
    });

    setTimeout(read, 30000); // 20 seconds gap between reads 
}

// inti read
read();

function uploadData(data) {
    var options = {
        method: 'POST',
        url: 'https://api.thingspeak.com/update',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            field1: data.ldr,
            field2: data.temp,
	    field3: data.hum,
            field4: data.angX,
            field5: data.angY,
            created_at: data.fecha,
            api_key: API_KEY
        }
    };
    
    request(options, function(error, response, body) {
        if (error) { console.log(error) };
    });
}

function dormir(segundos)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < segundos*1000);
}
