import pymysql
import pymysql.cursors
from config import Config

connection = pymysql.connect(host=Config.HOST,
                             user=Config.USER,
                             password=Config.PASSWORD,
                             database=Config.DATABASE,
                             charset='utf8mb4',
                             autocommit=True,
                             cursorclass=pymysql.cursors.DictCursor)