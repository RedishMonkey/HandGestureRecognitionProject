import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",  # Specify the module and app instance
        host="0.0.0.0",  # Set the host here
        port=8000,       # Set the port here
        reload=True      # Optional: Enable auto-reloading during development
    )