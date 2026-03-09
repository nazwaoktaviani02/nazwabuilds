from flask import Flask, jsonify

app = Flask(__name__)



@app.route('/')
def hello_world():
    return 'hello world123'

@app.route('/analisa')
def analisa():
    return 'ini adalah hasil analisis terbaru'

@app.route('/analisa/naz')
def analisa_naz():
    return 'ini data nazwa'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)



