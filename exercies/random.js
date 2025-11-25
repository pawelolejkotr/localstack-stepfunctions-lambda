exports.handler = async (event) => {

    const randomNumber = Math.floor(Math.random() * 100) + 1;
    

    const responseBody = {
        message: "Wygenerowana losowa liczba",
        random_number: randomNumber
    };
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(responseBody), 
    };
    
    return response;
};