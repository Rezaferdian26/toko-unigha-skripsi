from app import app
from app.controllers import product_controller

@app.route('/')
def index():
    return 'Hello, World!'

@app.get('/products')
def users_get():
    return product_controller.index()

@app.get('/products/<id>')
def users_get_id(id):
    return product_controller.show(id)