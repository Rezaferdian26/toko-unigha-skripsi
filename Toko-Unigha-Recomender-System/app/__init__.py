from flask import Flask, request
from flask_cors import CORS

import os

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
cors = CORS(app)

from app import routes