from flask import Flask ,jsonify ,request
# del modulo flask importar la clase Flask y los métodos jsonify,request
from flask_cors import CORS # del modulo flask_cors importar CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow


app = Flask(__name__)

CORS(app)


app.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://root:1234567@localhost/proyecto'


app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False


db= SQLAlchemy(app)

ma=Marshmallow(app)


class Producto(db.Model): # la clase Producto hereda de db.Model
    id=db.Column(db.Integer, primary_key=True) #define los campos de la tabla
    nombre=db.Column(db.String(100))
    descripcion=db.Column(db.String(100))
    precio=db.Column(db.Integer)
    stock=db.Column(db.Integer)
    imagen=db.Column(db.String(400))

    def __init__(self,nombre,descripcion,precio,stock,imagen):
        self.nombre=nombre
        self.descripcion=descripcion
        self.precio=precio
        self.stock=stock
        self.imagen=imagen




with app.app_context():
    db.create_all()


class ProductoSchema(ma.Schema):
    class Meta:
        fields=('id','nombre','descripcion','precio','stock','imagen')


producto_schema= ProductoSchema()
productos_schema=ProductoSchema(many=True)


@app.route('/productos',methods=['GET'])
def get_Productos():
    all_productos=Producto.query.all()
    result=productos_schema.dump(all_productos)

    return jsonify(result)



@app.route('/productos/<id>',methods=['GET'])
def get_producto(id):
    producto=Producto.query.get(id)
    return producto_schema.jsonify(producto)



@app.route('/productos/<id>',methods=['DELETE'])
def delete_producto(id):
    producto=Producto.query.get(id)
    db.session.delete(producto)
    db.session.commit()
    return producto_schema.jsonify(producto) # me devuelve un json con el registro eliminado


@app.route('/productos', methods=['POST']) # crea ruta o endpoint
def create_producto():
    #print(request.json) # request.json contiene el json que envio el cliente
    nombre=request.json['nombre']
    descripcion=request.json['descripcion']
    precio=request.json['precio']
    stock=request.json['stock']
    imagen=request.json['imagen']
    new_producto=Producto(nombre,descripcion,precio,stock,imagen)
    db.session.add(new_producto)
    db.session.commit()
    return producto_schema.jsonify(new_producto)


@app.route('/productos/<id>' ,methods=['PUT'])
def update_producto(id):
    producto=Producto.query.get(id)
    producto.nombre=request.json['nombre']
    producto.descripcion=request.json['descripcion']
    producto.precio=request.json['precio']
    producto.stock=request.json['stock']
    producto.imagen=request.json['imagen']
    db.session.commit()
    return producto_schema.jsonify(producto)



@app.route('/busqueda', methods=['POST'])
def search():
    data = request.json['lista']

    resultados = Producto.query.filter(db.or_(*[Producto.descripcion.ilike(f'%{palabra}') for palabra in data])).all()


    registros  = [{'id':registro.id,'nombre':registro.nombre,'descripcion':registro.descripcion,'precio':registro.precio,'stock':registro.stock,'imagen':registro.imagen} for registro in resultados]

    return jsonify(registros)

    

# programa principal *******************************
if __name__=='__main__':
    app.run(debug=True, port=5000)