from flask import jsonify, make_response

def success(value, message=""):
    return make_response(jsonify({
        "status": "success",
        "message": message,
        "data": value
    }), 200)
    
def bad_request(message=""):
    return make_response(jsonify({
        "status": "bad request",
        "message": message
    }), 400)