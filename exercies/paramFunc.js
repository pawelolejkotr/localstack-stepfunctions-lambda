exports.handler = async (event) => {
    let nameParam = "";


    if (event.name) {
        nameParam = event.name;
    }
   
    else if (event.body) {
        try {
           
            const parsedBody = JSON.parse(event.body);
            nameParam = parsedBody.name;
        } catch (err) {
            console.error("Błąd parsowania body", err);
        }
    }

    const response = {
        statusCode: 200,
        body: "hello " + (nameParam || ""),
    };
    return response;
};
