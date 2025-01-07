# run api #
**description:** the command to run api  
**command:** uvicorn "main file name":"app virable name"  
**example:** uvicorn main:app  
notice the file name extension .py is not in the file name

# testing the api #
**explanation:** there is a built in way to test fast api endpoints without using outside tools like postman  
**how:** the endpoint *"domain"/docs* is a buit in endpoint that lets you test infront of all endpoints created an example input and returns an example output  

**extra parameters:** uvicorn main:app --host 0.0.0.0 --port 8000  
**--host** sets from what ip can access
**--port** sets on what port it will run