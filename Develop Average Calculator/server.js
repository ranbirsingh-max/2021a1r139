const express = require ('express');
const axios = require ('axios');
const app = express();
const port = 9876;

const windowSize = 10;
let numberWindow = [];

const fetchNumbersFromServer = async (type)=> {
    try{
        const response = await axios.get('http://20.244.56.144/test/${type}',{timeout : 500});
        return response.data.numbers;
    }catch(error){
        console.error('failed to fetch ')
        return [];
    }
};

const updateNumberWindow = (newNumbers)=>{
    newNumbers.forEach(num => {
        if(!numberWindow.includes(num)){
            if(newNumbers.length >= windowSize){
                numberWindow.shift();
            }
            numberWindow.push(num);
        }
    });
};

const calculateAverage =  ()=>{
    if(numberWindow.length === 0) return 0;
    const sum = numberWindow.reduce((acc,num) => acc + num,0);
    return parseFloat((sum / numberWindow.length).toFixed(2));
};
app.get('/numbers/:type',async(req,res)=> {
    const{type} = req.params;
    const validTypes = {
        p:'primes',
        f:'fibo',
        e:'even',
        r:'rand',
    };
    if(!validTypes[type]){
        return res.status(400).json({error:'invalid'});
    }
    const numbersFetched = await fetchNumbersFromServer(validTypes[type]);
    const previousState = [...numberWindow];
    updateNumberWindow(numbersFetched);
    const currentState = [...numberWindow];
    const average = calculateAverage();

    res.json({
        windowPrevState :previousState,
        windowCurrState:currentState,
        numbers:numbersFetched,
        avg:average
    });

});

app.listen(port,() =>{
    console.log('Success')
})
