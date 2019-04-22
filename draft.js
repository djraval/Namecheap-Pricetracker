const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = "https://www.namecheap.com/domains/";
const currencyList = ['USD','EUR','GBP','CAD','AUD','INR','CNY'];
const symbols={'USD':'$','EUR':'€','GBP':'£','CAD':'C$','AUD':'A$','INR':'Rs','CNY':'¥'}
var PriceList = {}

currencyList.forEach(currency=>{
    console.log("Initiated request for "+currency)
    
    axios.get(url, {headers: {Cookie: ".c="+currency}})
        .then(response=>{
            var TLDList = [];
            const $ = cheerio.load(response.data);
            $('.register').children()
                .each((i,domain)=>{
                    if(!i){
                        return;
                    }
                    var dict = {};
                    dict['TLD']=$(domain).find('.domain a').text();
                    $(domain).find('td p').remove();
                    var prices = $(domain).find('td').text().trim().replace(/\s/g, "");
                    if(currency == 'EUR')
                        prices = prices.replace(/,/g, ".")
                    else
                        prices = prices.replace(/,/g, "")
                    var price_arr = prices.split(symbols[currency])
                    price_arr.shift()
                    dict['price']=price_arr
                    TLDList.push(dict);
                });
            
            PriceList[currency] = TLDList;
        })
        .then(()=>{
            console.log(currency+" completed")
            if(Object.keys(PriceList).length == 7)
                fs.writeFile("data.json", JSON.stringify(PriceList), function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
        })
        .catch(err=>{
            console.log(err);
        });
        

});
