from mongoengine import connect

connect(
    db='mydatabase',
    host='localhost',
    port=27017
)