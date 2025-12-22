from fastapi import FastAPI

app = FastAPI()

# @app.get("/quartiers")
# def read_quartiers():
#     return [{"nom": "Plateau-Mont-Royal", "score": 82}]
@app.get("/")
def read_root():
    return {"message": "Hello FastAPI!"}