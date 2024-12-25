import os

class Config(object):
    HOST = str(os.environ.get('DB_HOST'))
    USER = str(os.environ.get('DB_USER'))
    PASSWORD = str(os.environ.get('DB_PASSWORD'))
    DATABASE = str(os.environ.get('DB_NAME'))
    
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://{}:{}@{}/{}'.format(USER, PASSWORD, HOST, DATABASE)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_RECORD_QUERIES = True