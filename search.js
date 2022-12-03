const fs = require('fs');
const { mainModule } = require('process');
const readline = require('readline');
var url = "mongodb+srv://app_user1:Qr1N4RSUez0FhyiL@cluster0.bhen7uz.mongodb.net/?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;




async function mongoinsert(c_name, tick) {
    try {
        const client = await MongoClient.connect(url, {useUnifiedTopology: true})
        .catch( err => {console.log(err.stack);
        console.log(err.name); console.log(err.message); });
        if(!client) {
            console.log("no client");
            return;
        }
        const dbo = await client.db('stocker_app');
        const collections =  await dbo.collection('equities');
        options = { projection: { _id: 0, name: 1, ticker: 1 }};//removing the id # from the find() response
        var answer;

        if(c_name !== "" && tick === ""){//want to find company with company name
            findname = { name: c_name };
            answer  = await collections.find(findname, options).toArray();
            //returns the only response from the query 
        }else if(c_name === "" && tick !== ""){//want to find company with ticker
            findtick = {ticker: tick};
            answer = await collections.find(findtick, options).toArray();//getting the response from databse 

        }else if(c_name !== "" && tick !== "") {//want to insert document into database
            var insert = { name: c_name, ticker: tick };
            result = await collections.insertOne(insert);//insert document into database
        }
        client.close();//closes the connection to the database
        return answer;//returns a promise that contains the response of find query. 

    }
    catch(err){
        console.log('Database error:' + err);
    }

}

function writedatabase() {
    const r1 = readline.createInterface({//creating a input stream 
        input: fs.createReadStream('./companies.csv'),
        terminal: false,
    });

    r1.on('line', (line) => {// reads the document line by line
        if (line !== 'Company,Ticker') {//ignore the first line containing the table headers
            var i = line.indexOf(',');
            var comp_name = line.substring(0, i)
            var symbol = line.substring(i + 1, (line.length));//split the line by company name and stock ticker
            mongoinsert(comp_name, symbol);//insert into the mongoinsert() to insert the components into the database
        }
    })
        .on('close', () => {//at the end of the file
            console.log('Finished');
        });
}
module.exports = {mongoinsert, writedatabase};
