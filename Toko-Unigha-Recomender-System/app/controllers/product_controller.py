from app import response
from flask import request
import requests
from app.connection import connection
import pandas as pd
from config import Config
from app.utils.RecommenderSystem import RecommenderSystemDataSql


def index():
    user_id = request.args.get('usr')
    try:
        with connection.cursor() as cursor:
            # MENCARI SEMUA PRODUK
            sql = "SELECT products.id, products.name, products.slug, products.description, products.`condition`, products.price, products.stock, tokos.name AS toko_name, tokos.slug AS toko_slug, categories.name AS category_name,  GROUP_CONCAT(JSON_OBJECT('id', product_images.id, 'image_path', product_images.image_path) SEPARATOR ',') AS image FROM products INNER JOIN product_images ON products.id = product_images.product_id INNER JOIN tokos ON products.toko_id = tokos.id INNER JOIN categories ON products.category_id = categories.id GROUP BY products.id;"
            # MENCARI SEMUA PRODUK BERDASARKAN USER ID
            sql2 = '''
                    SELECT ua.user_id, ua.product_id, p.name AS product_name, p.description, p.condition, 
                        t.name AS toko_name, c.name AS category_name, ua.created_at, ua.updated_at
                    FROM user_activities ua
                    INNER JOIN products p ON ua.product_id = p.id
                    INNER JOIN tokos t ON p.toko_id = t.id
                    INNER JOIN categories c ON p.category_id = c.id
                    WHERE ua.user_id = %(user_id)s
                    ORDER BY ua.created_at DESC
                '''
            
            # MENGAMBIL DATA DAN MEMBUAT DATAFRAME MENGGUNAKAN PANDAS
            df = pd.read_sql(sql, Config.SQLALCHEMY_DATABASE_URI)
            df2 = pd.read_sql(sql2, Config.SQLALCHEMY_DATABASE_URI, params={'user_id': user_id})
            
            # MENGGABUNGKAN SELURUH ROW DAN MENYIMPANNYA KE KOLOM METADATA
            df['metadata'] = df.apply(lambda row: f"{row['name']} {row['description']} kondisi {row['condition']} {row['toko_name']} kategori {row['category_name']}", axis=1)
            df2['metadata'] = df2.apply(lambda row: f"{row['product_name']} {row['description']} kondisi {row['condition']} {row['toko_name']} kategori {row['category_name']}", axis=1)
            
            # MENGGABUNGKAN SEMUA HASIL DAN MENYIMPANNYA KE DALAM VARIABEL
            result_string = ' '.join(df2['metadata'])
            
            # INITIALISASI CLASS RECOMMENDER SYSTEM
            recsys = RecommenderSystemDataSql(df, 'metadata')
            # PROSES ENCODING
            recsys.fit()
            # HASIL REKOMENDASI
            data = recsys.recommend(result_string)
           
            return response.success(data)
    except Exception as e:
        print(e)
        return response.bad_request(str(e))

def show(id):
    # MENCARI SEMUA PRODUK
    sql = "SELECT products.id, products.name, products.slug, products.description, products.`condition`, products.price, products.stock, tokos.name AS toko_name, tokos.slug AS toko_slug, categories.name AS category_name,  GROUP_CONCAT(JSON_OBJECT('id', product_images.id, 'image_path', product_images.image_path) SEPARATOR ',') AS image FROM products INNER JOIN product_images ON products.id = product_images.product_id INNER JOIN tokos ON products.toko_id = tokos.id INNER JOIN categories ON products.category_id = categories.id GROUP BY products.id;"
    sql2 = "SELECT products.id, products.name, products.slug, products.description, products.`condition`, products.price, products.stock, tokos.name AS toko_name, tokos.slug AS toko_slug, categories.name AS category_name,  GROUP_CONCAT(JSON_OBJECT('id', product_images.id, 'image_path', product_images.image_path) SEPARATOR ',') AS image FROM products INNER JOIN product_images ON products.id = product_images.product_id INNER JOIN tokos ON products.toko_id = tokos.id INNER JOIN categories ON products.category_id = categories.id WHERE products.id = '{}' GROUP BY products.id;".format(id)
    
    # MENGAMBIL DATA DAN MEMBUAT DATAFRAME MENGGUNAKAN PANDAS
    df = pd.read_sql(sql, Config.SQLALCHEMY_DATABASE_URI)
    df2 = pd.read_sql(sql2, Config.SQLALCHEMY_DATABASE_URI)
    
    # MENGGABUNGKAN SELURUH ROW DAN MENYIMPANNYA KE KOLOM METADATA
    df['metadata'] = df.apply(lambda row: f"{row['name']} {row['description']} kondisi {row['condition']} {row['toko_name']} kategori {row['category_name']}", axis=1)
    df2['metadata'] = df2.apply(lambda row: f"{row['name']} {row['description']} kondisi {row['condition']} {row['toko_name']} kategori {row['category_name']}", axis=1)
    
    # INITIALISASI CLASS RECOMMENDER SYSTEM
    recsys = RecommenderSystemDataSql(df, 'metadata')
    # PROSES ENCODING
    recsys.fit()
    # HASIL REKOMENDASI
    data = recsys.recommend(df2['metadata'][0])

    return response.success(data)