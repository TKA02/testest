const http = require('http');
const address = require('url');

http.createServer((req, res) => {
    var page = buildhtml(req);
    var message = '';
    var hold = [];
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(page);
    // res.write('TIMIIIIIIIIII')
    var qobj = address.parse(req.url, true).query
    if(qobj.submit_btn === 'Submit') {//user has clicked the submit button
        pro = clicker(req);
        pro.then(
            (value) => {
                hold = value;
                console.log(hold);
                console.log('after pressing submit ......');
                res.write('<p>Results are the following: </p>');
                value.forEach(element => {
                    res.write('<p>Company name: ' + element.name + ' Stock Ticker: ' + element.ticker + '</p>');
                    console.log("Checking foreach");
                    console.log(element.name);
                    console.log(element.ticker);
                });
            },
            (error) => {
                console.log(error);
            }
        )
        hold.forEach(element => {
            res.write(element.name + ', ' +  element.ticker);
        })
    }
    //search_bar: user input bar
    //btns_name: radio buttons of company name
    //btns_ticker: radio buttons of stock ticker
    res.end('</body></html>');//insert the form to the page then exit 
}).listen(8080);

//to build the html page 
function buildhtml() {
    var header = '';
    var form = '';
    header = '<!DOCTYPE html>' + '<html> <head> </head>';
    form = '<body style="background-color:beige"><div style="text-align:center"> ' + '<h1 style="border-bottom: 1px solid black; padding-bottom: 15px">Stock Ticker</h1>'
    +'<form action="#" method="GET"> <label for="#">Search Bar <span style="color:red">*</span>:</label>'
        + '<input type="text" placeholder="Company Name or Symbol" name="search_bar">'
        + '<br> <br> ' + '<input type="radio" name="btns_name" id="comp_name">' + '<label for="comp_name">Company Name</label>'
        + '<input type="radio" name="btns_ticker" id="comp_symbol"> <label for="comp_symbol">Stock Ticker</label>'
        + '<br> <br> <input type="submit" name="submit_btn"> </form> </div>';

    return header + form;
}



//querys database aganist the users input and returns result
async function clicker(req) {
    const module = require('./search');//get functions in module.export from search.js
    const adr = require('url');
    var obj = adr.parse(req.url, true).query;//geting the query string
    // console.log('inside function');
    var promise;

    if (obj.btns_name === 'on') {//user puts in a company name
        // console.log('querying company name: ' + obj.search_bar);
        promise = await module.mongoinsert(capitalize(obj.search_bar), '');
    } else if (obj.btns_ticker === 'on') {//user puts in a stock ticker
        // console.log('querying stock ticker: ' + obj.search_bar);
        var tick = obj.search_bar.toUpperCase();//make the user stock ticker all uppercase
        promise = await module.mongoinsert('', tick);
    }
    return promise;
} 

//capitalizes the first character of the company name before querying database
function capitalize(word){
    return word.charAt(0).toUpperCase() + word.slice(1);
